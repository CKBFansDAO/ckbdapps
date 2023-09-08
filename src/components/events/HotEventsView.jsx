import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../../utils/i18n';
import BitTooltip from '../tooltip/bitTooltip';
import { GroupCards } from './GroupCards';
import Carousel from '../carousel/Carousel';
import { useSearchParams } from 'react-router-dom';
import { EventStatus, EventViewType } from '../../constants/eventsDef';


const HotEventsView = ({ eventList, setView }) => {

    const [t] = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {

    }, [searchParams]);

    const getBannersEvents = () => {
        // 从 eventList 遍历找出 item.position = banner 的 item，放入一个数组中，并返回
        const bannerEvents = eventList.filter(item => item.position === 'banner' && new Date() < new Date(item.end_at));
        return bannerEvents;
    }

    const getUpcomingEvents = () => {
        const upComingEvents = eventList.filter(item => new Date() < new Date(item.start_at));
        return upComingEvents.sort((a, b) => new Date(a.start_at) - new Date(b.start_at)).slice(0, 3);
    }

    const getOngoingEvents = () => {
        const ongoingEvents = eventList.filter(item => new Date(item.start_at) <= new Date() && new Date() < new Date(item.end_at));
        return ongoingEvents.sort((a, b) => new Date(a.start_at) - new Date(b.start_at)).slice(0, 3);
    }

    const getEndedEvents = () => {
        const endedEvents = eventList.filter(item =>  new Date() >= new Date(item.end_at));
        return endedEvents.sort((a, b) => new Date(b.end_at) - new Date(a.end_at)).slice(0, 3);
    }

    const onViewAllClicked = (eventStatus) => {
        setSearchParams({ display: EventViewType.ALL, event_status: eventStatus});
        if (setView) {
            setView(EventViewType.ALL);
        }
    }

    const upComingEvents = getUpcomingEvents();
    const ongoingEvents = getOngoingEvents();
    const endedEvents = getEndedEvents();
    const bannerEvents = getBannersEvents();
    const bannerImages = bannerEvents.map(item => `../eventRes/${item.img}`);

    const onBannerClicked = (index) => {
        if (bannerEvents.length > 0 && index < bannerEvents.length) {
            window.open(bannerEvents[index].url, '_blank')
        }
    }

    return (
        <div className={`max-w-content mx-auto w-full `}>
            <div className='p-4 gap-6 flex flex-col md:py-10'>
                {bannerImages.length > 0 && (<Carousel images={bannerImages} interval={5000} onImageClick={onBannerClicked}></Carousel>)}
                {ongoingEvents.length > 0 && (<GroupCards title={t('events.ongoing')} eventList={ongoingEvents} eventStatus={EventStatus.ONGOING} onViewAllClick={onViewAllClicked} isLoading={eventList.length === 0}></GroupCards>)}
                <GroupCards title={t('events.upcoming')} eventList={upComingEvents} eventStatus={EventStatus.UNCOMING} onViewAllClick={onViewAllClicked} isLoading={eventList.length === 0}></GroupCards>
                <GroupCards title={t('events.ended')} eventList={endedEvents} eventStatus={EventStatus.ENDED} onViewAllClick={onViewAllClicked} isLoading={eventList.length === 0}></GroupCards>
            </div>
        </div>
    );

}

export { HotEventsView }