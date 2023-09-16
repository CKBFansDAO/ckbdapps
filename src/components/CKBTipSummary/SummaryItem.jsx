import React from 'react';
import { useTranslation } from 'react-i18next';

const SummaryItem = ({ value, itemName, isLoading }) => {

    return (
        <div className='flex pl-4'>
            <div className='flex flex-col mb-2'>
                {
                    isLoading ? (<div className='h-[48px] w-14 flex items-center animate-pulse'>
                        <div className="h-6 w-full py-2 rounded-full bg-slate-700" />
                    </div>)
                        : (<span className='text-[30px] text-[#FFF] font-bold'>{value}</span>)
                }

                <span className='text-[#00DF9B] text-sm'>{itemName}</span>
            </div>
        </div>
    )
}

export default SummaryItem;