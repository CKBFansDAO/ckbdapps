import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Alert.css'

import { useTranslation } from 'react-i18next';
import { FormatLocaleDateTime } from '../../utils/helper';


const ViewHalvingAlert = ({ halvingTime, halvingEpoch}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [t] = useTranslation()

  const navigate = useNavigate();

  const handleViewClick = () => {
    localStorage.setItem(`ckb_halving_notified_before_${halvingEpoch}`, 'true');
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
      <div className="fixed inset-0 bg-black opacity-50"></div>

      {/* 弹窗内容 */}
      <div className={`halving-alert-bg bg-cover w-full border-[5px] border-opacity-40  border-[#BD5FDB] bg-clip-padding mx-2 md:w-[500px] py-10 px-5 md:py-12 md:px-6 rounded-lg shadow-lg relative`}>
        <i className="absolute top-5 right-5 fa-solid fa-xmark text-[20px] cursor-pointer hover:text-red ml-3 px-2 h-5 w-5  text-white hover:text-gray-300 focus:outline-none border-0"
          onClick={() => {
            setShowAlert(false);
            localStorage.setItem(`ckb_halving_notified_before_${halvingEpoch}`, 'true');
          }}></i>
        <div className='flex flex-col h-[200px] space-y-8'>
          <span className='text-[22px] text-white font-["Zen_Dots"] pt-1 font-extrabold'>{t('halving.title')}</span>
          <span className='text-white mt-4 w-[200px] md:w-[225px] h-[70px] flex items-center'>{t('alert.next-halving-tip', { time: FormatLocaleDateTime(halvingTime) })}</span>
          <div onClick={handleViewClick} className='h-[35px] w-[120px] font-extrabold cursor-pointer flex items-center rounded-full text-white border-[#fff] border-[1px] transition duration-300 transform hover:scale-110 hover:bg-[#8A42C7] hover:border-0'>
            <span className='w-full text-center px-3 '>{t('common.learn-more')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHalvingAlert;
