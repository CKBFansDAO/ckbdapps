import React from 'react'
import HalvingContainer from '../components/halving/HalvingContainer'
import { BIish, BI, isBIish } from "@ckb-lumos/bi";
//import useCKBHalving from '../hooks/useCKBHalving';

function parseEpoch(epoch) {
    const epochBI = BI.from(epoch);
    return {
        length: epochBI.shr(40).and(0xffff).toNumber(),
        index: epochBI.shr(24).and(0xffff).toNumber(),
        number: epochBI.and(0xffffff).toNumber(),
    };
}
  
  // Example usage:
  const encodedEpoch = '0x6220214001cd9';
  const decodedEpoch = parseEpoch(encodedEpoch);
  console.log(decodedEpoch); // { epochNumber: 518144, epochIndex: 61555 }

  const timestamp = '0x1874ab4f647';
  console.log(BI.from(timestamp).toNumber());

const Halving = () => {
    
    return (
        <div className='flex flex-col'>
            <div>
                <HalvingContainer/>
                {/*
                <div className='flex gap-4 text-blue-600'>
                    <span>{estimatedHalvingTime}</span>
                    <span>{tipHeader.number}</span>
                    <span>{tipHeader.timestamp}</span>
                </div>
                */
                }
                
                
            </div>
        </div>
    )
}

export default Halving
