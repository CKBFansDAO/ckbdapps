import React, {useEffect, useState} from 'react'

import { useTranslation } from 'react-i18next';

import Marquee from "react-fast-marquee";

import bulletin_config from '../../assets/JsonData/bulletin_config.json'


const new_feature_config = [
    {
        display_name:"footer.feedback",
        link:"https://rr3ottoa6u.larksuite.com/sheets/shtusaqvqtJViGREM9rbRk2GBZn?from=seekdid.com"
    },
    {
        display_name:"footer.followus",
        link:"https://twitter.com/@seekdid"
    },
    {
        display_name:"footer.digitdao-proposal",
        link:"https://metaforo.io/g/digitdao?filter=proposals"
    }
]

const Bulletin = (props) => {

    const [bulletinVisible, setBulletinVisible] = useState(false);

    const [t] = useTranslation();

    

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

    const renderHotEvents = () => {
        if (!bulletin_config.hot_events || bulletin_config.hot_events.length == 0) {
            return;
        }

        return <div>
            {
                bulletin_config.hot_events?.map((item, index) => {
                    if (index == 0) {
                        return <div className='flex flex-row' key={`bulletin-${index}`}>
                            <span className='flex items-center text-[14px] text-[#FFF] flex items-center px-2 font-semibold break-all'>🔥🔥🔥🔥🔥{t('bulletin.hot-events.title')}</span>
                            { 
                                item.url ? (<a className='text-[14px] text-[#FFF] text-sm px-3 py-5 hover:text-[#FFA000]' href={item.url} rel="noopener noreferrer" target="_blank">
                            {t(item.name)}
                                </a>):(<span className='flex items-center text-[14px] text-[#FFF] flex items-center px-2 font-semibold break-all'>{t(item.name)}</span>)
                            }
                        </div>
                    }
                    else {
                        return <div key={`bulletin-${index}`}>
                            { 
                                item.url ? (<a className='text-[14px] text-[#FFF] text-sm px-3 py-5 hover:text-[#FFA000]' href={item.url} rel="noopener noreferrer" target="_blank">
                            {t(item.name)}
                                </a>):(<span className='flex items-center text-[14px] text-[#FFF] flex items-center px-2 font-semibold break-all'>{t(item.name)}</span>)
                            }
                        </div>
                    }
                })
            }
    </div>
    }

    const renderBulletin = () => {
        if (bulletinVisible) {
            return <div className='flex flex-row px-3 items-center justify-center h-10 bg-[#DF4A46]'>
            <div className='flex grow justify-between'>
                <div/>
                <div className='flex h-7 flex-row items-center py-1 justify-center rounded-[15px]'>
                    <Marquee className='' pauseOnHover='true' pauseOnClick='true' speed='35' gradient='true' gradientColor={[223, 74, 71]} gradientWidth='40px'> 
                        <span className='flex items-center text-[14px] text-[#FFF] flex items-center px-2 font-semibold break-all'>{t(bulletin_config.bulletin)}</span>
                        {renderHotEvents()}
                    </Marquee>
                </div>
                <div/>
            </div>
            <i className="flex items-center justify-center fa-solid fa-xmark text-[14px] cursor-pointer hover:text-red ml-3 px-2 h-5 w-5 rounded-[10px] bg-[#B73A3A] hover:bg-[#ed6b61] active:bg-[#b35048] border-0 text-white"
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

    return (<div>
        {renderBulletin()}
    </div>
    )
}

export default Bulletin