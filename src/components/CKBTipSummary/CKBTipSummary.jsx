import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryItem from './SummaryItem';
import { FormatLocaleDate } from '../../utils/helper';

const EpochItem = ({ epoch, itemName, isLoading }) => {
    return (
        <div className='flex pl-4 '>
            <div className='flex flex-col '>
                {
                    isLoading ? (<div className='h-[48px] w-14 flex items-center animate-pulse'>
                        <div className="h-6 w-full py-2 rounded-full bg-slate-700" />
                    </div>)
                        : (<div className='flex w-full'>
                            <span className='text-[30px]'>{epoch.number}</span>
                            <span className='text-sm ml-2 flex mb-2 items-end'>{epoch.index}/{epoch.length}</span>
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
    console.log(isLoading);
    const [t] = useTranslation();
    console.log(blockNumber, epoch, halvingEpoch, halvingDate);
    return (
        <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y-reverse border-b-[1px] border-dashed py-10'>
            <SummaryItem value={blockNumber?.toLocaleString()}
                itemName={t('halving.latest-block')}
                isLoading={isLoading}>
            </SummaryItem>
            <EpochItem epoch={epoch}
                itemName={t('halving.current-epoch')}
                isLoading={isLoading}>
            </EpochItem>
            <div className='flex md:justify-end md:pr-4'>
            <SummaryItem value={halvingEpoch}
                itemName={t('halving.halving-epoch')}
                isLoading={isLoading}>
            </SummaryItem>
            </div>
            <div className='flex md:justify-end md:pr-4'>
            <SummaryItem value={FormatLocaleDate(halvingDate) /*new Date(halvingDate).toLocaleDateString()*/}
                itemName={t('halving.halving-date')}
                isLoading={isLoading}>
            </SummaryItem>
            </div>
        </div>
    );
};

export default CKBTipSummary;