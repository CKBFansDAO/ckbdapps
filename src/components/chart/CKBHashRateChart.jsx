// 第三种方案
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer, Label, ReferenceDot } from 'recharts';
import { currentLanguage } from '../../utils/i18n';
import { useTranslation } from 'react-i18next';
import BitTooltip from '../tooltip/bitTooltip';

const period_intervals = {
    "7D": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
    "ALL": 9999
}

const specialEvents = [
    { type: "Release", name: 'C1', value: 311316960394 * 1000, date: 1583510400, description: 'K5' },
    { type: "Release", name: 'K5', value: 2507992018175 * 1000, date: 1585670400, description: 'C1 Pro' },
    { type: "Release", name: 'K5', value: 11115020385974 * 1000, date: 1603123200, description: 'BM-N1' },
    { type: "Release", name: 'K5', value: 18091467778719 * 1000, date: 1610121600, description: 'Goldshell-CK5' },
    { type: "Release", name: 'K5', value: 54056064662603 * 1000, date: 1628352000, description: 'CK-BOX' },
    { type: "Release", name: 'K5', value: 94372205289733 * 1000, date: 1638460800, description: 'CK6' },
    { type: "Release", name: 'K5', value: 128605389296030 * 1000, date: 1646236800, description: 'CK Lite' },
    { type: "Release", name: 'K5', value: 58147597514131 * 1000, date: 1672934400, description: 'K7' },
];

const formatXAxis = (tickItem) => {
    const date = new Date(tickItem * 1000);
    return date.toLocaleDateString(getLocales()); // Format the date as desired
};

const formatYAxis = (value) => {
    const formattedValue = hashRateFormatter(parseFloat(value), 2);
    return `${formattedValue}H/s`;
};

const hashRateFormatter = (num, digits) => {
    if (!num) {
        return '-';
    }

    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];

    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }

    let res = (num / si[i].value).toFixed(digits).replace(rx, "$1");
    if (digits === 2 && res < 0.01) {
        res = '<0.01'
    }

    return res + si[i].symbol;
}

const CustomTooltip = ({ active, payload }) => {
    const [t] = useTranslation();

    if (active && payload && payload.length) {
        const { value } = payload[0];
        const event = specialEvents.find((e) => e.date === payload[0].payload.created_at_unix);

        // Customize the tooltip content here
        return (
            <div className="bg-[#28C1B0] px-4 py-2 rounded-md text-white opacity-80">
                <div className="flex justify-between  gap-3">
                    <span className='font-bold text-black'>{t('home.charts.date')}:</span>
                    <span>{`${formatXAxis(payload[0].payload.created_at_unix)}`}</span>
                </div>
                <div className="flex justify-between  gap-3">
                    <span className='font-bold text-black'>{t('home.charts.hash-rate')}:</span>
                    <span>{`${formatYAxis(value)}`}</span>
                </div>
                {event && <div className="flex justify-between gap-3">
                    <span className='font-bold text-black'>{t('home.charts.event')}:</span>
                    <span>{event.description} {t('home.charts.miner-released')}</span>
                </div>}
            </div>
        );
    }

    return null;
};

const getLocales = () => {
    return currentLanguage().replace('_', '-');
}

const CKBHashRateChart = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chartInterval, setChartInterval] = useState('ALL');

    const [activeEvent, setActiveEvent] = useState(null);

    const handleEventClick = (event) => {
        // 处理事件点击
        setActiveEvent(event);
    };

    const [t] = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.das.la/api/v1/nervos_explorers/daily_avg_hash_rate');
                //setData(response.data);
                const newData = response.data.map((item) => ({
                    ...item,
                    avg_hash_rate: parseFloat(item.avg_hash_rate) * 1000
                }));
                setData(newData);
                setIsLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const yAxisTickFormater = (value) => {
        // Convert the hash rate value back to original by dividing by the scaling factor (1e12)
        let tick = parseFloat(value) / 1e15;
        let unit = 'P';

        if (tick < 1) {
            tick = parseFloat(value) / 1e12;
            unit = 'T'
            if (tick < 0.001) {
                unit = '';
            }
        }

        return `${tick.toFixed(1)}${unit}`;
        //return (parseFloat(value) / 1e15).toFixed(0);
    };

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
        <LineChart data={getDataByInterval()} >
            <CartesianGrid strokeDasharray='2 8' vertical={false} />
            <XAxis dataKey='created_at_unix' tickFormatter={formatXAxis} minTickGap={20} interval="preserveStartEnd" />
            <YAxis interval="preserveStartEnd" tickFormatter={yAxisTickFormater} domain={['dataMin', 'dataMax']}>
                <Label
                    value="Hash Rate"
                    angle={0}
                    position="top"
                    dy="0"
                /></YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Line type='monotone' dataKey='avg_hash_rate' stroke='#28C1B0' dot={false} />
            <Brush dataKey='created_at_unix' height={30} stroke='#28C1B0' tickFormatter={formatXAxis} />
            {/* 在这里添加特殊事件的 ReferenceDot */}
            {specialEvents.map((event, index) => (
                <ReferenceDot
                    key={index}
                    x={event.date}
                    y={event.value}
                    r={5} // 指定点的半径
                    fill="red" // 点的颜色
                    stroke="none" // 点的边框颜色
                    dataKey={event.date} // 添加 dataKey
                    onClick={() => handleEventClick(event)} // 添加点击事件处理函数
                />
            ))}
        </LineChart>
        
    </ResponsiveContainer>
    }

    return (<div className='flex flex-col md:mt-5'>
        <div className='w-full flex h-16 text-center justify-center text-[20px] md:text-[30px] font-["Zen_Dots"] text-black'>
            <span className='flex items-end'>{t('home.market-data.ckb-his-hash-rate')}</span>
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
                ) : (<div className='flex flex-col h-full'>
                    <div className='flex w-full'>
                        <div className='grow'></div>
                        <div className='flex px-1 py-1 gap-1 text-sm bg-[#E7E6F7] rounded-sm'>
                            {Object.entries(period_intervals).map(([key, value]) => (
                                <div key={key} className={`flex items-center ${chartInterval === key ? 'bg-[#28C1B0] text-white font-bold' : 'bg-[#DAF3EF] text-black'} rounded-sm px-1 cursor-pointer`}
                                    onClick={() => setChartInterval(key)} >{key}
                                </div>
                            ))}
                        </div>
                    </div>
                    {renderChart()}
                </div>)
            }
        </div>
    </div>
    );
};

export default CKBHashRateChart;
