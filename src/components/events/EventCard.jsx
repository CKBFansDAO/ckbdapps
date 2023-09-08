import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../../utils/i18n';
import './EventList.css'
import BitTooltip from '../tooltip/bitTooltip';
import { ReactComponent as VerifiedIcon } from '../../assets/images/icon_verified@2x.svg'


const EventCard = ({ eventConfig }) => {
    const [t] = useTranslation();

    useEffect(() => {

    }, []);

    const renderEventCategories = (categories) => {
        return <div className='flex gap-2'>
            {
                categories?.map((category, index) => {
                    if (index > 2) {
                        return <></>
                    }
                    return <span key={`${category}-${index}`} className='px-3 text-sm h-[20px] text-white flex items-center rounded-full bg-[#733DFF]'>{category}</span>
                })
            }
        </div>
    }

    const renderEventStatus = () => {
        const { start_at, end_at } = eventConfig;
        const currentTime = new Date(); // 获取当前时间
        const startTime = new Date(start_at); // 将 startAt 字段转换为 Date 对象
        const endTime = new Date(end_at); // 将 endAt 字段转换为 Date 对象

        let statusText = ''; // 提示文案
        let backgroundColor = ''; // 背景色

        if (currentTime < startTime) {
            statusText = t('events.upcoming');
            backgroundColor = 'bg-[#F56100]'; // 红色
        } else if (currentTime > endTime) {
            statusText = t('events.ended');
            backgroundColor = 'bg-[#777777]'; // 灰色
        } else {
            statusText = t('events.ongoing');
            backgroundColor = 'bg-[#28C1B0]'; // 绿色
        }
        return <div className='event-expire-info flex-row-reverse'>
            <span className={`px-3 text-sm h-[25px] text-white opacity-80 flex items-center rounded-full ${backgroundColor}`}>{statusText}</span>
        </div>
    }

    const getEventLocaleConfig = (config_key) => {
        const locale = currentLanguage();
        if (eventConfig[locale]) {
            return eventConfig[locale][config_key];
        }

        return '';
    }

    const getLocaleToolTipContent = (config_key) => {
        let tooltip = getEventLocaleConfig(config_key);
        return <div className='w-[314px]'>
            <span className='whitespace-normal break-words leading-relaxed'>{tooltip}</span>
        </div>
    }

    const getProjectLogo = () => {
        if (eventConfig.logo_file) {
            return eventConfig.logo_file;
        }

        if (eventConfig.project_name.match(new RegExp('nervos', 'i'))) {
            return './images/nervos-symbol-white.png'
        }
        
    }

    return (
        <div className='rounded-[10px] flex flex-col w-full md:w-[314px] shadow-[0_4px_10px_0_rgba(0,0,0,0.2)]'>
            <div className='relative'>
                <a className='' href={eventConfig.url} rel="noopener noreferrer" target="_blank">
                    <div className='flex event-card-img place-content-center rounded-t-[10px] overflow-hidden'>
                        {
                            eventConfig.img ? (<img className=" h-[180px] w-full object-cover duration-300 ease-in-out hover:scale-125" src={eventConfig.img ? `../eventRes/${eventConfig.img}` : ''} />)
                                : (<div></div>)
                        }
                    </div>
                </a>
                {renderEventStatus()}
            </div>

            <div className='flex flex-col rounded-b-xl bg-white p-5 gap-3'>
                <div className='flex items-center w-full gap-2'>
                    <img className='w-8 h-8 rounded-full' src={getProjectLogo()}></img>
                    <span className="text-base font-bold text-[16px]" >{eventConfig.project_name}</span>
                    <VerifiedIcon></VerifiedIcon>
                </div>
                <a className='' href={eventConfig.url} rel="noopener noreferrer" target="_blank">
                    <span className='h-5 font-bold line-clamp-[2]'>{getEventLocaleConfig('event_title')}</span>
                </a>
                <BitTooltip content={getLocaleToolTipContent('event_desc')} direction="top" className='mb-4'>
                    <span className='text-sm h-10 line-clamp-[2] text-[#777]'>{getEventLocaleConfig('event_desc')}</span>
                </BitTooltip>
                <div className='flex w-full'>
                    {renderEventCategories(eventConfig.categories)}
                </div>

            </div>
        </div>
    );

}

export { EventCard }