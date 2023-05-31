import LanguageReducer from "./LanguageReducer"
import ThemeReducer from "./ThemeReducer"

import { combineReducers } from "redux"

const rootReducer = combineReducers({
    themeReducer: ThemeReducer,
    langReducer: LanguageReducer,
});
export default rootReducer