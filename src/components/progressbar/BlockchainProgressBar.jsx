import React, { useEffect, useState } from "react";
import { getHalvingHistoryEpochs, getNextHalvingEpoch, getPrevHalvingEpoch } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const BlockchainProgressBar = ({ epoch }) => {

  const [color, setColor] = useState("#C59DFF");

  const [t] = useTranslation();

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

  const renderHalvedHistory = () => {
    if (!epoch) {
      return <></>
    }

    const halvedEpochs = getHalvingHistoryEpochs(epoch.number);
    if (halvedEpochs.length === 0) {
      return <></>
    }

    return <>
      {
        halvedEpochs.map((halvedEpoch, index) => {
          return renderHalvedSeperator(halvedEpoch, index)
        })
      }
    </>
  }

  const renderHalvedSeperator = (halvedEpoch, index) => {
    if (!epoch) {
      return <></>
    }
    
    let halvedPos = halvedEpoch * 100 / getNextHalvingEpoch(epoch.number);
    console.log(halvedPos);
    if (halvedPos < 1) {
      return <></>
    }

    return <div className="flex relative">
      <div className="absolute w-[1px] h-12"
        style={{
          left: `${halvedPos}%`,
          top: -8,
        }}
      >
        <div className="absolute w-0 h-0 
          border-l-[5px] border-l-transparent
          border-b-[10px] 
          border-r-[5px] border-r-transparent"
          style={{
            left: -4.5,
            bottom: -1,
            borderBottomColor: '#999999'
          }}>
        </div>
        <span className="absolute h-5 w-[260px] text-[#999999] text-sm text-center"
          style={{
            left: -130,
            top: 52,
          }}>{index+1}st Halving at 11/19/2023</span>
      </div>
    </div>

  }

  const renderCurEpoch = (epoch) => {

    const epochProgress = !epoch ? 0 : epoch.index / epoch.length * 100;
    const epochNumber = !epoch ? '-' : epoch.number;

    return <div className="flex flex-col gap-2">
      <span className='text-sm whitespace-nowrap text-[#232325]'>{t('halving.current-epoch')}</span>
      <div className="relative">
        <div className="relative rounded-full h-6 w-[100px] bg-[#D5CCE9] text-gray-700">
          <div className="absolute h-6  bg-[#00DF9B]"
            style={{
              width: `${epochProgress}%`,
              minWidth: 12,
              borderTopLeftRadius: 9999,
              borderBottomLeftRadius: 9999,
              borderTopRightRadius: epochProgress <= 89 ? 0 : 9999,
              borderBottomRightRadius: epochProgress <= 89 ? 0 : 9999,
            }}
          ></div>
          <div className="absolute item-center pt-[2px] px-3 h-6 w-full text-white font-bold text-left"
          ># {epochNumber}</div>
          <div className="absolute pt-[2px] h-6 w-full pr-1 text-[#232325] font-bold text-right text-[10px]"
          >{epochProgress.toFixed(0)}%</div>
        </div>

        <div className="absolute w-0 h-0 
            border-l-[5px] border-l-transparent
            border-t-[10px] 
            border-r-[5px] border-r-transparent
            " style={{
            left: 47.5,
            bottom: -10,
            borderTopColor: `${epochProgress < 52.5 ? '#D5CCE9' : '#00DF9B'}`
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
        {
          renderHalvedHistory()
        }
      </div>
    </div>
  );
}

export default BlockchainProgressBar;
