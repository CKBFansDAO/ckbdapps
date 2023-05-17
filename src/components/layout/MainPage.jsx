import React from 'react'

import Bulletin from '../bulletin/Bulletin'
import Footer from '../footer/Footer'
import PageRoutes from '../PageRoutes'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../TopNav/topNav'

const MainPage = (props) => {

    console.log(props)
    return (<div className=''>
        {console.log(222)}
        <div className='sidebar w-0 md:w-[260px] bg-black'>
            <Sidebar {...props}/>
        </div>
        <div className="layout__content pl-0 md:pl-[260px] flex flex-col">
            <Bulletin/>
            <TopNav/>
            <div className="p-3 md:p-7 grow bg-[#F8F8F8]">
                <PageRoutes/>
            </div>
            <Footer></Footer>
            <div id="app-message-box" />
        </div>  
    </div>)
}

export default MainPage
