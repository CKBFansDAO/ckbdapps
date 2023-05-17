import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import './sidebar.css'

//import logo from '../../assets/images/logo-full-light.png'
import {ReactComponent as AppLogo}  from '../../assets/images/logo_white_mark.svg';

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import { useTranslation } from 'react-i18next'

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
                if (location.pathname ==="/") {
                    let reRoute = '/home';
                    find = item.route == reRoute;
                }
            }
        

        return find;
    }
    //const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)
    const [t] = useTranslation();

    return (
        
            <div className='sidebar__wapper'>
                <div className="sidebar__logo-wapper">
                    <AppLogo/>
                    {
                        /*
                    
                    <div className='sidebar__logo mr-2'/>
                    <span className="text-white uppercase font-['Zen_Dots']">ckb</span>
                    <span className='text-[#733DFF] uppercase font-["Zen_Dots"]'>dapps</span>
                */}
                </div>
                <div className="sidebar__adv"></div>
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
    )
}

export default Sidebar
