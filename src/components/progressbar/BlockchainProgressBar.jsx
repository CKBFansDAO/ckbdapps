import React, { useEffect, useState } from "react";
import { getNextHalvingEpoch } from "../../utils/helper";

const BlockchainProgressBar = ({ epoch }) => {

  const [color, setColor] = useState("#C59DFF");
  
  const progress = epoch ? (epoch.number / getNextHalvingEpoch(epoch.number) * 100) : 50;

  useEffect(() => {

    const calculateColor = () => {

      const startColor = [197, 157, 255]; // #C59DFF
      const endColor = [115, 61, 255]; // #733DFF

      const increment = [
        Math.round((endColor[0] - startColor[0]) / 100),
        Math.round((endColor[1] - startColor[1]) / 100),
        Math.round((endColor[2] - startColor[2]) / 100)
      ];
      const newColor = [
        startColor[0] + increment[0] * progress,
        startColor[1] + increment[1] * progress,
        startColor[2] + increment[2] * progress
      ];

      setColor(`rgb(${newColor.join(",")})`);
    };

    calculateColor();
  }, [progress]);

  const renderCurEpoch = (epoch) => {

    const epochProgress = !epoch ? 0 : epoch.index/epoch.length * 100;
    const epochNumber = !epoch ? '-' : epoch.number;

    return <div className="flex flex-col gap-2">
      <span className='text-sm whitespace-nowrap'>Current Epoch</span>
      <div className="relative">
        <div className="relative rounded-full h-6 w-[100px] bg-[#D5CCE9] text-gray-700">
          <div className="absolute h-6  bg-[#00DF9B]"
            style={{
              width: `${epochProgress}%`,
              minWidth:12,
              borderTopLeftRadius: 9999,
              borderBottomLeftRadius: 9999,
              borderTopRightRadius: epochProgress <= 89 ? 0 :9999,
              borderBottomRightRadius: epochProgress <= 89 ? 0 :9999,
            }}
            ></div>
          <div className="absolute item-center pt-[2px] px-3 h-6 w-full text-white font-bold text-left"
            ># {epochNumber}</div>
          <div className="absolute pt-[2px] h-6 w-full pr-1 text-black font-bold text-right text-[10px]"
            >{epochProgress.toFixed(0)}%</div>
        </div>
        
        <div class="absolute w-0 h-0 
            border-l-[5px] border-l-transparent
            border-t-[10px] 
            border-r-[5px] border-r-transparent
            " style={{
              left: 47.5,
              bottom: -10,
              borderTopColor: `${epochProgress < 52.5 ? '#D5CCE9' :'#00DF9B'}`
            }}>
        </div>
      </div>  
    </div>
  }

  return (
    <div className="flex h-8 w-full">
      <div className="relative w-full h-8 rounded-full bg-[#D5CCE9]">
        <div
          className="absolute h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(to right, #C59DFF, ${color})`
          }}
        ></div>
        <div
          className="absolute w-[1px] h-12 border-dashed border-r border-black"
          style={{
            left: `${progress}%`,
            top: -8,
          }}
        ></div>
        {progress !== 0 && progress !== 100 && (
        <div className="absolute bottom-20 h-8 text-center rounded-lg text-sm px-2 py-1"
          style={{
            left: `${progress}%`,
            marginLeft: -60
          }}>
            {renderCurEpoch(epoch)}
          </div>
      )}
        
      </div>
    </div>
  );
}

export default BlockchainProgressBar;