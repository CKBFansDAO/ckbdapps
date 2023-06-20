import React from "react";
//import {ReactComponent as AppLogo}  from '../../assets/images/logo_white_mark.svg';
import SidebarDrawer from "../sidebar/sidebarDrawer";
import { Link } from "react-router-dom";

const TopNav = (props) => {

  return (
    <div className="block md:hidden sticky top-0 w-full z-[999] bg-black ">
        <div className="flex p-4">
            {/*<AppLogo></AppLogo>*/}
            <Link to={''}>
              <div className='app-logo w-[200px] h-8'></div>
            </Link>
            <div className="grow"></div>
            <SidebarDrawer/>
        </div>
    </div>
  );
};

export default TopNav;
