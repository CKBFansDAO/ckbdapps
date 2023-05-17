import { useState } from 'react';
import { RPC, BI } from "@ckb-lumos/lumos";
import { useQuery } from '@tanstack/react-query';

// JSONRPC url
const rpc = new RPC("https://mainnet.ckb.dev");
// testnet
//const rpc = new RPC("https://inside.ckb.dev");


const useCKBTipHeader = () =>{
    
    const parseEpoch = (epoch) => {
        const epochBI = BI.from(epoch);
        return {
            length: epochBI.shr(40).and(0xffff).toNumber(),
            index: epochBI.shr(24).and(0xffff).toNumber(),
            number: epochBI.and(0xffffff).toNumber(),
        };
    }

    const { data: result, isLoading, isError } = useQuery(
        ["ckbTipHeader"], async () => {
            //const tipHeader = await getTipHeader();
            const tipHeader = await rpc.getTipHeader();

            const curEpoch = parseEpoch(tipHeader.epoch);

            const latestBlock = BI.from(tipHeader.number).toNumber();
            
            return {
                epoch:curEpoch,
                latestBlock
            }
        },{
            staleTime: 6 * 1000, // 1 minute
            refetchInterval: 6 * 1000, // 1 minute
        });
    
    return { data: result, isLoading, isError };
    
}

export default useCKBTipHeader;