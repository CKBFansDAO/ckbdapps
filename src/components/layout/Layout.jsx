import React, {useEffect} from 'react'

import { changeLanguage, currentLanguage, i18n } from '../../utils/i18n'


import './layout.css'

import Sidebar from '../sidebar/Sidebar'
import Bulletin from '../bulletin/Bulletin'
import PageRoutes from '../PageRoutes'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import ThemeAction from '../../redux/actions/ThemeAction'
import Footer from '../footer/Footer'
import MainPage from './MainPage'


const Layout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch()

    const initLanguage = () => {
        const lan = currentLanguage();
        changeLanguage(lan);
    }

    useEffect(() => {
        console.log(111)
        let themeClass = localStorage.getItem('themeMode')
        if (!themeClass) {
            themeClass = 'theme-mode-dark';
            localStorage.setItem('themeMode', themeClass)
        }

        let colorClass = localStorage.getItem('colorMode')
        if (!colorClass) {
            colorClass = 'theme-color-blue';
            localStorage.setItem('colorMode', colorClass)
        }

        if (themeClass.search('dark') >= 0) {
            document.documentElement.classList.add('dark')
        }
        else {
            document.documentElement.classList.remove('dark')
        }

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))

        initLanguage();

    }, [dispatch])

    return (<BrowserRouter>
                <Routes>
                    <Route path='*' element={<MainPage />}/>
                </Routes>
            </BrowserRouter>
        /*
        <BrowserRouter>
            <Routes>
                <Route render={(props) => (
                    <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                        <Sidebar {...props}/>
                        <div className="layout__content">
                            <Bulletin/>
                            <div className="p-3 md:p-7">
                                <PageRoutes/>
                            </div>
                            <Footer></Footer>
                            <div id="app-message-box" />
                        </div>
                        
                    </div>
                )}/>
            </Routes>
        </BrowserRouter>*/
    )
}

export default Layout
