import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../../utils/i18n';
import loadingGif from '../../assets/images/loading.gif'
import { EventCard } from './EventCard';


const GroupCards = ({ title, eventList, eventStatus, onViewAllClick, isLoading }) => {

    const [t] = useTranslation();

    useEffect(() => {

    }, []);


    const renderLoading = () => {
        return <div className='flex justify-center w-full'>
            <img className='w-[300px] h-[300px]' src={loadingGif} alt="Loading" />
        </div>
    }

    const onViewAll = () => {
        if (onViewAllClick) {
            onViewAllClick(eventStatus);
        }
    }

    // 
    return (<div className='gap-5'>
        {isLoading ? renderLoading() : (
            <div className='flex flex-col gap-5'>
                <div className='flex '>
                    <span className='text-[#151515] text-[18px] md:text-[25px] font-bold'>{title}</span>
                    <div className='grow'></div>
                    <span className='text-[#888888] text-[18px] md:text-[20px] font-bold hover:text-[#733DFF] cursor-pointer'
                        onClick={onViewAll}>
                        {t('events.view-all')}
                    </span>
                </div>
                <div className='flex flex-row flex-wrap gap-6 justify-center'>
                    {eventList?.map((event, index) => (
                        <EventCard key={`${event.project_name}-event-${index}`} eventConfig={event} />
                    ))}
                </div>
            </div>)}
    </div>
    );
}

export { GroupCards }