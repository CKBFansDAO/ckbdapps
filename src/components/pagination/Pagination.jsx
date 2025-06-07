import React, {useState, useEffect, useRef} from 'react'
import { useTranslation } from 'react-i18next';
import DropdownMenu from '../dropdown/DropdownMenu';

/**
 * 
 * @param {*} props : 
 * @returns 
 */

 const page_size_config = [
    {
        "label":"component.pagination.10-per-page",
        "data":"10",
    },
    {
        "label":"component.pagination.20-per-page",
        "data":"20",
    },
    {
        "label":"component.pagination.40-per-page",
        "data":"40",
    },
    {
        "label":"component.pagination.50-per-page",
        "data":"50",
    }
]

const Pagination = (props) => {

    const [pageSize, setPageSize] = useState(props.pageSize ? props.pageSize : 20);

    const [t] = useTranslation();

    const gotoPageRef = useRef(null);

    let data = {
        pageCount: props.pageCount,
        pageIndex: props.pageIndex,
    }

    useEffect(() => {

    }, [props]);

    
    const gotoPage = (pageIndex) => {
        if (isNaN(pageIndex)) {
            return;
        }

        if (pageIndex > data.pageCount) {
            pageIndex = data.pageCount;
        }
        else if (pageIndex < 1) {
            pageIndex = 1;
        }

        if (pageIndex === data.pageIndex) {
            return;
        }

        props.fnGotoPage(pageIndex);
    }

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            let pageIndex = parseInt(gotoPageRef.current.value);
            gotoPage(pageIndex);
            
            gotoPageRef.current.value = "";
        }
    };

    const renderCurPageSize = () => {
        let filterText = "";

        let config = page_size_config.find(item => item.data == pageSize);
        if (config) {
            filterText = t(config.label);
        }

        return <div className={`flex flex-row common-menu pl-2 h-[28px] text-sm border-gray-400 rounded-lg border-[1px] items-center hover:border-[#00DF9B] hover:ring-1 ring-[#00DF98]`}>
            <div className='py-1 px-1'>{filterText}</div>
            <i className="fa fa-angle-down mx-2 py-2 text-bold hover:text-[#00DF9B]" aria-hidden="true"></i>
        </div>
    }

    const changePageSize = (size) => {
        setPageSize(size);
        //gotoPage
        if (props.fnChangePageSize) {
            props.fnChangePageSize(size);
        }
    }

    const RenderPageSizeMenuItem = (item, index) => {
        return <div key={`pagesize-dropdown-${item.data}-${index}`} className="flex flex-row py-1.5 pl-5 cursor-pointer common-menu pr-5" onClick={() => changePageSize(parseInt(item.data))}>
                <span className='text-sm'>{t(item.label)}</span>
            </div>
    }

    const renderPagination = () => {
        let hasNextPage = data.pageCount > data.pageIndex;
        let hasPrevPage = data.pageIndex > 1 && data.pageCount > 1;
        
        let nextPageBtn = <button className={`text-[#222] font-medium opacity-50 cursor-not-allowed didsabled:cursor-not-allowed disabled:opacity-50`} disabled>{t('component.pagination.next-page')}</button>
        if (hasNextPage) {
            nextPageBtn = <button className={`hover:text-[#00DF9B] text-[#222] font-medium`} onClick={()=>{gotoPage(data.pageIndex + 1)}}>{t('component.pagination.next-page')}</button>
        }

        let prevPageBtn = <button className={`text-[#222] font-medium opacity-50 cursor-not-allowed didsabled:cursor-not-allowed disabled:opacity-50`} disabled>{t('component.pagination.prev-page')}</button>
        if (hasPrevPage) {
            prevPageBtn = <button className={`hover:text-[#00DF9B] text-[#222] font-medium`} onClick={()=>{gotoPage(data.pageIndex - 1)}}>{t('component.pagination.prev-page')}</button>
        }

        return <div className='flex flex-row h-[28px] gap-2 md:gap-4 place-content-center'>
            {prevPageBtn}
            <span className='py-0.5 text-[#222] font-medium'>{data.pageIndex}/{data.pageCount}</span>
            {nextPageBtn}
            {/*<DropdownMenu className="z-0"
                customToggle={() => renderCurPageSize()}
                contentData={page_size_config}
                renderItems={(item, index) => RenderPageSizeMenuItem(item, index)}
    ></DropdownMenu>*/}
            <span className='py-0.5 text-[#222] font-medium'>{t("component.pagination.goto-page")}</span>
            <input className='w-[50px] h-[28px] text-center px-1 border-gray-400 rounded-full border-[1px]' 
                ref={gotoPageRef} type="text" onKeyDown={handleKeyDown}/>
        </div>
    }

    return (<>
        {renderPagination()}
    </>
    )
}

export default Pagination
