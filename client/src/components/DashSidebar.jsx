import React, { Profiler } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/Userslice';

function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState("");
    const  dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        console.log(tabFromUrl);
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignOut = async () => {
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST',
          });
      
          const data = await res.json();
          if(!res.ok){
            console.log(data.message);
          }
          else{
            dispatch(signOutSuccess());
          }
    
        } catch (error) {
            console.log(error);
        }
      }


    return (

        <Sidebar className='w-full md:w-56' >
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item 
                        active={tab === "profile"} 
                        icon={HiUser} 
                        label={"User"} 
                        labelColor="dark"
                        as="div"
                         >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item 
                    icon={HiArrowSmRight} 
                    labelColor="dark" 
                    className="cursor-pointer" 
                    onClick={handleSignOut}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>

        </Sidebar>

    )
}

export default DashSidebar;