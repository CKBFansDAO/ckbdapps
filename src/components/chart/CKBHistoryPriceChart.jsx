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

const yAxisTickFormater = (value) => {
    return `${parseFloat(value).toFixed(4)}`;
};

const period_intervals = {
    "7D": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
    "ALL": 9999
}

const CustomTooltip = ({ active, payload }) => {

    const [t] = useTranslation();

    if (active && payload && payload.length) {
        const { value } = payload[0];
        // Customize the tooltip content here
        return (
            <div className="bg-[#8884d8] px-4 py-2 rounded-md text-white opacity-80">
                <div className="flex justify-between  gap-3">
                    <span className='font-bold text-black'>{t('home.charts.date')}:</span>
                    <span>{`${formatXAxis(payload[0].payload.created_at_unix)}`}</span>
                </div>
                <div className="flex justify-between  gap-3">
                    <span className='font-bold text-black'>{t('home.charts.price')}:</span>
                    <span>${`${parseFloat(value).toFixed(5)}`}</span>
                </div>
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
    const [chartInterval, setChartInterval] = useState('ALL');
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

    // 按周期筛选数据的函数
    const filterDataByInterval = (numToShow) => {
        const startIndex = Math.max(data.length - numToShow, 0);
        return data.slice(startIndex);
    };

    const getDataByInterval = () => {
        if (chartInterval === 'ALL') {
            return data;
        }
        else {
            let interval = period_intervals[chartInterval];
            if (interval) {
                return filterDataByInterval(interval);
            }
        }

        return data;
    }

    const renderChart = () => {
        return <ResponsiveContainer className='select-none'>
            <LineChart data={getDataByInterval()}>
                <CartesianGrid strokeDasharray='2 8' vertical={false} />
                <XAxis dataKey='created_at_unix' tickFormatter={formatXAxis} minTickGap={20} interval="preserveStartEnd" />
                <YAxis tickFormatter={yAxisTickFormater} domain={['dataMin', 'dataMax']}/>
                <Tooltip content={<CustomTooltip />} />
                <Line type='monotone' dataKey='price' stroke='#8884d8' dot={false} />
                <Brush dataKey='created_at_unix' height={30} stroke='#8884d8' tickFormatter={formatXAxis} />
            </LineChart>
        </ResponsiveContainer>
    }

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
                    <div className='flex flex-col h-full'>
                        <div className='flex w-full'>
                            <div className='grow'></div>
                            <div className='flex px-1 py-1 gap-1 text-sm bg-[#E7E6F7] rounded-sm'>
                                {Object.entries(period_intervals).map(([key, value]) => (
                                    <div key={key} className={`flex items-center ${chartInterval === key ? 'bg-[#733DFF] text-white font-bold' : 'bg-[#F4EFFF] hover:bg-[#5727AE] text-black hover:text-white'} text-white rounded-sm px-1 cursor-pointer`}
                                        onClick={() => setChartInterval(key)} >{key}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {renderChart()}           
                    </div>
                )
            }
        </div>
    </div>
    );
};

export default CKBHistoryPriceChart;
