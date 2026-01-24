import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.svg';
import LoginOrProfileButton from '../components/LoginOrProfileButton';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef();
    const toggleBtnRef = useRef(); // Ref for the toggle button

    const toggleSidebar = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !toggleBtnRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div>
            {/* Burger Menu Icon / Cross */}
            <button ref={toggleBtnRef} onClick={toggleSidebar} className=" z-50 cursor-pointer">
                {isOpen ? (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                )}
            </button>

            {/* Sidebar */}
            <div ref={sidebarRef} className={`fixed top-0 shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px] left-0 h-full w-[28%] bg-white z-40 pt-20 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out flex-col`}>
                <div className='px-20 py-5 flex flex-col gap-4'>
                    <img src={logo} alt="Leaseon" className="w-[400px] h-auto mb-10" />
                    <LoginOrProfileButton toggleSidebar={toggleSidebar} />
                    <span className='h-[1px] w-full bg-black/5' />
                    <Link to="/" onClick={toggleSidebar}>
                        <button className='text-[2.5rem] font-medium text-slate-900 hover:text-blue-500 w-full text-start hover:opacity-80 transition ease-in duration-100 cursor-pointer'>Forside</button>
                    </Link>
                    <span className='h-[1px] w-full bg-black/5' />
                    <Link to="/all-listings" onClick={toggleSidebar}>
                        <button className='text-[2.5rem] font-medium text-slate-900 hover:text-blue-500 w-full text-start hover:opacity-80 transition ease-in duration-100 cursor-pointer'>Se alle biler</button>
                    </Link>

                    {/* Add more links as needed */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
