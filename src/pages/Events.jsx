import React from 'react'
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom';
import AllEventsView from '../components/events/AllEventsView';
import {HotEventsView} from '../components/events/HotEventsView';
import eventListCache from '../utils/cache/eventListCache';
import dappListCache from '../utils/cache/dappListCache';
import { EventViewType } from '../constants/eventsDef';


const Events = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedView, setSelectedView] = useState(searchParams.get("display") || EventViewType.HOT);
    const [eventList, setEventList] = useState([]);

    const [t] = useTranslation();

    useEffect(() => {
        const fetchEventList = async () => {
            //console.log('fetchEventList');
            const events = await eventListCache.getDataList();

            // 使用 for...of 循环确保异步操作按顺序完成
            for (const item of events) {
                item.logo_file = await dappListCache.getLogoByProjectName(item.project_name);
            }

            setEventList(events);
        };

        fetchEventList();
    }, []);

    document.title = t('page-title.events');
    return (
        <div className={`max-w-content mx-auto w-full `}>
            {selectedView === EventViewType.ALL && <AllEventsView eventList={eventList} setView={(view_type) => setSelectedView(view_type)}/>}
            {selectedView === EventViewType.HOT && <HotEventsView eventList={eventList} setView={(view_type) => setSelectedView(view_type)}/>}
        </div>
    )
}

export default Events
