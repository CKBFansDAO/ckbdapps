import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../utils/i18n';
import { ReactComponent as WarningIcon } from '../assets/images/icon-Warn@1x.svg';
import { AppList } from '../components/ecosystem/AppList';
import dappListCache from '../utils/cache/dappListCache';

const Ecosystem = () => {

    const [t] = useTranslation()

    const [appList, setAppList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorySel, setCategorySel] = useState('all');

    useEffect(() => {
        const fetchDappList = async () => {
            const dapps = await dappListCache.getDataList();
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
        /*
        return;

        fetch('../dappList/dapps_list.json')
            .then(response => response.json())
            .then((data) => {
                setAppList(data.dappList);
                // collect categories   
                //const allCategories = [...new Set(data.dappList.flatMap(item => item.categories))];
                //setCategories(allCategories);

                // 创建一个空对象用于统计每个 category 的应用数量
                const categoryCounts = { 'all': 0 };
                // 遍历 dappList 数组
                data.dappList.forEach(item => {
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
            });*/
    }, []);

    const renderRiskWarningBar = () => {
        return (
            <div className='flex flex-row w-full'>
                <div className='flex flex-row items-center w-full p-1 justify-center bg-[#28C1B0] rounded-[5px] md:rounded-full'>
                    <div>
                        <WarningIcon className='h-7 ml-2 md:ml-5 w-5'></WarningIcon>
                    </div>
                    <div className='text-[14px] text-[#FFF] flex items-center px-3 font-semibold break-keep'>{t('ecosystem.risk-warning')}</div>
                </div>
            </div>
        )
    }

    const renderCategories = () => {
        return <div className='flex flex-wrap gap-2 text-sm'>
            {Object.entries(categories).map(([category, count]) => (
                <div key={category} className={`flex items-center ${categorySel === category ? 'bg-[#733DFF] text-white font-bold' : 'bg-[#C4C4C4] hover:bg-[#5727AE] text-black hover:text-white'} text-white rounded-[5px] px-2 md:px-5 py-1 md:py-2 cursor-pointer`}
                    onClick={() => setCategorySel(category)}>
                    <span className="mr-1">{category === 'all' ? t('ecosystem.all-projects') : category}</span>
                    <span className="text-[10px]">({count})</span>
                </div>
            ))}
        </div>
    }

    const filterProject = (category) => {
        if (category === 'all' || !category) {
            return appList;
        }

        // 使用 filter 方法筛选出属于指定类别的 Dapp
        const filteredDapps = appList.filter((dapp) =>
            dapp.categories.includes(category)
        );

        return filteredDapps;
    }

    return (
        <div className='p-4 gap-6 flex flex-col'>
            {renderRiskWarningBar()}
            {renderCategories()}
            <AppList appList={filterProject(categorySel)}></AppList>
        </div>
    )
}

export default Ecosystem
