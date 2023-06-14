// 第三种方案
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer, Label } from 'recharts';
import { currentLanguage } from '../../utils/i18n';
import { useTranslation } from 'react-i18next';

const formatXAxis = (tickItem) => {
    const date = new Date(tickItem * 1000);
    return date.toLocaleDateString(getLocales()); // Format the date as desired
};

const formatYAxis = (value) => {
    // Convert the value to the desired unit (e.g., divide by 1e9 for GH/s)
    //const formattedValue = parseFloat(value).toFixed(2);
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
    if (active && payload && payload.length) {
        const { value } = payload[0];
        // Customize the tooltip content here
        return (
            <div className="bg-[#8884d8] px-4 py-2 rounded-md text-white opacity-80">
                <p className="">{`${formatXAxis(payload[0].payload.created_at_unix)}`}</p>
                <p className="">{`${formatYAxis(value)}`}</p>
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

    const [t] = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.das.la/api/v1/nervos_explorers/daily_avg_hash_rate');
                //setData(response.data);
                const newData = response.data.map((item) => ({
                    ...item,
                    avg_hash_rate: parseFloat(item.avg_hash_rate)*1000
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
            if(tick < 0.001) {
                unit = '';
            }
        }

        return `${tick}${unit}`;
        //return (parseFloat(value) / 1e15).toFixed(0);
    };



    return (<div className='flex flex-col md:mt-5'>
        <div className='w-full flex h-16 text-center justify-center text-[20px] md:text-[30px] font-["Zen_Dots"]'>
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
                ) : (
                    <ResponsiveContainer className='select-none'>
                        <LineChart data={data} >
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='created_at_unix' tickFormatter={formatXAxis} />
                            <YAxis interval="preserveStartEnd" tickFormatter={yAxisTickFormater}>
                                <Label
                                    value="Hash Rate"
                                    angle={0}
                                    position="top"
                                    dy="0"
                                /></YAxis>
                            <Tooltip content={<CustomTooltip />} />
                            <Line type='monotone' dataKey='avg_hash_rate' stroke='#8884d8' dot={false} />
                            <Brush dataKey='created_at_unix' height={30} stroke='#8884d8' tickFormatter={formatXAxis} />
                        </LineChart>
                    </ResponsiveContainer>
                )
            }
        </div>
    </div>
    );
};

export default CKBHashRateChart;
