import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Alert.css'

import { ReactComponent as CKBLogo } from '../../assets/images/nervos-logo-white.svg';
import { ReactComponent as FireworksIcon } from '../../assets/images/fireworks.svg';
import { FormatLocaleDateTime } from '../../utils/helper';
import { useTranslation } from 'react-i18next';


const CKBHalvedAlert = ({ halvedTime }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [t] = useTranslation();

  const navigate = useNavigate();

  const handleViewClick = () => {
    localStorage.setItem(`ckb_halvd_notified_after_${halvedTime?.epoch}`, 'true');
    navigate('/halving');
  };

  const renderCloseIcon = () => {
    return <i className="flex items-center justify-center fa-solid fa-xmark text-[20px] cursor-pointer hover:text-red ml-3 px-2 h-5 w-5  text-gray-400 hover:text-gray-500 focus:outline-none border-0"
      onClick={() => setShowAlert(false)}></i>
  }

  if (!showAlert) {
    return null; // 如果弹窗不需要显示，则返回null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      {/* 蒙版元素 */}
      <div className="fixed inset-0 bg-black opacity-70"></div>

      {/* 弹窗内容 */}
      <div className={`halved-alert-bg bg-cover w-full border-[5px] border-opacity-40  border-[#BD5FDB] bg-clip-padding mx-2 md:w-[500px] p-5 md:p-10 rounded-lg shadow-lg relative`}>
        <div className='flex justify-center'>
          <CKBLogo className='h-14'></CKBLogo>
        </div>
        <i className="absolute top-5 right-5 fa-solid fa-xmark text-[20px] cursor-pointer hover:text-red ml-3 px-2 h-5 w-5  text-gray-400 hover:text-gray-500 focus:outline-none border-0"
          onClick={() => {
            setShowAlert(false);
            localStorage.setItem(`ckb_halvd_notified_after_${halvedTime?.epoch}`, 'true');
          }}></i>
        <div className='flex w-full gap-5 mt-5'>
          <p className='w-2/3 text-white leading-7'>
            <span className='text-[35px] text-[#00DF9B] font-extrabold mr-2'>CKB</span>{t('alert.halved-tip', { time: FormatLocaleDateTime(halvedTime.timestamp) })}
          </p>

          <FireworksIcon className='w-20 md:w-40 -mb-10'></FireworksIcon>
        </div>

        <div className='flex w-full place-content-center mt-3'>
          <div onClick={handleViewClick} className='h-[35px] w-[120px] font-extrabold cursor-pointer flex items-center rounded-full text-white border-[#fff] border-[1px] transition duration-300 transform hover:scale-110 hover:bg-[#733DFF] hover:border-0'>
            <span className='w-full text-center px-3 '>{t('common.learn-more')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CKBHalvedAlert;
