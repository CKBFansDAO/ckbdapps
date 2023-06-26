import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../../utils/i18n';
import './AppList.css'
import BitTooltip from '../tooltip/bitTooltip';
import Pagination from '../pagination/Pagination';
import loadingGif from '../../assets/images/loading.gif'



const link_icon_config = {
    "official": {
        "icon_class": "fa-solid fa-globe",
    },
    "twitter": {
        "icon_class": "fa-brands fa-twitter",
    },
    "discord": {
        "icon_class": "fa-brands fa-discord",
    },
    "telegram": {
        "icon_class": "fa-brands fa-telegram",
    },
    "github": {
        "icon_class": "fa-brands fa-github",
    },
    "medium": {
        "icon_class": "fa-brands fa-medium",
    },
    "reddit": {
        "icon_class": "fa-brands fa-reddit",
    },
    "youtube": {
        "icon_class": "fa-brands fa-youtube",
    }
}

const AppList = ({ appList, isLoading }) => {
    //const [appList, setAppList] = useState([]);

    const [paginationParam, setPaginationParam] = useState({
        pageSize: 10,
        pageIndex: 1,
        pageCount: Math.ceil(appList.lengh / 10)
    })

    useEffect(() => {
        const pageCount = Math.ceil(appList.length / paginationParam.pageSize);
        setPaginationParam(prevState => ({
            ...prevState,
            pageCount: pageCount,
            pageIndex: 1,
        }));
    }, [appList, paginationParam.pageSize]);

    const gotoPage = (pageIndex) => {
        setPaginationParam(prevState => ({
            ...prevState,
            pageIndex: pageIndex
        }));
    }

    const changePageSize = (newSize) => {

        const pageCount = Math.ceil(appList.length / newSize);
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
        {isLoading ? renderLoading() :(
        <div className='flex flex-row flex-wrap gap-6 justify-center'>
            {appList?.slice(
                (paginationParam.pageIndex - 1) * paginationParam.pageSize,
                paginationParam.pageIndex * paginationParam.pageSize
            ).map((app, index) => (
                <App key={`${app.project_name}-${index}`} config={app} />
            ))}
        </div>)}
        {renderPagination()}
    </div>
    );
}

const App = ({ config }) => {
    const [appConfig, setAppConfig] = useState(config);
    const [t] = useTranslation();

    /*useEffect(() => {
        if (config.path_name === undefined) {
            return;
        }

        fetch(`../dappList/${config.path_name}/config.json`)
            .then(response => response.json())
            .then(data => setAppConfig(data));
    }, [config]);*/

    const renderAppCategories = (categories) => {
        return <div className='flex gap-2'>
            {
                categories?.map((category, index) => {
                    if (index > 2) {
                        return <></>
                    }
                    return <span key={`${category}-${index}`} className='px-4 text-sm h-[20px] flex items-center rounded-full bg-[#000] border-[#ccc] border-[1px]'>{category}</span>
                })
            }
        </div>
    }

    const getAppLocaleConfig = (config_key) => {
        const locale = currentLanguage();
        if (appConfig[locale]) {
            return appConfig[locale][config_key];
        }

        return '';
    }

    const getAppDescToolTipContent = (config_key) => {
        let tooltip = getAppLocaleConfig(config_key);
        return <div className='w-[314px]'>
            <span className='whitespace-normal break-words leading-relaxed'>{tooltip}</span>
        </div>
    }

    const renderTutorialLink = () => {
        let link = getAppLocaleConfig('tutorial_link');
        if (link) {
            return <BitTooltip content={t(`common.tutorial`)} direction="top">
                <a href={`${link}`} target='_blank' className='h-6 w-6 bg-[#EBEBEB] pt-[11.5px] rounded-full flex justify-center'>
                    <i className={`fa-solid fa-book fa-sm`}></i>
                </a>
            </BitTooltip>
        }

        return <></>
    }

    const renderAppLinks = () => {
        if (!appConfig.links) {
            return <></>
        }
        //

        let linkArr = [];
        Object.entries(appConfig.links)?.forEach(([key, value]) => {
            let linkObj = {
                name: key,
                url: value
            };

            if (linkObj.url) {
                linkArr.push(linkObj);
            }
        })

        return <div className='flex gap-2'>
            {
                linkArr?.map((linkObj, index) => {
                    let icon_class = link_icon_config[linkObj.name].icon_class;
                    return <BitTooltip content={t(`common.${linkObj.name}`)} direction="top">
                        <a key={`${linkObj.name}-${index}`} href={`${linkObj.url}`} target='_blank' className='h-6 w-6 bg-[#EBEBEB] pt-[11.5px] rounded-full flex justify-center'>
                            <i className={`${icon_class} fa-sm`}></i>
                        </a>
                    </BitTooltip>
                })
            }
            {renderTutorialLink()}
        </div>
    }

    return (
        <div className='rounded-[10px] flex flex-col w-full md:w-[314px] shadow-[0_4px_10px_0_rgba(0,0,0,0.2)]'>
            <div className='relative'>
                <div className='flex category-dapp-img place-content-center rounded-t-[10px] bg-[#1C1C23] overflow-hidden'>
                    {
                        appConfig.hero_image ? (<img className=" h-[180px] w-full object-cover duration-300 ease-in-out hover:scale-125" src={appConfig.hero_image ? `../dappList/${appConfig.path_name}/${appConfig.hero_image}` : ''} />)
                            : (<div></div>)
                    }

                </div>
                <div className='category-dapp-title p-5 text-white'>
                    <div className='flex items-center w-full'>
                        {
                            appConfig.logo_file ? (<img className='w-14 h-14 rounded-full' src={`../dappList/${appConfig.path_name}/${appConfig.logo_file}`}></img>)
                                : (<div className='w-14 h-14 rounded-full'></div>)
                        }

                        <div className='flex flex-col ml-2 gap-2 grow'>
                            <span className="text-base font-bold text-[25px]" >{appConfig.project_name}</span>
                            <div className='flex'>
                                {renderAppCategories(appConfig.categories)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col rounded-b-xl bg-white p-5 gap-5'>
                <BitTooltip content={getAppDescToolTipContent('project_summary')} direction="top" className='mb-4'>
                    <span className='text-sm h-10 line-clamp-[2]'>{getAppLocaleConfig('project_summary')}</span>
                </BitTooltip>
                <div className='flex w-full'>
                    {renderAppLinks()}
                    <div className='grow'></div>
                    <BitTooltip content={t('common.coming-soon')} direction="top">
                        <i className="fa-regular fa-heart"></i>
                    </BitTooltip>
                </div>

            </div>
        </div>
    );

}

export { AppList }