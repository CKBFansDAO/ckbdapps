import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../../hooks/useCountdown';
import { useTranslation } from 'react-i18next';
import HalvingFireworks from '../fireworks/HalvingFireworks';


const ShowCounter = ({ days, hours, minutes, seconds }) => {

  const [t] = useTranslation();

  return (
    <div className="flex flex-row justify-evenly">
        <DateTimeDisplay value={days} typeName={t('halving.days')} isDanger={days <= 3} />
        <DateTimeDisplay value={hours.toString().padStart(2, '0')} typeName={t('halving.hours')} isDanger={false} />
        <DateTimeDisplay value={minutes.toString().padStart(2, '0')} typeName={t('halving.minutes')} isDanger={false} />
        <DateTimeDisplay value={seconds.toString().padStart(2, '0')} typeName={t('halving.seconds')} isDanger={false} />
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <div>
        <HalvingFireworks />
        <ShowCounter
        days={0}
        hours={0}
        minutes={0}
        seconds={0}
      />
      </div>
    );
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
