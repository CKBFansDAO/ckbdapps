import { useState } from 'react';
import { RPC, BI } from "@ckb-lumos/lumos";
import { useQuery } from '@tanstack/react-query';
import { getNextHalvingEpoch, getPrevHalvingEpoch } from '../utils/helper';

// JSONRPC url
const rpc = new RPC("https://mainnet.ckb.dev");
// testnet
//const rpc = new RPC("https://inside.ckb.dev");


//
const EVERY_EPOCH_TIME_INTERVAL = 1000;

// The block information of the base epoch is used to estimate the halving time, 
// and the average time consumed for each epoch is calculated starting from this block information.
let gBaseEpochBlockInfo = new Map();

let gPrevHalvingBlockInfo = new Map();

// 
const useCKBHalving = () => {
    const [tipHeader, setTipHeader] = useState({
        dao: 0,
        epoch: {
            index: 0,
            length: 0,
            number: 0
        },
        number: 0,
        timestamp: 0
    });
    const [prevHalvingTime, setPrevHalvingTime] = useState();
    const [nearHalving, setNearHalving] = useState(false);

    const getTipHeader = async () => {
        const tipHeader = await rpc.getTipHeader();
        const curEpoch = parseEpoch(tipHeader.epoch);
        /*    const res = {    
                epoch: curEpoch,
                number:BI.from(tipHeader.number).toNumber(),
                timestamp: BI.from(tipHeader.timestamp).toNumber()
            };
            setTipHeader(res);
    */
        return curEpoch;
    }

    const parseEpoch = (epoch) => {
        const epochBI = BI.from(epoch);
        return {
            length: epochBI.shr(40).and(0xffff).toNumber(),
            index: epochBI.shr(24).and(0xffff).toNumber(),
            number: epochBI.and(0xffffff).toNumber(),
        };
    }

    const getEpochStartBlock = async (epoch_index) => {
        let cacheBlockInfo = gBaseEpochBlockInfo.get(epoch_index);
        if (cacheBlockInfo) {
            return cacheBlockInfo;
        }

        gBaseEpochBlockInfo.clear();

        const epochInfo = await rpc.getEpochByNumber(BI.from(epoch_index).toBigInt());
        let blockInfo = await rpc.getHeaderByNumber(epochInfo.startNumber);

        gBaseEpochBlockInfo.set(epoch_index, blockInfo);

        return blockInfo;
    }

    const getBlockInfo = async (block_index) => {
        const blockInfo = await rpc.getHeaderByNumber(block_index);
    }

    const getPrevHalvingBlockInfo = async (curEpochNumber) => {
        let prevHalvingEpoch = getPrevHalvingEpoch(curEpochNumber);
        if (prevHalvingEpoch > 0) {
            let cacheBlockInfo = gPrevHalvingBlockInfo.get(prevHalvingEpoch);
            if (cacheBlockInfo) {
                return cacheBlockInfo;
            }

            const epochInfo = await rpc.getEpochByNumber(BI.from(prevHalvingEpoch).toBigInt());
            let blockInfo = await rpc.getHeaderByNumber(epochInfo.startNumber);

            gPrevHalvingBlockInfo.set(prevHalvingEpoch, blockInfo);

            return blockInfo;
        }

        // not halved yet
        return null;
    }

    const parseDAO = (data) => {
        //data = 0x7234aae1a5119e4947929146a2af2700f9078b2209b927050050af6b94753307
        //data = "0xf58d415622164d4670846fe4bc3e2700245b3a328b3376040071df7757eb2e07";
        let dataString = data;
        let res = dataString.slice(2)
            .match(/\w{16}/g)
            .map(value => '0x' + value.match(/\w{2}/g).reverse().join(''))
            .map(value => BI.from(value).toBigInt())

        return res;
    }

    const { data: result, isLoading, isError } = useQuery(
        ["ckbhalving"], async () => {
            const tipHeader = await rpc.getTipHeader();

            const curEpoch = parseEpoch(tipHeader.epoch);
            //console.log(1);
            //console.log((BI.from(113)).toBigInt());
            /*const b = await rpc.getHeaderByNumber((BI.from(0)).toBigInt());
            console.log(b);
            const dao_data = parseDAO('0x8268d571c743a32ee1e547ea57872300989ceafa3e710000005d6a650b53ff06');
            console.log(dao_data);*/

            let prevHalvingBlockInfo = await getPrevHalvingBlockInfo(curEpoch.number);
            if (prevHalvingBlockInfo) {
                setPrevHalvingTime(BI.from(prevHalvingBlockInfo.timestamp).toNumber());
            }

            // Calculate the target epoch.
            const targetEpoch = getNextHalvingEpoch(curEpoch.number);

            // 最后一个epoch的前一半使用原有算法；进入到最后100个区块，改为10秒钟更新一次
            const shouldUseRealTime = (targetEpoch - curEpoch.number <= 1) && (curEpoch.index / curEpoch.length) > 0.5;
            const isNearHalving = shouldUseRealTime && curEpoch.length - curEpoch.index < 100;
            setNearHalving(isNearHalving);
            let estimatedHalvingTime;
            if (shouldUseRealTime) {
                // 获取到最后一个epoch的起始区块，
                const curEpochStartBlock = await getEpochStartBlock(curEpoch.number);
                // todo
                /*if (curEpoch.index > 1360) {
                    //curEpoch.length = 800;//curEpoch.index + 10;
                    prevHalvingBlockInfo = {
                        timestamp: "0x18bccd70c51"
                    }
                }
                else {
                    curEpoch.length = 1360;//curEpoch.index + 10;
                    setNearHalving(true);
                }*/
                
              
                // 本epoch截至现在所耗费的时间？
                let curEpochUsedTime = (BI.from(tipHeader.timestamp).toNumber() - BI.from(curEpochStartBlock.timestamp).toNumber())
                // 本epoch平均每一个块消耗的时间
                let everyBlockTime = curEpochUsedTime / curEpoch.index;
                //console.log(everyBlockTime);
                // 预估减半的时间，需要等到下一个epoch诞生的时候，才确认减半，所以区块数量 + 1
                estimatedHalvingTime = Math.floor(everyBlockTime * (curEpoch.length + 1 - curEpoch.index)) + BI.from(tipHeader.timestamp).toNumber();
                //console.log('calcu:\t', estimatedHalvingTime, new Date(estimatedHalvingTime).toLocaleString());
            }
            else {
                // Calculate the time spent on the latest 1000 epochs.
                const t0Epoch = await getEpochStartBlock(curEpoch.number - EVERY_EPOCH_TIME_INTERVAL);
                //console.log(t0Epoch);

                let subTime = (BI.from(tipHeader.timestamp).toNumber() - BI.from(t0Epoch.timestamp).toNumber())
                
                let curEpochProgress = curEpoch.index / curEpoch.length;

                let avgEpochTime = subTime / (EVERY_EPOCH_TIME_INTERVAL + curEpochProgress);
                //console.log(avgEpochTime);

                // Calculate the duration and time of the target epoch.
                const targetDuration = Math.floor((targetEpoch - (curEpoch.number + curEpochProgress)) * avgEpochTime); // Time until epoch in milliseconds.

                //const estimatedHalvingTime = Date.now() + targetDuration; // Date in the future when the epoch will occur.
                estimatedHalvingTime = BI.from(tipHeader.timestamp).toNumber() + targetDuration; // Date in the future when the epoch will occur.
            }

            return {
                curEpoch,
                estimatedHalvingTime: estimatedHalvingTime,
                prevHalvingTime: prevHalvingBlockInfo ? {
                    timestamp: BI.from(prevHalvingBlockInfo.timestamp).toNumber(),
                    epoch: getPrevHalvingEpoch(curEpoch.number)
                } : null,
                isNearHalving
            }
        }, {
            refetchInterval: nearHalving ? 10 * 1000 : 60 * 1000, // 10 seconds if near halving, otherwise 1 minute
            //staleTime: 10 * 1000, 
            staleTime: nearHalving ? 10 * 1000 : 60 * 1000,
        });

    return { data: result, isLoading, isError };

}

export default useCKBHalving;