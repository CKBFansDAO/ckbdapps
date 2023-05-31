// languageReducer.js

import { currentLanguage } from "../../utils/i18n";

const initialState = {
    language: currentLanguage(), // 默认语言
};

const LanguageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_LANGUAGE':
            return {
                ...state,
                language: action.payload,
            };
        default:
            return state;
    }
};

export const setLanguage = (language) => ({
    type: 'CHANGE_LANGUAGE',
    payload: language,
});

export default LanguageReducer;