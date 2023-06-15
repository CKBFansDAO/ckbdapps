import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";

const SidebarDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    }

    const closeDrawer = () => {
        setIsOpen(false);
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
            <div className={`fixed z-[999] bg-[#1C1C23] w-64 h-full shadow-lg transform-gpu top-0 left-0 transition-all duration-150 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {/* 侧边栏内容 */}
                <div className="bg-[#1C1C23] h-full">
                    <Sidebar closeDrawer={closeDrawer}></Sidebar>
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