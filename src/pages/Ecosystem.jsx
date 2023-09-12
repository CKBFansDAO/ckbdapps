import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'
import { ReactComponent as WarningIcon } from '../assets/images/icon-Warn@1x.svg';
import { AppList } from '../components/ecosystem/AppList';
import dappListCache, { CKBdappWatchListCache } from '../utils/cache/dappListCache';
import BitTooltip from '../components/tooltip/bitTooltip';

const Ecosystem = () => {

    const [t] = useTranslation()

    const [appList, setAppList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorySel, setCategorySel] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isShowWatchList, setIsShowWatchList] = useState(false);

    const searchEditRef = useRef(null);

    useEffect(() => {
        const fetchDappList = async () => {
            const dapps = await dappListCache.getDataList(isShowWatchList);
            setAppList(dapps);

            // 创建一个空对象用于统计每个 category 的应用数量
            const categoryCounts = { 'all': 0 };
            // 遍历 dappList 数组
            dapps.forEach(item => {
                // 遍历当前应用的 categories 数组
                item.categories.forEach(category => {
                    // 检查当前 category 是否已经存在于 categoryCounts 对象中
                    if (category in categoryCounts) {
                        // 如果已存在，则将对应 category 的计数加一
                        categoryCounts[category]++;
                    } else {
                        // 如果不存在，则初始化对应 category 的计数为一
                        categoryCounts[category] = 1;
                    }
                });
                categoryCounts['all']++
            });

            setCategories(categoryCounts);
        };

        fetchDappList();
    }, [isShowWatchList]);

    const renderRiskWarningBar = () => {
        return (
            <div className='flex flex-row w-full md:mt-6'>
                <div className='flex flex-row items-center w-full p-1 justify-center bg-[#28C1B0] rounded-[5px] md:rounded-full'>
                    <div>
                        <WarningIcon className='h-7 ml-2 md:ml-5 w-5'></WarningIcon>
                    </div>
                    <div className='text-[14px] text-[#FFF] flex items-center px-3 font-semibold break-all'>{t('ecosystem.risk-warning')}</div>
                </div>
            </div>
        )
    }

    const showWatchListClicked = (e) => {
        setIsShowWatchList(e.target.checked);
        if (e.target.checked) {
            setCategorySel('all');
        }
    }

    const renderWatchListSwitch = () => {
        return <div className="flex items-center justify-center">
            <BitTooltip content={isShowWatchList? t('ecosystem.toast-show-all') : t('ecosystem.toast-show-watchlist')} direction="top" className='mb-2'>
        <label htmlFor="toggleSwitch" className="flex items-center cursor-pointer">
            { /* -- label -- */}
            <div className="ml-2 text-[#333] mr-3">
            {t('ecosystem.show-watchlist')}
            </div>
            {/*toggle*/}
            <div className="relative">
                { /*input */}
                <input type="checkbox" id="toggleSwitch" className="sr-only" checked={isShowWatchList} onChange={showWatchListClicked}/>
                { /* -- line -- */}
                <div className={`block ${isShowWatchList ? 'bg-[#733DFF]' : 'bg-[#575766]'} w-10 h-5 rounded-full`}></div>
                { /* -- dot -- */}
                <div className="dot absolute left-[3px] top-[3px] bg-white w-[14px] h-[14px] rounded-full transition"></div>
            </div>
            
        </label>
        </BitTooltip>
      </div>
    }

    const renderSearchBar = () => {
        return <div className='flex gap-6 w-full items-center'>
            <span className='items-center text-[24px] hidden md:block'>{t('ecosystem.all-projects')}</span>
            <div class="relative">
                <div class="absolute top-1 left-2.5 ">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input ref={searchEditRef} class="w-full h-[30px] border-[#C4C4C4] border-[1px] rounded-full pl-8" type="text" placeholder={t('ecosystem.search-placehold')}
                    onChange={(e) => {
                        if (e.target.value === '') {
                            setSearchKeyword('')
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setSearchKeyword(e.target.value);
                        }
                    }}
                />                
            </div>
            <div className='grow'></div>
            {renderWatchListSwitch()}
        </div>
    }

    const renderCategories = () => {
        return <div className='flex flex-wrap gap-2 text-sm'>
            {Object.entries(categories).map(([category, count]) => (
                <div key={category} className={`flex items-center ${categorySel === category ? 'bg-[#733DFF] text-white font-bold' : 'bg-[#C4C4C4] hover:bg-[#5727AE] text-black hover:text-white'} text-white rounded-[5px] px-2 md:px-5 py-1 md:py-2 cursor-pointer`}
                    onClick={() => setCategorySel(category)}>
                    <span className="mr-1">{category === 'all' ? t('ecosystem.all-projects') : t(`ecosystem.tags.${category}`, category)}</span>
                    <span className="text-[10px]">({count})</span>
                </div>
            ))}
        </div>
    }

    const filterProject = (category) => {
        let appDataList = appList;

        if (category === 'all' || !category) {
            if (!searchKeyword) {
                return appDataList; // 返回全部数据
            } else {
                // 使用 filter 方法筛选出包含关键字的数据
                return appDataList.filter((dapp) =>
                    dapp.project_name.match(new RegExp(searchKeyword, 'i'))
                );
            }
        } else {
            if (!searchKeyword) {
                // 返回属于指定类别的全部数据
                return appDataList.filter((dapp) => dapp.categories.includes(category));
            } else {
                // 同时满足指定类别和包含关键字的条件
                return appDataList.filter((dapp) =>
                    dapp.project_name.match(new RegExp(searchKeyword, 'i'))
                );
            }
        }
    }

    const clearSearchEdit = () => {
        searchEditRef.current.value = '';
        setSearchKeyword('');
        searchEditRef.current.focus();
    }

    const renderNoResult = () => {
        const result = filterProject(categorySel);
        if (appList.length === 0) {
            return <div className='flex flex-col items-center gap-3'>
                <span className='text-lg font-semibold'>{t('ecosystem.no-watchlist-tip')}</span>
                <div className='flex items-center bg-[#733DFF] text-sm font-bold text-white rounded-[5px] px-2 md:px-5 py-1 md:py-2 cursor-pointer' onClick={showWatchListClicked}>{t('ecosystem.toast-show-all')}</div>
            </div>
        }
        else {
            if (result.length === 0) {
                return <div className='flex flex-col items-center gap-3'>
                <span className='text-lg font-semibold'>{t('ecosystem.no-search-result-tip')}</span>
                <div className='flex items-center bg-[#733DFF] text-sm font-bold text-white rounded-[5px] px-2 md:px-5 py-1 md:py-2 cursor-pointer' onClick={clearSearchEdit}>{t('ecosystem.clear-search')}</div>
            </div>
            }
        }

        return <></>
    }

    document.title = t('page-title.ecosystem');
    let dataList = filterProject(categorySel);
    return (
        <div className={`max-w-content mx-auto w-full `}>
            <div className='p-4 gap-6 flex flex-col'>
                {renderRiskWarningBar()}
                {renderSearchBar()}
                {renderCategories()}
                {renderNoResult()}
                <AppList appList={dataList} isLoading={dataList.length === 0}></AppList>
            </div>
        </div>
    )
}

export default Ecosystem
