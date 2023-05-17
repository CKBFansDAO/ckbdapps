import React from 'react';

const DateTimeDisplay = ({ value, typeName, isDanger }) => {
  
  const isLoading = Number.isNaN(value) || value === 'NaN';
  
  return (
    <div className='flex flex-col w-[100px] md:w-[170px] rounded-xl shadow-[0_2px_10px_0_rgba(0,0,0,0.5)] text-center'>
      <div className='flex place-content-center rounded-t-xl bg-[#987AD9]'>
        {
          isLoading ? (<div className='h-[60px] w-14 md:h-[120px] flex items-center text-[24px] md:text-[48px] animate-pulse'>
            <div className="h-6 w-full py-2 rounded-full bg-slate-700" />
          </div>) : (<span className='h-[60px] md:h-[120px] flex items-center text-[24px] md:text-[48px] text-white font-["Zen_Dots"]'>
            {value}
          </span>)
        }
      </div>

      <div className='flex place-content-center rounded-b-xl bg-white'>
        <span className='h-[40px] md:h-[50px] flex items-center uppercase font-semibold'>{typeName}</span>
      </div>
    </div>
  );
};

export default DateTimeDisplay;
