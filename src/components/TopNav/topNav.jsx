import React, { useState } from "react";
import {ReactComponent as AppLogo}  from '../../assets/images/logo_white_mark.svg';
import SidebarDrawer from "../sidebar/sidebarDrawer";

const TopNav = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 100);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div className="block md:hidden sticky top-0 w-full z-[999] bg-[#1C1C23] ">
        <div className="flex p-4">
            <AppLogo></AppLogo>
            <div className="grow"></div>
            <SidebarDrawer/>
        </div>
    </div>
  );
};

export default TopNav;
