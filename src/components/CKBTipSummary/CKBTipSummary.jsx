import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryItem from './SummaryItem';
import { FormatLocaleDate } from '../../utils/helper';

const EpochItem = ({ epoch, itemName, isLoading }) => {
    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col items-center'>
                {
                    isLoading ? (<div className='h-[48px] w-14 flex items-center animate-pulse'>
                        <div className="h-6 w-full py-2 rounded-full bg-slate-700" />
                    </div>)
                        : (<div className='flex w-full items-end justify-center gap-2'>
                            <span className='text-[30px] bg-[#D6E3FF] text-[#232325] font-bold rounded-full px-5 py-1'>{epoch.number}</span>
                            <span className='text-sm bg-[#D6E3FF] text-[#232325] font-bold rounded-full px-5 py-1 mb-1'>{epoch.index}/{epoch.length}</span>
                        </div>
                        )
                }
                <span className='text-[#999999] text-sm'>{itemName}</span>
            </div>
        </div>
    )
}

const CKBTipSummary = ({ blockNumber, epoch, halvingEpoch, halvingDate }) => {

    const isLoading = !blockNumber || Number.isNaN(halvingEpoch) || halvingEpoch === 'NaN';
    const [t] = useTranslation();
    //console.log(blockNumber, epoch, halvingEpoch, halvingDate);
    return (
        <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y-reverse border-dashed py-10'>
            <SummaryItem value={blockNumber?.toLocaleString()}
                valueClass='bg-[#D6E3FF] text-[#232325] font-bold rounded-full px-5 py-1'
                itemName={t('halving.latest-block')}
                nameClass='text-[#999999]'
                isLoading={isLoading}>
            </SummaryItem>
            <EpochItem epoch={epoch}
                itemName={t('halving.current-epoch')}
                isLoading={isLoading}>
            </EpochItem>
            <div className='flex justify-center'>
            <SummaryItem value={halvingEpoch}
                valueClass='bg-[#D6E3FF] text-[#232325] font-bold rounded-full px-5 py-1'
                itemName={t('halving.halving-epoch')}
                nameClass='text-[#999999]'
                isLoading={isLoading}>
            </SummaryItem>
            </div>
            <div className='flex justify-center'>
            <SummaryItem value={FormatLocaleDate(halvingDate) /*new Date(halvingDate).toLocaleDateString()*/}
                valueClass='bg-[#D6E3FF] text-[#232325] font-bold rounded-full px-5 py-1'
                itemName={t('halving.halving-date')}
                nameClass='text-[#999999]'
                isLoading={isLoading}>
            </SummaryItem>
            </div>
        </div>
    );
};

export default CKBTipSummary;
