import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { changeLanguage, currentLanguage } from '../../utils/i18n';
import { setLanguage } from '../../redux/reducers/LanguageReducer';
import { Globe } from "lucide-react";
//import {ReactComponent as AppLogo}  from '../../assets/images/logo_white_mark.svg';
import SidebarDrawer from "../sidebar/sidebarDrawer";
import { Link } from "react-router-dom";

const TopNav = (props) => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.langReducer.language);

  const handleLanguageChange = () => {
    const newLanguage = language === 'en_US' ? 'zh_CN' : 'en_US';
    changeLanguage(newLanguage);
    dispatch(setLanguage(newLanguage));
  };

  return (
    <div className="block md:hidden sticky top-0 w-full z-[999] bg-black ">
        <div className="flex p-4">
            {/*<AppLogo></AppLogo>*/}
            <Link to={''}>
              <div className='app-logo w-[200px] h-8'></div>
            </Link>
            <div className="grow"></div>
            
            {/* Language Toggle Button */}
            <button
              onClick={handleLanguageChange}
              className="flex items-center gap-2 px-3 py-2 mr-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'en_US' ? 'EN' : '中文'}
              </span>
            </button>
            
            <SidebarDrawer/>
        </div>
    </div>
  );
};

export default TopNav;
