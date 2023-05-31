import { useState } from 'react';
import { RPC, BI } from "@ckb-lumos/lumos";
import { useQuery } from '@tanstack/react-query';
import { getNextHalvingEpoch, getPrevHalvingEpoch } from '../utils/helper';

// JSONRPC url
const rpc = new RPC("https://mainnet.ckb.dev");
// testnet
//const rpc = new RPC("https://inside.ckb.dev");


// The number of epochs per halving. This should never change.
//const EPOCHS_PER_HALVING = 8760;//8760;

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

    const getTipHeader = async () => {
        const tipHeader = await rpc.getTipHeader();
        console.log(tipHeader);
        const curEpoch = parseEpoch(tipHeader.epoch);
        console.log(curEpoch);
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

        console.log(epoch_index);
        const epochInfo = await rpc.getEpochByNumber(BI.from(epoch_index).toBigInt());
        console.log(epochInfo);
        let blockInfo = await rpc.getHeaderByNumber(epochInfo.startNumber);
        console.log(blockInfo);

        gBaseEpochBlockInfo.set(epoch_index, blockInfo);

        return blockInfo;
    }

    const getBlockInfo = async (block_index) => {
        console.log(block_index);
        const blockInfo = await rpc.getHeaderByNumber(block_index);
        console.log(blockInfo);
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
        return undefined;
    }

    const parseDAO = (data) => {
        //data = 0x7234aae1a5119e4947929146a2af2700f9078b2209b927050050af6b94753307
        let dataString = data;
        let res = dataString.slice(2)
            .match(/\w{16}/g)
            .map(value => '0x' + value.match(/\w{2}/g).reverse().join(''))
            .map(value => BI.from(value).toBigInt())

        return res;
    }

    const { data: result, isLoading, isError } = useQuery(
        ["ckbhalving"], async () => {
            //const tipHeader = await getTipHeader();
            const tipHeader = await rpc.getTipHeader();

            const curEpoch = parseEpoch(tipHeader.epoch);
            //console.log(curEpoch);

            const dao = parseDAO(tipHeader.dao);
            //console.log(dao);

            const prevHalvingBlockInfo = await getPrevHalvingBlockInfo(curEpoch.number);
            //console.log(prevHalvingBlockInfo);
            if (prevHalvingBlockInfo) {
                setPrevHalvingTime(BI.from(prevHalvingBlockInfo.timestamp).toNumber());
            }
            //console.log(prevHalvingTime);

            // Calculate the time spent on the latest 1000 epochs.
            const t0Epoch = await getEpochStartBlock(curEpoch.number - EVERY_EPOCH_TIME_INTERVAL);
            //console.log(t0Epoch);

            let subTime = (BI.from(tipHeader.timestamp).toNumber() - BI.from(t0Epoch.timestamp).toNumber())
            //console.log(subTime);
            let curEpochProgress = curEpoch.index / curEpoch.length;

            let avgEpochTime = subTime / (EVERY_EPOCH_TIME_INTERVAL + curEpochProgress);
            //console.log(avgEpochTime);

            // Calculate the target epoch.
            const targetEpoch = getNextHalvingEpoch(curEpoch.number);

            // Calculate the duration and time of the target epoch.
            const targetDuration = Math.floor((targetEpoch - (curEpoch.number + curEpochProgress)) * avgEpochTime); // Time until epoch in milliseconds.
            
            //const targetTime = Date.now() + targetDuration; // Date in the future when the epoch will occur.
            const targetTime = BI.from(tipHeader.timestamp).toNumber() + targetDuration; // Date in the future when the epoch will occur.

            return {
                curEpoch,
                estimatedHalvingTime: targetTime
            }
        }, {
        staleTime: 6 * 1000, // 1 minute
        refetchInterval: 6 * 1000, // 1 minute
    });

    return { data: result, isLoading, isError };

}

export default useCKBHalving;