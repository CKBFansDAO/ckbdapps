import React, { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next';
import HalvingAnimate from './HalvingAnimate';

import { ReactComponent as CKBLogo } from '../../assets/images/nervos-logo-white.svg';
import useCKBHalving from '../../hooks/useCKBHalving';
import BitTooltip from '../tooltip/bitTooltip';
import BlockchainProgressBar from '../progressbar/BlockchainProgressBar';
import CountdownTimer from '../countdown/CountdownTimer';
import CKBTipSummary from '../CKBTipSummary/CKBTipSummary';
import useCKBTipHeader from '../../hooks/useCKBTipHeader';
import { getNextHalvingEpoch } from '../../utils/helper';

const HalvingContainer = (props) => {

    const [t] = useTranslation();

    const [showPopup, setShowPopup] = useState(false);

    const { data, isLoading, isError } = useCKBHalving();
    const { data: tipHeader, isLoading: isLoadingHeader, isError: isTipHeaderErr } = useCKBTipHeader();

    useEffect(() => {

    }, []);


    const renderTwitterShareLink = () => {
        let url =
            `https://twitter.com/intent/tweet?url=ckbdapps.com&text=`

        /*`📢Nervos CKB*/

        return <a className='w-6 h-6 flex justify-center items-center rounded-full bg-white mr-2 icon-shadow hover:shadow-lg hover:bg-[#ddd] active:bg-emerald-500 focus:outline-none'
            href={url} rel="noopener noreferrer" target="_blank">
            <i className="fa-sm fa-brands fa-twitter text-[#28C1B0]"></i>
        </a>

    }

    const renderClipboardShareLink = () => {
        let url =
            `https://twitter.com/intent/tweet?url=ckbdapps.com&text=`

        /*`📢Nervos CKB*/

        return <a className='w-6 h-6 flex justify-center items-center rounded-full bg-white mr-4 icon-shadow hover:shadow-lg hover:bg-[#ddd] active:bg-emerald-500 focus:outline-none'
            href={url} rel="noopener noreferrer" target="_blank">
            <i className="fa-sm fa-solid fa-link text-[#28C1B0]"></i>
        </a>

    }

    const renderHalvingTip = () => {
        return <div className='flex flex-row'>
            <div className='grow'></div>
            <div className='flex flex-row items-center  p-1 justify-center bg-[#28C1B0] rounded-full'>
                <CKBLogo className='h-7 ml-5'></CKBLogo>
                <div className='flex flex-col'>
                    <div className=' text-[14px] text-[#FFF] flex items-center px-3 font-semibold break-keep'>{t('halving.top-tips')}</div>
                    {
                        (isLoading || isError) ? <div className='w-20 h-6 animate-pulse'>
                            <div className='w-20 h-4 my-1 mx-16 flex items-center rounded-full bg-slate-500'></div>
                        </div>
                            : <span className='text-center h-6 text-[18px] text-[#000] px-2 font-semibold'>{new Date(data.estimatedHalvingTime).toLocaleString()}</span>
                    }

                </div>
                {renderTwitterShareLink()}
                {renderClipboardShareLink()}
                
            </div>
            <div className='grow'></div>
        </div>
    }

    return (<div className='flex flex-col -mx-3 -mt-7 md:-mx-7'>
        <div className='bg-[url("../../assets/images/bg_head_halving.png")] bg-cover flex flex-col gap-10'>
            <span className='mt-14 w-full text-center text-[24px] md:text-[48px] text-white font-["Zen_Dots"]'>{t('halving.title')}</span>
            {renderHalvingTip()}

            <CountdownTimer targetDate={data?.estimatedHalvingTime/*1684038959*/}></CountdownTimer>

            <div className='flex flex-row justify-between -mt-16 md:-mt-20'>
                <div></div>
                <div className='w-full md:w-[800px]'>
                    <HalvingAnimate></HalvingAnimate>
                </div>
                <div></div>
            </div>
        </div>
        <div className='flex flex-col bg-[#F4EFFF]'>
            <CKBTipSummary blockNumber={tipHeader?.latestBlock}
                epoch={tipHeader?.epoch}
                halvingEpoch={data ? getNextHalvingEpoch(data.curEpoch.number) : NaN}
                halvingDate={data?.estimatedHalvingTime} >
            </CKBTipSummary>

            <div className='flex flex-col py-5 px-3 md:px-5'>
                <div className='flex mb-16'>
                    <span className='grow text-[20px] md:text-[30px] font-bold'>Block Chain Progress</span>
                    <span className='flex items-center'>What's epoch?</span>
                </div>
                <div className='flex mb-5 gap-1 md:gap-6'>
                    <div className='flex flex-col w-[100px] text-center gap-2'>
                        <span className='text-sm whitespace-nowrap'>Genesis Epoch</span>
                        <span className='text-center bg-white rounded-full text-[#733DFF] font-bold'># 0</span>
                        <span className='text-[#999999] text-sm text-center'>2019/11/16</span>
                    </div>
                    <div className='flex grow items-center'>
                        <div className="w-[1px] h-12 border-dashed border-r border-black ml-2" />
                        <div className='grow'>
                            <BlockchainProgressBar className='grow'
                                epoch={tipHeader?.epoch} >
                            </BlockchainProgressBar>
                        </div>
                        <div className="w-[1px] h-12 border-dashed border-l border-black mr-2" />
                    </div>

                    <div className='flex flex-col w-[100px] text-center gap-2'>
                        <span className='text-sm whitespace-nowrap'>Halving Epoch</span>
                        <span className='text-center bg-white rounded-full text-[#733DFF] font-bold'># {data ? getNextHalvingEpoch(data.curEpoch.number) : '----'}</span>
                        <span className='text-[#999999] text-sm text-center'>{data ? new Date(data.estimatedHalvingTime).toLocaleDateString() : 'YYYY-MM-DD'}</span>
                    </div>
                </div>

            </div>
        </div>

    </div>
    )
}

export default HalvingContainer