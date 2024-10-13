import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { currentLanguage } from '../../utils/i18n';
import { useTranslation } from 'react-i18next';
import { numberFormatter } from '../../utils/helper';

const initData = [
    {
        "created_at_unix": 1573833600,
        "circulating_supply": 12277048741,
        "total_occupied": 5041203089
    },
    {
        "created_at_unix": 1573920000,
        "circulating_supply": 12277905512,
        "total_occupied": 5041780849
    },
    {
        "created_at_unix": 1574006400,
        "circulating_supply": 12280278462,
        "total_occupied": 5041929907
    },
    {
        "created_at_unix": 1574092800,
        "circulating_supply": 12288457584,
        "total_occupied": 5042071701
    },
    {
        "created_at_unix": 1574179200,
        "circulating_supply": 12300589569,
        "total_occupied": 5042583236
    },
    {
        "created_at_unix": 1574265600,
        "circulating_supply": 12312722032,
        "total_occupied": 5043108073
    }
];

const formatXAxis = (tickItem) => {
    const date = new Date(tickItem * 1000);
    return date.toLocaleDateString(getLocales()); // Format the date as desired
};



const formatYAxis = (value) => {
    // Convert the value to the desired unit (e.g., divide by 1e9 for GH/s)
    //const formattedValue = parseFloat(value).toFixed(2);
    //return formattedValue;
    const formattedValue = numberFormatter(parseFloat(value), 2);

    return `${formattedValue}`;
};


const period_intervals = {
    "7D": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
    "ALL": 9999
}
/*
"date":"Date",
        "total-occupied":"Occupied CKB",
        "circulating-supply":"Circulating Supply"
*/

const CustomTooltip = ({ active, payload }) => {
    const [t] = useTranslation();

    if (active && payload && payload.length) {
        const { value } = payload[0];
        // Customize the tooltip content here
        return (
            <div className="flex flex-col bg-[#ffc658] px-4 py-2 rounded-md text-black opacity-80">
                <div className="flex justify-between  gap-3">
                    <span className='font-bold'>{t('home.charts.date')}:</span>
                    <span>{`${formatXAxis(payload[0].payload.created_at_unix)}`}</span>
                </div>
                {
                    payload.map((item, index) => {
                        return <div key={index} className="flex justify-between  gap-3">
                        <span className='font-bold'>{t(`home.charts.${item.name}`)}:</span>
                        <span>{`${numberFormatter(item.value, 2)}`}</span>
                    </div>
                    })
                }
                {/*<div className="flex justify-between  gap-3">
                    <span>{t('home.charts.circulating-supply')}:</span>
                    <span>{`${numberFormatter(payload[0].payload.circulating_supply, 2)}`}</span>
                </div>
                <div className="flex justify-between gap-3">
                    <span className=''>{t('home.charts.total-occupied')}:</span>
                    <span>{`${numberFormatter(payload[0].payload.total_occupied, 2)}`}</span>
            </div>*/}
            </div>
        );
    }

    return null;
};

const getLocales = () => {
    return currentLanguage().replace('_', '-');
}

const CKBHistoryOccupiedChart = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chartInterval, setChartInterval] = useState('ALL');
    const [t] = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.das.la/api/v1/nervos_explorers/daily_occupied_ckb');
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(initData);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderColorfulLegendText = (value, entry) => {
        const { inactive } = entry;
        const caption = t(`home.charts.${value}`); 
            
        return <span className=' cursor-pointer' style={{ color: inactive ? '#AAA' : entry.color }}>{caption}</span>;
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

    const LegendData = [
        {
            value: "satosh-gift-occupied",
            color: "#494A4A"
        },
        {
            value: "actual-ckb-occupied",
            color: "#ffc658"
        }
    ]

    const [activeAreas, setActiveAreas] = useState({
        'satosh-gift-occupied': false,
        'actual-ckb-occupied': true,
    });

    const toggleActiveArea = (name) => {
        setActiveAreas(prevActiveAreas => ({
            ...prevActiveAreas,
            [name]: !prevActiveAreas[name],
        }));
    };

    const renderChart = () => {
        return <ResponsiveContainer className='select-none'>
        <AreaChart data={getDataByInterval()}>
            <CartesianGrid strokeDasharray='2 8' vertical={false} />
            <XAxis dataKey='created_at_unix' tickFormatter={formatXAxis} minTickGap={20} interval="preserveStartEnd" />
            <YAxis interval="preserveStartEnd" tickFormatter={formatYAxis} domain={['dataMin', 'dataMax']}/>
            <Tooltip content={<CustomTooltip />} />
            <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={renderColorfulLegendText}
                onClick={(e) => toggleActiveArea(e.value)}
                payload={LegendData.map((entry) => ({
                    dataKey: entry.dataKey,
                    color: entry.color,
                    value: entry.value,
                    inactive: !activeAreas[entry.value],
                }))}
            /> 
            {/*<Area type="monotone" dataKey="circulating_supply" stackId="1" stroke="#82ca9d" fill="#82ca9d" />*/}
            {activeAreas[`${LegendData[0].value}`] && <Area type="monotone" dataKey={data => 5040000000} name={`${LegendData[0].value}`} stackId="1" stroke={`${LegendData[0].color}`} fill={`${LegendData[0].color}`} />}
            {activeAreas[`${LegendData[1].value}`] && <Area type="monotone" dataKey={data => data.total_occupied - 5040000000} name={`${LegendData[1].value}`} stackId="1" stroke={`${LegendData[1].color}`} fill={`${LegendData[1].color}`} />}
            <Brush dataKey='created_at_unix' height={30} stroke='#ffc658' tickFormatter={formatXAxis} />
        </AreaChart>
    </ResponsiveContainer>
    }

    return (<div className='flex flex-col md:mt-5'>
        <div className='w-full flex h-16 text-center justify-center text-[20px] md:text-[30px] font-["Zen_Dots"]'>
            <span className='flex items-end'>{t('home.charts.ckb-his-occupied')}</span>
        </div>
        <div className='w-full h-[400px]'>
            {
                isLoading ? (
                    <div className='flex items-center justify-center h-full'>
                        {<div className='animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-[#ffc658]'></div>}
                    </div>
                ) : (
                    <div className='flex flex-col h-full'>
                        <div className='flex w-full'>
                            <div className='grow'></div>
                            <div className='flex px-1 py-1 gap-1 text-sm bg-[#E7E6F7] rounded-sm'>
                                {Object.entries(period_intervals).map(([key, value]) => (
                                    <div key={key} className={`flex items-center ${chartInterval === key ? 'bg-[#ffc658] text-black font-bold' : 'bg-[#F4EFFF] hover:bg-[#ffc658] text-black '} rounded-sm px-1 cursor-pointer`}
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

export default CKBHistoryOccupiedChart;
