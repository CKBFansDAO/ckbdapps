import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next';

import Marquee from "react-fast-marquee";

import bulletin_config from '../../assets/JsonData/bulletin_config.json'
import { useLocation, useNavigate } from 'react-router-dom';


const Bulletin = (props) => {

    const [bulletinVisible, setBulletinVisible] = useState(false);

    const [t] = useTranslation();

    const navigate = useNavigate(); 
    const location = useLocation();

    useEffect(() => {
        setBulletinVisible(checkNeedShowBulletin());
    }, []);

    const checkNeedShowBulletin = () => {
        console.log(bulletin_config);
        let bulletinClosedVersion = localStorage.getItem('bulletin-closed');
        if (bulletinClosedVersion !== bulletin_config.version && bulletin_config.need_show) {
            return true;
        }

        return false;
    }

    const renderBulletinItem = (item) => {
        let bulletDom = <span className='flex items-center text-[14px] text-[#FFF] font-semibold break-all mr-2'>{t(item.text)}</span>
        if (!item.url || item.url.length == 0) {
            return bulletDom
        }

        // 如果链接是一个完整
        let url = item.url;
        if (url && url.startsWith('/')) {
            if (url === location.pathname) {
                // 当前页面是指定的相对路径，创建<span>标签
                return bulletDom
            } else {
                // 在网站内部进行跳转
                return (<div className='flex'>
                    {bulletDom}
                    <span onClick={() => navigate(url)} className='text-[14px] cursor-pointer underline underline-offset-1 text-[#00DF9B] hover:text-white'>{t("common.learn-more")}</span>
                </div>
                );
            }
        } else if (url) {
            // 配置的是站外的URL地址，创建<a>标签
            return (<div className='flex'>
                {bulletDom}
                <a href={url} target="_blank" rel="noopener noreferrer" className='text-[14px] underline underline-offset-2 text-[#00DF9B]  hover:text-white'>{t("common.learn-more")}
                </a>
            </div>
            );
        } else {
            // 配置的URL为空，创建<span>标签
            return bulletDom
        }
    }

    const renderBulletins = () => {
        if (!bulletin_config.bulletins || bulletin_config.bulletins.length == 0) {
            return;
        }

        return <div className='flex gap-5'>
                
            {
                bulletin_config.bulletins?.map((item, index) => {
                    return <div key={`bulletin-${index}`} className='flex mr-5'>
                        <span className='flex items-center text-[14px] text-[#FFF] px-2 font-semibold break-all'>📢</span>
                        {renderBulletinItem(item)}
                        {/*
                            item.url ? (<a className='text-[14px] text-[#FFF] text-sm px-3 hover:text-[#FFA000]' href={item.url} rel="noopener noreferrer" target="_blank">
                                {t(item.text)}
                            </a>) : (<span className='flex items-center text-[14px] text-[#FFF] px-2 font-semibold break-all'>{t(item.text)}</span>)
                */}
                    </div>

                })
            }
        </div>
    }

    const renderBulletin = () => {
        if (bulletinVisible) {
            return <div className='flex flex-row px-3 items-center justify-center h-10 bg-[#733DFF]'>
                <div className='flex grow justify-between'>
                    <div />
                    <div className='flex h-7 flex-row items-center py-1 justify-center rounded-[15px]'>
                        <Marquee className='' pauseOnHover='true' pauseOnClick='true' speed='35' gradient='false' gradientColor={[115, 51, 255]} gradientWidth='40px'>
                            
                            <div className='flex gap-3'>
                                {renderBulletins()}
                            </div>
                        </Marquee>
                    </div>
                    <div />
                </div>
                <i className="flex items-center justify-center fa-solid fa-xmark text-[14px] cursor-pointer hover:text-red ml-3 pl-[5px] pt-[3px] h-5 w-5"
                    onClick={closeBulletin}></i>
            </div>
        }

        return <></>
    }

    const closeBulletin = () => {
        // 不可见，并设置缓存数据
        setBulletinVisible(false);

        localStorage.setItem('bulletin-closed', bulletin_config.version);
    }

    return (<div className='w-full'>
        {renderBulletin()}
    </div>
    )
}

export default Bulletin