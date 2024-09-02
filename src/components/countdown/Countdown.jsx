import React, { useState, useEffect } from 'react';
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

const Countdown = ({ targetDate }) => {
  const [t] = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        let years = target.getFullYear() - now.getFullYear();
        let months = target.getMonth() - now.getMonth();
        let days = target.getDate() - now.getDate();
        let hours = target.getHours() - now.getHours();
        let minutes = target.getMinutes() - now.getMinutes();
        let seconds = target.getSeconds() - now.getSeconds();

        if (seconds < 0) {
          seconds += 60;
          minutes--;
        }
        if (minutes < 0) {
          minutes += 60;
          hours--;
        }
        if (hours < 0) {
          hours += 24;
          days--;
        }
        if (days < 0) {
          const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
          days += daysInLastMonth;
          months--;
        }
        if (months < 0) {
          months += 12;
          years--;
        }

        setTimeLeft({ years, months, days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-row justify-evenly">
        {timeLeft.years > 0 && <DateTimeDisplay value={timeLeft.years} typeName={t('halving.years')} />}
        {timeLeft.months > 0 && <DateTimeDisplay value={timeLeft.months} typeName={t('halving.months')} />}
        <DateTimeDisplay value={timeLeft.days} typeName={t('halving.days')}/>
        <DateTimeDisplay value={timeLeft.hours.toString().padStart(2, '0')} typeName={t('halving.hours')} isDanger={false} />
    </div>
    
  );
};

export default Countdown;