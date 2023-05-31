import React, { useEffect } from 'react'

import { Link, useLocation } from 'react-router-dom'

import './sidebar.css'

//import logo from '../../assets/images/logo-full-light.png'
import { ReactComponent as AppLogo } from '../../assets/images/logo_white_mark.svg';

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import { useTranslation } from 'react-i18next'
import LanguageMenu from '../menu/LanguageMenu';

const SidebarItem = props => {

    const active = props.active ? 'active' : ''

    return (
        <div className="sidebar__item my-1">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = props => {
    const location = useLocation()
    console.log(location);

    const isActiveItem = (item) => {
        let find = item.route === location.pathname;
        if (!find) {
            if (location.pathname === "/") {
                let reRoute = '/home';
                find = item.route == reRoute;
            }
        }

        return find;
    }

    useEffect(() => {

    }, [location]);

    //const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)
    const [t] = useTranslation();

    return (

        <div className='sidebar__wapper flex flex-col h-full  text-white'>
            <div className='hidden md:block h-10'></div>
            <div className="sidebar__logo-wapper">
                <AppLogo />
            </div>
            <div className="sidebar__adv"></div>
            <div className='flex flex-col grow'>
                {
                    sidebar_items.map((item, index) => (
                        <Link to={item.route} key={`${index}-${item.route}`}>
                            <SidebarItem
                                title={t(item.display_name)}
                                icon={item.icon}
                                active={isActiveItem(item)}
                            />
                        </Link>
                    ))
                }
            </div>
            <div className='flex w-full p-5'>
                <a className='w-6 h-6 rounded-full bg-[#4F4F63] mr-2 icon-shadow hover:shadow-lg hover:bg-[#ddd] active:bg-emerald-500 focus:outline-none'
                    href={'hhd'} rel="noopener noreferrer" target="_blank">
                    <i className="h-6 pl-1 pt-1 text-[16px] text-[#1EA1F1] flex justify-center items-center fa-brands fa-twitter"></i>
                </a>
                <a className='w-6 h-6 rounded-full bg-[#4F4F63] mr-2 icon-shadow hover:shadow-lg hover:bg-[#ddd] active:bg-emerald-500 focus:outline-none'
                    href={'hhd'} rel="noopener noreferrer" target="_blank">
                    <i className="h-6 pl-0.5 pt-1 text-[15px] text-[#5765F2] flex justify-center items-center fa-brands fa-discord"></i>
                </a>
                <a className='w-6 h-6 rounded-full mr-2 icon-shadow hover:shadow-lg  active:bg-emerald-500 focus:outline-none'
                    href={'hhd'} rel="noopener noreferrer" target="_blank">
                    <i className="h-6 text-[24px] text-[#249AE6] flex justify-center hover:text-[#ddd] items-center fa-brands fa-telegram"></i>
                </a>   
                <div className='grow'></div>
                <LanguageMenu></LanguageMenu>
            </div>
           
        </div>
    )
}

export default Sidebar
