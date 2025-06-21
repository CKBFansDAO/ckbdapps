import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en_US from '../locales/en-US.json'
import zh_CN from '../locales/zh-CN.json'

i18n.use(initReactI18next).init({
    resources: {
        en_US,
        zh_CN,
    },
    fallbackLng: 'en_US',
    interpolation: {
        escapeValue: false,
    },
})

export const changeLanguage = (lan) => {
  /*  if (lan.indexOf('zh') !== -1) {
        i18n.changeLanguage('zh_CN')
    } else {
        i18n.changeLanguage('en_US')
    }*/

    i18n.changeLanguage(lan);
    localStorage.setItem('locale', lan)
}

export const currentLanguage = () => {
    let language = localStorage.getItem('locale') || window.navigator.language.toLowerCase() || 'en';
    if (!language || language.length === 0) {
        language = 'en_US';
    }

    //todo，新增语言的时候要重新判断

    if (language.indexOf("zh") !== -1) {
        language = "zh_CN";
    } else if (language.indexOf('en') !== -1) {
        language = "en_US";
    } else {
        language = "en_US";
    }

    return language;
}

// 新增函数：根据当前语言获取多语言文本
export const getLocalizedText = (textObj, language = null) => {
    if (!textObj) return '';
    
    // 如果是字符串，直接返回（向后兼容）
    if (typeof textObj === 'string') return textObj;
    
    // 如果是对象，根据当前语言返回相应文本
    const lang = language || currentLanguage();
    if (lang === 'zh_CN') {
        return textObj.ch || textObj.en || '';
    } else {
        return textObj.en || textObj.ch || '';
    }
}

export default i18n
