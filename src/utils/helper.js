import { UNSAFE_NavigationContext } from 'react-router-dom';
import HalvingConfig from '../assets/JsonData/halving_events.json'
import { currentLanguage } from './i18n';

// The number of epochs per halving. This should never change.
const EPOCHS_PER_HALVING = 8760;

export const HalvingAlertType = {
    HALVING: 'halving',
    HALVED: 'halved',
    NULL: 'null'
};

export function getNextHalvingEpoch(curEpochNumber) {
    return Math.floor(curEpochNumber / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING + EPOCHS_PER_HALVING
}

export function getPrevHalvingEpoch(curEpochNumber) {
    return Math.floor(curEpochNumber / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING;
}

export function timestampToDateString(timestamp) {
    // 根据用户选择的语言设置日期格式
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    // 将Unix时间戳转换为JavaScript日期对象
    const date = new Date(timestamp * 1000);

    // 使用toLocaleString()方法根据语言和选项格式化日期
    const formattedDate = date.toLocaleString(currentLanguage(), options);
}

// Before the halving event, the notification ViewHalvingAlert is displayed, 
// and after the halving event, the dialog CKBHalvedAlert for successful halving is shown. 
// When a user visits the homepage, it checks whether it's before the halving event and if the user has already been notified. 
// If not, the ViewHalvingAlert dialog is displayed. 
// While a user stays on any page, if the halving event occurs during that time, dialog CKBHalvedAlert is shown.
export function checkHalvingAlertType(halvingData) {
    //console.log(halvingData);
    if (!halvingData || !halvingData.curEpoch) {
        console.log('eroror');
        return HalvingAlertType.NULL;
    }

    let nextHalvingEpoch = getNextHalvingEpoch(halvingData.curEpoch.number);
    let halvingAlertFlag = localStorage.getItem(`ckb_halving_notified_before_${nextHalvingEpoch}`);

    // 减半过了的处理
    if (halvingData.prevHalvingTime) {
        if (halvingData.curEpoch.number - halvingData.prevHalvingTime.epoch < 30 * 6) {
            let halvedAlertFlag = localStorage.getItem(`ckb_halvd_notified_after_${halvingData.prevHalvingTime.epoch}`);
            if (halvedAlertFlag === 'true') {
                return HalvingAlertType.NULL;
            }
            else {
                return HalvingAlertType.HALVED;
            }
        }
        else if (nextHalvingEpoch - halvingData.curEpoch.number < 180 * 6) {
            // 减半进入最后半年开始提醒
            if (halvingAlertFlag === 'true') {
                return HalvingAlertType.NULL;
            }
            else {
                return HalvingAlertType.HALVING;
            }
        }
    }
    else {
        // 第一次减半
        if (halvingAlertFlag === 'true') {
            return HalvingAlertType.NULL;
        }
        else {
            return HalvingAlertType.HALVING;
        }
    }
}

export function FormatLocaleDateTime(timestamp) {
    const lang = currentLanguage().replace('_', '-');
    const formattedTime = new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(timestamp);

    //formattedTime = (new Date(timestamp)).toLocaleDateString(lang, { weekday:"long", year:"numeric", month:"long", day:"numeric"});
    return formattedTime;
}

export function FormatLocaleDate(timestamp) {
    const lang = currentLanguage().replace('_', '-');
    const formattedTime = new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(timestamp);

    //const date = (new Date(timestamp)).toLocaleDateString(lang, {year:"numeric", month:"long", day:"numeric"});
    return formattedTime;
}

export function numberFormatter(num, digits) {
    if (!num) {
        return '-';
    }

    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    
    let locale = currentLanguage();

    // 中文的习惯，使用万，百万。。
    if (locale.indexOf("zh") !== -1) {
        si = [
            { value: 1, symbol: "" },
            { value: 1E4, symbol: "万" },
            { value: 99999900, symbol: "亿" }
          ];
    }

    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }

    let res = (num / si[i].value).toFixed(digits).replace(rx, "$1");
    if (digits === 2 && res < 0.01) {
        res = '<0.01'
    }
    
    return res + si[i].symbol;
}

export function getTimeZoneOffset() {
    const date = new Date();
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetSign = offsetMinutes < 0 ? "+" : "-";
    const offsetMinutesFormatted = (Math.abs(offsetMinutes) % 60).toString().padStart(2, "0");
    const timeZoneOffset = `GMT${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutesFormatted}`;
    
    return timeZoneOffset;
  }