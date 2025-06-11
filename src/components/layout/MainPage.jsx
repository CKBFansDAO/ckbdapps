import React, { useState, useRef, useLayoutEffect } from "react";
import Home from "../../pages/Home";
import DappDetail from "../../pages/DappDetail";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useLocation } from 'react-router-dom';
import Ecosystem from '../../pages/Ecosystem';
import Halving from '../../pages/Halving';
import Events from '../../pages/Events';

import Bulletin from '../bulletin/Bulletin'
import Footer from '../footer/Footer'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../TopNav/topNav'

// Scroll position memory and restoration hook for a scrollable container
const scrollPositions = {};
function useScrollRestoration(containerRef) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useLayoutEffect(() => {
    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollPositions[prevPath.current] = containerRef.current.scrollTop;
      }
    };
  }, [containerRef, location.pathname]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      if (scrollPositions[location.pathname] !== undefined) {
        containerRef.current.scrollTop = scrollPositions[location.pathname];
      } else {
        containerRef.current.scrollTop = 0;
      }
    }
    prevPath.current = location.pathname;
  }, [location.pathname, containerRef]);
}

export default function MainPage() {
  const contentRef = useRef(null);
  useScrollRestoration(contentRef);
  const [selectedDapp, setSelectedDapp] = useState(null);
  const location = useLocation();

  return (
    <div className="flex flex-col">
      <div className="sidebar hidden md:block w-0 md:w-[260px] bg-[#1C1C23]">
        <Sidebar />
      </div>
      <div className="layout__content pl-0 md:ml-[260px] flex flex-col items-center overflow-auto" ref={contentRef}>
        <Bulletin />
        <TopNav />
        <div className="flex grow w-full justify-center">
          <div className="bg-[#F8F8F8] flex flex-col w-full">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home onDappSelect={setSelectedDapp} />} />
              <Route path="/ecosystem" element={<Ecosystem />} />
              <Route path="/halving" element={<Halving />} />
              <Route path="/events" element={<Events />} />
              {/* New pages can be added here */}
            </Routes>
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
