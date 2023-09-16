import React from 'react';

const SummaryItem = ({ value, itemName, valueClass, nameClass, isLoading }) => {

    return (
        <div className='flex pl-4'>
            <div className='flex flex-col mb-2'>
                {
                    isLoading ? (<div className='h-[48px] w-14 flex items-center animate-pulse'>
                        <div className="h-6 w-full py-2 rounded-full bg-slate-700" />
                    </div>)
                        : (<span className={`text-[30px] ${valueClass}`}>{value}</span>)
                }

                <span className={`text-sm ${nameClass}`}>{itemName}</span>
            </div>
        </div>
    )
}

export default SummaryItem;