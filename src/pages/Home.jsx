import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import ProjectIconsSVG from '../components/svg/ProjectIconSVG';
import dappListCache from '../utils/cache/dappListCache';
import axios from 'axios';
import ViewHalvingAlert from '../components/alert/ViewHalvingAlert';
import CKBHalvedAlert from '../components/alert/CKBHalvedAlert';
import useCKBHalving from '../hooks/useCKBHalving';
import { HalvingAlertType, checkHalvingAlertType, getNextHalvingEpoch } from '../utils/helper';
import CKBHistoryPriceChart from '../components/chart/CKBHistoryPriceChart';
import CKBTokenSummary from '../components/CKBTipSummary/CKBTokenSummary';
import CKBHashRateChart from '../components/chart/CKBHashRateChart';

const Home = () => {

    const [t] = useTranslation()
    const [dappLogos, setDappLogos] = useState([]);
    const { data: halvingData, isLoading, isError } = useCKBHalving();

    useEffect(() => {
        const fetchDappLogos = async () => {
            const logos = await dappListCache.getDappLogos();
            setDappLogos(logos);
        };

        fetchDappLogos();
    }, []);

    // Before the halving event, the notification ViewHalvingAlert is displayed, 
    // and after the halving event, the dialog CKBHalvedAlert for successful halving is shown. 
    // When a user visits the homepage, it checks whether it's before the halving event and if the user has already been notified. 
    // If not, the ViewHalvingAlert dialog is displayed. 
    // While a user stays on any page, if the halving event occurs during that time, dialog CKBHalvedAlert is shown.
    const showHalvingRemindAlert = () => {
        if (!halvingData) {
            //console.log(halvingData)
            return <></>;
        }

        //console.log(halvingData)
        let alertType = checkHalvingAlertType(halvingData);
        //console.log(alertType);
        if (alertType === HalvingAlertType.HALVING) {
            return <ViewHalvingAlert halvingTime={halvingData.estimatedHalvingTime} halvingEpoch={getNextHalvingEpoch(halvingData.curEpoch.number)}></ViewHalvingAlert>
        }
        else if (alertType === HalvingAlertType.HALVED) {
            return <CKBHalvedAlert halvedTime={halvingData?.prevHalvingTime}></CKBHalvedAlert>
        }


        return <></>
    }

    document.title = t('page-title.home');
    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex-grow'>
                <div className='w-full bg-[#280D5F]'>
                    <div className={`max-w-content mx-auto w-full `}>
                        <ProjectIconsSVG icons={dappLogos} />
                    </div>
                </div>
                <CKBTokenSummary></CKBTokenSummary>
            </div>

            {showHalvingRemindAlert(halvingData)}
            <div className="mx-auto max-w-content w-full">
                <CKBHistoryPriceChart></CKBHistoryPriceChart>
                <CKBHashRateChart></CKBHashRateChart>
            </div>
            <div className='h-10'></div>
        </div>
    )
}

export default Home
