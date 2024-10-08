import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SummaryItem from './SummaryItem';
import axios from 'axios';
import { numberFormatter } from '../../utils/helper';

const CKBTokenSummary = () => {

  const [t] = useTranslation();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rsp = await axios.get('https://api.das.la/api/v1/nervos_explorers/market_data');
        setData(rsp.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (<div className='flex flex-col pt-1 md:pt-5 bg-[#6833D2]'>
    <div className='w-full flex h-16 text-center justify-center text-[20px] md:text-[30px] font-["Zen_Dots"]'>
      <span className='flex items-end text-[#00DF9B]'>{t('home.market-data.token-summary')}</span>
    </div>
    <div className={`max-w-content mx-auto w-full `}>
      <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-purple-500 divide-y-reverse border-dashed py-5 md:py-10'>
        <div className='md:border-b-0 md:px-3 md:py-3'>
          <SummaryItem
            value={numberFormatter(data?.total_supply, 2)}
            itemName={t('home.market-data.total-supply')}
            valueClass='font-bold text-[#FFF]'
            nameClass='text-[#00DF9B]'
            isLoading={isLoading}
          />
        </div>
        <div className='md:border-b-0 md:px-3 md:py-3'>
          <SummaryItem
            value={numberFormatter(data?.circulating_supply, 2)}
            itemName={t('home.market-data.circulating-supply')}
            valueClass='font-bold text-[#FFF]'
            nameClass='text-[#00DF9B]'
            isLoading={isLoading}
          />
        </div>
        <div className='md:px-3 md:py-3'>
          <SummaryItem
            value={numberFormatter(data?.nervos_dao?.total_deposit * Math.pow(0.1, 8), 2)}
            itemName={t('home.market-data.deposit')}
            valueClass='font-bold text-[#FFF]'
            nameClass='text-[#00DF9B]'
            isLoading={isLoading}
          />
        </div>
        <div className='md:px-3 md:py-3'>
          <SummaryItem
            value={numberFormatter(data?.circulating_supply - data?.nervos_dao?.total_deposit * Math.pow(0.1, 8), 2)}
            itemName={t('home.market-data.tradable')}
            valueClass='font-bold text-[#FFF]'
            nameClass='text-[#00DF9B]'
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  </div>
  );
};

export default CKBTokenSummary;