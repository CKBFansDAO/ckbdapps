import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";

const SidebarDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  const sidebarRef = useRef(); 

  function handleClickOutside(event) {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex " ref={sidebarRef}>
      <div className={`fixed z-[999] bg-black w-64 h-full shadow-lg transform top-0 left-0 transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* 侧边栏内容 */}
        <div className="bg-black h-full -mt-[40px]">
          <Sidebar></Sidebar>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <i className="fa-solid fa-bars text-[#733DFF] text-[30px]"
            onClick={toggleDrawer}
        ></i>
      </div>
    </div>
  );
}

export default SidebarDrawer;