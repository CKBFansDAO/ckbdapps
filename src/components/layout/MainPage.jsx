import React, { useState } from "react";
import Home from "../../pages/Home";
import DappDetail from "../../pages/DappDetail";
import { AnimatePresence, motion } from "framer-motion";

import Bulletin from '../bulletin/Bulletin'
import Footer from '../footer/Footer'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../TopNav/topNav'

export default function MainPage() {
  const [selectedDapp, setSelectedDapp] = useState(null);

  return (
    <div className="flex flex-col">
      <div className="sidebar hidden md:block w-0 md:w-[260px] bg-[#1C1C23]">
        <Sidebar />
      </div>
      <div className="layout__content pl-0 md:ml-[260px] flex flex-col items-center">
        <Bulletin />
        <TopNav />
        <div className="flex grow w-full justify-center">
          <div className="bg-[#F8F8F8] flex flex-col w-full">
            <Home onDappSelect={setSelectedDapp} />
          </div>
        </div>
        <Footer></Footer>
        <div id="app-message-box" />
      </div>
      <AnimatePresence>
        {selectedDapp && (
          <motion.div
            key={selectedDapp}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
          >
            <DappDetail dappId={selectedDapp} onClose={() => setSelectedDapp(null)} />
          </motion.div>
        )}
      </AnimatePresence>
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
