import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

i18n.use(initReactI18next).init({
    resources: {
        en,
        zh,
    },
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
})

export const changeLanguage = (lan) => {
    if (lan.indexOf('zh') !== -1) {
        i18n.changeLanguage('zh')
    } else {
        i18n.changeLanguage('en')
    }

    localStorage.setItem('locale', lan)
}

export const currentLanguage = () => {
    let language = localStorage.getItem('locale') || window.navigator.language.toLowerCase() || 'en';

    if (language.indexOf("zh") !== -1) {
        language = "zh";
    } else if (language.indexOf('en') !== -1) {
        language = "en";
    } else {
        language = "en";
    }

    return language;
}

export default i18n
