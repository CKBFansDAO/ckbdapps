import React from "react";
import {ReactComponent as AppLogo}  from '../../assets/images/logo_white_mark.svg';
import SidebarDrawer from "../sidebar/sidebarDrawer";

const TopNav = (props) => {

  return (
    <div className="block md:hidden sticky top-0 w-full z-[999] bg-black ">
        <div className="flex p-4">
            <AppLogo></AppLogo>
            <div className="grow"></div>
            <SidebarDrawer/>
        </div>
    </div>
  );
};

export default TopNav;
