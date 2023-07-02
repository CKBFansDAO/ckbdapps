import { useEffect, useState } from 'react';
import { RPC, BI } from "@ckb-lumos/lumos";

// JSONRPC url
const rpc = new RPC("https://mainnet.ckb.dev");

// The number of epochs per halving. This should never change.
//const EPOCHS_PER_HALVING = 8760;

// 
const useCKBHalving = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [estimatedHalvingTime, setEstimatedHalvingTime] = useState(0);
    const [tipHeader, setTipHeader] = useState({
        dao: 0,
        epoch: {
            index: 0,
            length: 0,
            number: 0
        },
        number:0,
        timestamp: 0
    });

    const parseEpoch = (epoch) => {
        const epochBI = BI.from(epoch);
        return {
            length: epochBI.shr(40).and(0xffff).toNumber(),
            index: epochBI.shr(24).and(0xffff).toNumber(),
            number: epochBI.and(0xffffff).toNumber(),
        };
    }

    useEffect(() => {
        // 1. 获取当前块头信息，拿到当前时间、epoch
        // 2. 获取下次减半的epoch
        // 3. 获取当前epoch开始时的timestamp：T1
        // 3. 计算从第1000个epoch开始时的timestamp: T2
        async function getTipHeader() {
            const tipHeader = await rpc.getTipHeader();
            
            const curEpoch = parseEpoch(tipHeader.epoch);
            
            setTipHeader({    
                epoch: curEpoch,
                number:BI.from(tipHeader.number).toNumber(),
                timestamp: BI.from(tipHeader.timestamp).toNumber()
            })
        }

        async function getEpochStartBlock(epoch_index) {
            const epochInfo = await rpc.getEpochByNumber(BI.from(epoch_index).toBigInt());
            let blockInfo = await rpc.getHeaderByNumber(epochInfo.startNumber);
            return blockInfo;
        }

        async function getBlockInfo(block_index) {
            const blockInfo = await rpc.getHeaderByNumber(block_index);
            return blockInfo;
        }
        
        // 
        // T0: The start timestamp of the most recent 1000 epochs.
        // T1: The timestamp of current tip header.
        // TimePerEpoch: (T1 - T0) / (1000 + curEpoch.index/curEpoch.length)
        async function calcHalvingCountDown() {
            setIsLoading(true);
            // get tip header
            const tipHeader = await rpc.getTipHeader();
            const curEpoch = parseEpoch(tipHeader.epoch);
            
            // Calculate the time spent on the latest 1000 epochs.
            const t0Epoch = await getEpochStartBlock(curEpoch.number - 1000);

            let subTime = (BI.from(tipHeader.timestamp).toNumber() - BI.from(t0Epoch.timestamp).toNumber())
            let avgEpochTime = subTime / (1000 + curEpoch.index/curEpoch.length);

            // Calculate the target epoch.
            const targetEpoch = Math.floor(curEpoch.number / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING + EPOCHS_PER_HALVING;

            // Calculate the duration and time of the target epoch.
            const targetDuration = Math.floor((targetEpoch - (curEpoch.number + (curEpoch.index / curEpoch.length))) * avgEpochTime); // Time until epoch in milliseconds.
            const targetTime = Date.now() + targetDuration; // Date in the future when the epoch will occur.
            
            setEstimatedHalvingTime(targetTime); 
            setIsLoading(false);
        }

        calcHalvingCountDown();

        // 设置一个定时器，每隔12秒钟更新一次倒计时的状态
        const intervalId = setInterval(() => {
            getTipHeader();
        }, 12000);
    
        // 返回一个清除定时器的函数
        return () => clearInterval(intervalId);

    }, []);

    let error = false;
    return { isLoading, error, estimatedHalvingTime, tipHeader};
}

export default useCKBHalving;