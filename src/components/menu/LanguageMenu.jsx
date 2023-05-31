import React, { useRef, useState, useEffect } from 'react'

import { changeLanguage, currentLanguage } from '../../utils/i18n'

import LANG_ICON_ZH from '../../assets/images/language-zh.svg'
import LANG_ICON_EN from '../../assets/images/language-en.svg'

import './LanguageMenu.css'
import { useDispatch } from 'react-redux'
import { setLanguage } from '../../redux/reducers/LanguageReducer'

const LanguageMenu = () => {
    const lang_menus_data = [
        { "icon": LANG_ICON_ZH, "key": "zh_CN", "caption": "简体中文" },
        { "icon": LANG_ICON_EN, "key": "en_US", "caption": "English" },
    ]

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const getLanguageMenu = (locale) => {
        let config = {};
        lang_menus_data.forEach(element => {
            if (element.key === locale) {
                config = element;
            }
        });

        return config;
    }

    const renderLanguageItem = (item, index) => (
        <div className="flex items-center px-2 py-1 hover:bg-slate-500 cursor-pointer" key={index} onClick={() => changeLang(item.key)}>
            <img className='h-4 mr-2' src={item.icon}></img>
            <span className='break-keep'>{item.caption}</span>
        </div>)

    const renderChangeLanguageBtn = (lang) => {
        let config = getLanguageMenu(lang);

        let icon = config?.icon ? config.icon : LANG_ICON_EN;

        return (
            <div className='w-9 h-6 cursor-pointer flex items-center px-2 hover:bg-slate-500 rounded-sm' onClick={toggleDropdown}>
                <img className='flex items-center h-5' src={icon}></img>
            </div>
        )
    }

    const changeLang = (lang) => {
        changeLanguage(lang);
        dispatch(setLanguage(lang));
        toggleDropdown();
    }



    return (<div className='flex items-center'>
        <div className="relative" ref={dropdownRef}>
            {renderChangeLanguageBtn(currentLanguage())}
            {isOpen && (
                <div className="absolute right-0 bottom-7 w-max bg-black rounded-md shadow-lg z-10 transition-opacity duration-300 ease-in-out">
                    <div className="flex flex-col py-2 px-2">
                        {
                            lang_menus_data.map((item, index) => {
                                return renderLanguageItem(item, index)
                            })}

                    </div>
                </div>
            )}
        </div>
    </div>
    );
};


export default LanguageMenu
