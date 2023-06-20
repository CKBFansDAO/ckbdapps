import React from 'react'

import Bulletin from '../bulletin/Bulletin'
import Footer from '../footer/Footer'
import PageRoutes from '../PageRoutes'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../TopNav/topNav'

const MainPage = (props) => {

  return (
    <div className="flex flex-col">
      <div className="sidebar hidden md:block w-0 md:w-[260px] bg-[#1C1C23]">
        <Sidebar {...props} />
      </div>
      <div className="layout__content pl-0 md:ml-[260px] flex flex-col items-center">
        <Bulletin />
        <TopNav />
        <div className="flex grow w-full justify-center">
          <div className="bg-[#F8F8F8] flex flex-col w-full">
            <PageRoutes />
          </div>
        </div>
        <Footer></Footer>
        <div id="app-message-box" />
      </div>
    </div>
    /*<div className="flex flex-col">
      <div className="sidebar hidden md:block w-0 md:w-[260px] bg-[#1C1C23]">
        <Sidebar {...props} />
      </div>
      <div className="layout__content pl-0 md:ml-[260px] flex flex-col items-center">
        <Bulletin />
        <TopNav />
        <div className="flex max-w-6xl grow w-full">
          <div className="p-3 md:p-7 bg-[#F8F8F8] w-full flex flex-col place-content-center">
            <PageRoutes />
          </div>
        </div>
        <Footer></Footer>
        <div id="app-message-box" />
      </div>
    </div>*/
  )
}

export default MainPage
