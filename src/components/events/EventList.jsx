import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../../utils/i18n';
import './EventList.css'
import BitTooltip from '../tooltip/bitTooltip';
import Pagination from '../pagination/Pagination';
import loadingGif from '../../assets/images/loading.gif'
import { CKBdappWatchListCache } from '../../utils/cache/dappListCache';
import { EventCard } from './EventCard';


const PAGE_SIZE = 9;

const EventList = ({ eventList, isLoading }) => {
    //const [appList, setAppList] = useState([]);
    const [paginationParam, setPaginationParam] = useState({
        pageSize: PAGE_SIZE,
        pageIndex: 1,
        pageCount: Math.ceil(eventList.lengh / PAGE_SIZE)
    })

    useEffect(() => {
        const pageCount = Math.ceil(eventList.length / paginationParam.pageSize);
        setPaginationParam(prevState => ({
            ...prevState,
            pageCount: pageCount,
            pageIndex: 1,
        }));
    }, [eventList, paginationParam.pageSize]);

    const gotoPage = (pageIndex) => {
        setPaginationParam(prevState => ({
            ...prevState,
            pageIndex: pageIndex
        }));
    }

    const changePageSize = (newSize) => {

        const pageCount = Math.ceil(eventList.length / newSize);
        setPaginationParam(prevState => ({
            ...prevState,
            pageSize: newSize,
            pageIndex: 1,
            pageCount: pageCount
        }));
    }

    const renderLoading = () => {
        return <div className='flex justify-center w-full'>
            <img className='w-[300px] h-[300px]' src={loadingGif} alt="Loading" />
        </div>
    }

    const renderPagination = () => {
        if (isLoading) {
            return <></>
        }

        return (
            <Pagination
                pageCount={paginationParam.pageCount}
                pageIndex={paginationParam.pageIndex}
                pageSize={paginationParam.pageSize}
                fnGotoPage={gotoPage}
                fnChangePageSize={changePageSize}>
            </Pagination>
        )
    }

    // 
    return (<div className='flex flex-col gap-5'>
        {isLoading ? renderLoading() : (
            <div className='flex flex-row flex-wrap gap-6 justify-center'>
                {eventList?.slice(
                    (paginationParam.pageIndex - 1) * paginationParam.pageSize,
                    paginationParam.pageIndex * paginationParam.pageSize
                ).map((event, index) => (
                    <EventCard key={`${event.project_name}-event-${index}`} eventConfig={event} />
                ))}
            </div>)}
        {renderPagination()}
    </div>
    );
}

export { EventList }