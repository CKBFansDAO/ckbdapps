/* // ok
import React from 'react';
import {AdvancedChart} from 'react-tradingview-embed';

const CKBHistoryPriceChart = () => {
    return (
        <div className="w-full tradingview-widget-container">
           
            <div id='tradingview_eb222' className="h-[600px]"/>
    
            <AdvancedChart  widgetProps={
                {
                    theme: 'light',
                    symbol:"BINANCE:CKBUSDT",
                    "width":"100%",
                    "interval":"D",
                    "autosize": "true",
            "timezone": "Etc/UTC",
            "style": "1",
            "locale": "en_US",
            "toolbar_bg": "#f1f3f6",
            "hide_side_toolbar": true,
            "backgroundColor": "rgba(255, 255, 255, 1)",
            "withdateranges": "true",
            "range": "YTD",
            "container_id":"tradingview_eb222"
                   
                }

            }
           
            />
        </div>
    );
};

export default CKBHistoryPriceChart;
*/


// TradingViewWidget.jsx
/*
import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

const CKBHistoryPriceChart = () => {
  const onLoadScriptRef = useRef();

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        console.log('createWidget ')
        if (document.getElementById('tradingview_eb262') && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "BINANCE:CKBUSDT",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "zh_CN",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            backgroundColor: "rgba(255, 255, 255, 1)",
            withdateranges: true,
            range: "YTD",
            allow_symbol_change: true,
            container_id: "tradingview_eb262"
          });
        }
      }
    },
    []
  );

  return (
    <div className='tradingview-widget-container'>
      <div id='tradingview_eb262' />
    </div>
  );
}

export default CKBHistoryPriceChart;
*/

// 第三种方案
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { value } = payload[0];
        console.log(payload);
        // Customize the tooltip content here
        return (
            <div className="custom-tooltip">
                <p className="label">{`Value: ${value}`}</p>
            </div>
        );
    }

    return null;
};

const CKBTradeView = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTradingViewLoaded, setIsTradingViewLoaded] = useState(false);

    useEffect(() => {
        let tvScriptLoadingPromise;

        const loadTradingViewScript = async () => {
            if (!tvScriptLoadingPromise) {
                tvScriptLoadingPromise = new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.id = 'tradingview-widget-loading-script';
                    script.src = 'https://s3.tradingview.com/tv.js';
                    script.type = 'text/javascript';
                    script.onload = resolve;

                    document.head.appendChild(script);
                });
            }

            try {
                await tvScriptLoadingPromise;
                setIsTradingViewLoaded(true);
            } catch (error) {
                console.error('Failed to load TradingView:', error);
                setIsTradingViewLoaded(false);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.das.la/api/v1/nervos_explorers/daily_price');
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        loadTradingViewScript();
        fetchData();
    }, []);

    const formatXAxis = (tickItem) => {
        const date = new Date(tickItem * 1000);
        return date.toLocaleDateString('en-US'); // Format the date as desired
    };

    function createWidget() {
        console.log('createWidget ')
        if (document.getElementById('tradingview_eb262') && 'TradingView' in window) {
            new window.TradingView.widget({
                autosize: true,
                symbol: "BINANCE:CKBUSDT",
                timezone: "Etc/UTC",
                theme: "light",
                style: "1",
                locale: "zh_CN",
                toolbar_bg: "#f1f3f6",
                enable_publishing: false,
                backgroundColor: "rgba(255, 255, 255, 1)",
                withdateranges: true,
                range: "YTD",
                allow_symbol_change: true,
                container_id: "tradingview_eb262"
            });
        }
    }

    useEffect(() => {
        if (isTradingViewLoaded) {
            createWidget();
        }
    }, [isTradingViewLoaded]);

    return (
        <div className='tradingview-widget-container'>
            {isTradingViewLoaded ? (
                <div id='tradingview_eb262' className='w-full h-[400px]'/>
            ) : (
                isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='w-full h-[400px]'>
                        <ResponsiveContainer>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='created_at_unix' tickFormatter={formatXAxis} />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type='monotone' dataKey='price' stroke='#8884d8' dot={false}/>
                                <Brush dataKey='created_at_unix' height={30} stroke='#8884d8' tickFormatter={formatXAxis}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )
            )}
        </div>
    );
};

export default CKBHistoryPriceChart;
