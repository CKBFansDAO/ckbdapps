import React, { useEffect } from 'react'

import { Link, useLocation } from 'react-router-dom'

import './sidebar.css'

//import { ReactComponent as AppLogo } from '../../assets/images/logo_white_mark.svg';

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import community_link from '../../assets/JsonData/hyper_link.json'

import { useTranslation } from 'react-i18next'
import LanguageMenu from '../menu/LanguageMenu';
import { currentLanguage } from '../../utils/i18n';

const SidebarItem = props => {

    const active = props.active ? 'active' : ''

    const renderBadge = (badge) => {
        if (badge.type === 'icon' && badge.icon) {
            return <div className='flex w-full place-content-end'><img className='flex h-5 w-full' src={badge.icon}></img></div>
        }
        else if (badge.type === 'text') {
            return <span className='absolute flex items-center h-[14px] text-center text-[10px] px-2 py-1 rounded-full bg-[#EB5757] text-[#FFF] -mt-[22px] -ml-8'>{badge.text}</span>
        }
        else if (badge.type === 'dot') {
            return <span className='absolute w-[10px] h-[10px] rounded-full bg-[#EB5757] -mt-5'></span>
        }

        return <></>
    }

    return (
        <div className="sidebar__item my-1">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
                <div className='grow'></div>
                {props.badge ? (<div className=''>
                    {renderBadge(props.badge)}
                </div>) : ('')}
            </div>
        </div>
    )
}

const Sidebar = props => {
    const location = useLocation()
    //console.log(location);

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

    const itemClicked = () => {
        if (props.closeDrawer) {
            props.closeDrawer()
        }
    }

    return (

        <div className='sidebar__wapper flex flex-col h-full  text-white'>
            <div className='hidden md:block h-10'></div>
            <div className="sidebar__logo-wapper px-[25px]">
                {/*<AppLogo />*/}
                <div className='app-logo w-full h-10'></div>
            </div>
            <div className="sidebar__adv"></div>
            <div className='flex flex-col grow'>
                {
                    sidebar_items.map((item, index) => (
                        <Link to={item.route} key={`${index}-${item.route}`} onClick={itemClicked}>
                            <SidebarItem
                                title={t(item.display_name)}
                                icon={item.icon}
                                active={isActiveItem(item)}
                                badge={item.badge}
                            />
                        </Link>
                    ))
                }
                <a href="https://app.ckbccc.com/" target='_blank' rel="noopener noreferrer" >
                    <div className="sidebar__item my-1">
                        <div className={`sidebar__item-inner`}>
                            <i className="fa-solid fa-burger fa-sm sidebar_mr_10px"></i>
                            <span className='grow'>Cook CKB（CCC）</span>
                            <i className="fa-solid fa-up-right-from-square fa-sm"></i>
                        </div>
                    </div>
                </a>
            </div>
            <div className='flex w-full p-5'>
                <a className='w-6 h-6 flex justify-center items-center rounded-full bg-[#4F4F63] mr-2 icon-shadow hover:shadow-lg hover:bg-[#ddd] active:bg-emerald-500 focus:outline-none'
                    href={community_link.community[currentLanguage()].twitter.link} rel="noopener noreferrer" target="_blank">
                    <i className="fa-sm  text-[#1EA1F1] flex justify-center items-center fa-brands fa-twitter"></i>
                </a>
                <a className='w-6 h-6 flex justify-center items-center rounded-full bg-[#4F4F63] mr-2 icon-shadow hover:shadow-lg hover:bg-[#ddd] active:bg-emerald-500 focus:outline-none'
                    href={community_link.community[currentLanguage()].discord.link} rel="noopener noreferrer" target="_blank">
                    <i className="fa-sm  text-[#5765F2] fa-brands fa-discord"></i>
                </a>
                <a className='w-6 h-6 flex justify-center items-center rounded-full mr-2 icon-shadow hover:shadow-lg  active:bg-emerald-500 focus:outline-none'
                    href={community_link.community[currentLanguage()].telegram.link} rel="noopener noreferrer" target="_blank">
                    <i className="fa-xl  text-[#249AE6] hover:text-[#ddd] fa-brands fa-telegram"></i>
                </a>
                <div className='grow'></div>
                <LanguageMenu></LanguageMenu>
            </div>

        </div>
    )
}

export default Sidebar
