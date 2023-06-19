// 第三种方案
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer } from 'recharts';
import { currentLanguage } from '../../utils/i18n';
import { useTranslation } from 'react-i18next';

const formatXAxis = (tickItem) => {
    const date = new Date(tickItem * 1000);
    return date.toLocaleDateString(getLocales()); // Format the date as desired
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { value } = payload[0];
        // Customize the tooltip content here
        return (
            <div className="bg-[#8884d8] px-4 py-2 rounded-md text-white opacity-80">
                <p className="">{`${formatXAxis(payload[0].payload.created_at_unix)}`}</p>
                <p className="">${`${parseFloat(value).toFixed(5)}`}</p>
            </div>
        );
    }

    return null;
};

const getLocales = () => {
    return currentLanguage().replace('_', '-');
}

const CKBHistoryPriceChart = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [t] = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.das.la/api/v1/nervos_explorers/daily_price');
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (<div className='flex flex-col md:mt-5'>
        <div className='w-full flex h-16 text-center justify-center text-[20px] md:text-[30px] font-["Zen_Dots"]'>
            <span className='flex items-end'>{t('home.market-data.ckb-his-price')}</span>
        </div>
        <div className='w-full h-[400px]'>
            {
                isLoading ? (
                    <div className='flex items-center justify-center h-full'>
                        {<div className='animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-[#733DFF]'></div>}
                        {/*<svg className='animate-spin duration-500 origin-center scale-150 h-20 w-20 text-gray-900'>
                            <use xlinkHref='/images/nervos-logo-black.svg#Layer_1' />
                        </svg>*/}
                    </div>
                ) : (
                    <ResponsiveContainer className='select-none'>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray='4 4' />
                            <XAxis dataKey='created_at_unix' tickFormatter={formatXAxis} minTickGap={20} interval="preserveStartEnd"/>
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type='monotone' dataKey='price' stroke='#8884d8' dot={false} />
                            <Brush dataKey='created_at_unix' height={30} stroke='#8884d8' tickFormatter={formatXAxis} />
                        </LineChart>
                    </ResponsiveContainer>
                )
            }
        </div>
    </div>
    );
};

export default CKBHistoryPriceChart;
