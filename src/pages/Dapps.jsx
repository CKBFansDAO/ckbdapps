import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../utils/i18n';

const link_icon_config = {
    "official":{
        "icon_class":"fa-solid fa-globe",
    },
    "twitter":{
        "icon_class":"fa-brands fa-x-twitter",
    },
    "discord":{
        "icon_class":"fa-brands fa-discord",
    },
    "telegram":{
        "icon_class":"fa-brands fa-telegram",
    },
    "github":{
        "icon_class":"fa-brands fa-github",
    },
    "medium":{
        "icon_class":"fa-brands fa-medium",
    }
}

function AppList() {
    const [appList, setAppList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/dappList/dapps_list.json')
        .then(res => res.json())
        .then(data => {
            setAppList(data.dappList);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error loading dapps list:', error);
            setLoading(false);
        });
    }, []);

    return (
        <div className='flex flex-row flex-wrap gap-6 justify-center'>
        {loading ? (
            <p>Loading apps...</p>
        ) : appList.map((app, index) => (
            <App key={`${app.project_name}-${index}`} config={app} />
        ))}
        </div>
    );
}

function App({ config }) {
    const [appConfig, setAppConfig] = useState({});
    const [dappId, setDappId] = useState(null);
    const [dappsList, setDappsList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    console.log(config);
    useEffect(() => {
        fetch('/dappList/dapps_list.json')
        .then(res => res.json())
        .then(data => {
            setDappsList(data.dappList);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error loading dapps list:', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (dappId && dappsList.length > 0) {
            const config = dappsList.find(dapp => dapp.path_name === dappId);
            if (config) {
                fetch(`/dappList/${config.path_name}/${config.config_file}`)
                .then(res => res.json())
                .then(data => {
                    setAppConfig(data);
                })
                .catch(error => {
                    console.error('Error loading dapp config:', error);
                });
            }
        }
    }, [dappId, dappsList]);

    const renderAppCategories = (categories) => {
        return <div className='flex gap-2'>
            {   
                categories?.map((category, index) =>{
                    return <span key={`${category}-${index}`} className='px-4 text-sm h-[25px] flex items-center rounded-full bg-[#EBEBEB]'>{category}</span>
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

    const renderAppLinks = () => {
        console.log(appConfig);
        if (!appConfig.links) {
            return <></>
        }
        //
        
        let linkArr = [];
        Object.keys(appConfig.links)?.forEach((key)=> {
            let linkObj = {
                name: key,
                url: appConfig.links[key]
            };

            if (linkObj.url) {
                linkArr.push(linkObj);
            }
        })

        return <div className='flex gap-2'>
        {   
            linkArr?.map((linkObj, index) => {
               //console.log(linkObj);
               //console.log(link_icon_config);
               //console.log(link_icon_config[linkObj.name]);
               let icon_class = link_icon_config[linkObj.name].icon_class;
                return <a key={`${linkObj.name}-${index}`} href={`${linkObj.url}`} target='_blank' className='h-6 w-6 bg-[#666666] pt-[11.5px] rounded-full flex justify-center'>
                    <i className={`${icon_class} fa-sm`}></i>
                </a>
            })
        }
    </div>
    }

    return (
        <div className='w-full md:w-[364px] hover:scale-105 transform-gpu p-5 gap-5 rounded-xl flex flex-col border-[#EFEFEF] shadow-[0_2px_10px_0_rgba(0,0,0,0.2)]'>
            <div className='flex  items-center'>
                <img className='w-12 h-12 rounded-full' src={`../dappList/${appConfig.path_name}/${appConfig.logo_file}`}></img>
                <div className='flex flex-col ml-2 grow'>
                    <span className="text-base font-bold text-[25px]" >{appConfig.project_name}</span>
                    <span className="text-base text-[#888888] font-thin" >{appConfig.project_name}</span>
                </div>
                <i className="fa-regular fa-heart"></i> 
            </div>
            <div className='flex'>
                {renderAppCategories(appConfig.categories)}
            </div>
            <span className='text-sm h-10'>{getAppLocaleConfig('project_summary')}</span>
            {renderAppLinks()}
        </div>
    );
}

const Dapps = () => {

    const [t] = useTranslation()

    return (
        <div className='p-4'>
            <AppList></AppList>
            
        </div>
    )
}

export default Dapps
