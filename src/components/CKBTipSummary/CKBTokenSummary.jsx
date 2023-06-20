import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SummaryItem from './SummaryItem';
import axios from 'axios';
import { numberFormatter } from '../../utils/helper';
import { MAX_VIEW_WIDTH } from '../../constants/common';

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

    return (<div className='flex flex-col pt-1 md:pt-5 -mx-3 md:-mx-7 bg-[#F4EFFF]'>
    <div className='w-full flex h-16 text-center justify-center text-[20px] md:text-[30px] font-["Zen_Dots"]'>
      <span className='flex items-end'>{t('home.market-data.token-summary')}</span>
    </div>
    <div className={`max-w-[${MAX_VIEW_WIDTH}px] mx-auto w-full `}>
    <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y-reverse border-b-[1px] border-dashed py-5 md:py-10'>
      <div className='border-b-[1px] md:border-b-0 md:px-3 md:py-3'>
        <SummaryItem
          value={numberFormatter(data?.total_supply, 2)}
          itemName={t('home.market-data.total-supply')}
          isLoading={isLoading}
        />
      </div>
      <div className='border-b-[1px] md:border-b-0 md:px-3 md:py-3'>
      <SummaryItem
        value={numberFormatter(data?.circulating_supply, 2)}
        itemName={t('home.market-data.circulating-supply')}
        isLoading={isLoading}
      />
      </div>
      <div className='md:px-3 md:py-3'>
        <SummaryItem
          value={numberFormatter(data?.nervos_dao?.total_deposit * Math.pow(0.1, 8), 2)}
          itemName={t('home.market-data.deposit')}
          isLoading={isLoading}
        />
        </div>
        <div className='md:px-3 md:py-3'>
      <SummaryItem
        value={numberFormatter(data?.circulating_supply - data?.nervos_dao?.total_deposit * Math.pow(0.1, 8), 2)}
        itemName={t('home.market-data.tradable')}
        isLoading={isLoading}
      />
      </div></div>
    </div>
  </div>
        /*<div className='flex flex-col pt-1 md:pt-5 -mx-3 md:-mx-7 bg-[#F4EFFF]'>
        <div className='w-full flex h-16 text-center  justify-center text-[20px] md:text-[40px] font-["Zen_Dots"]'>
            <span className='flex items-end'>CKB Token Summary</span>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y-reverse border-b-[1px] border-dashed py-5 md:py-10'>
            <SummaryItem value={numberFormatter(data?.total_supply, 2)}
                itemName={t('home.market-data.total-supply')}
                isLoading={isLoading}>
            </SummaryItem>
            <SummaryItem value={numberFormatter(data?.circulating_supply, 2)}
                itemName={t('home.market-data.circulating-supply')}
                isLoading={isLoading}>
            </SummaryItem>
            <SummaryItem value={numberFormatter(data?.nervos_dao?.total_deposit*Math.pow(0.1, 8), 2)}
                itemName={t('home.market-data.deposit')}
                isLoading={isLoading}>
            </SummaryItem>
            <SummaryItem value={numberFormatter(data?.circulating_supply - data?.nervos_dao?.total_deposit*Math.pow(0.1, 8), 2)}
                itemName={t('home.market-data.tradable')}
                isLoading={isLoading}>
            </SummaryItem>
        </div>
        </div>*/
    );
};

export default CKBTokenSummary;