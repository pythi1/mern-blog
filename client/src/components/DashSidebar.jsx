import React, { Profiler } from 'react';
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi';
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/Userslice';


function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch();

    const { currentuser } = useSelector(state => state.user);

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
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                dispatch(signOutSuccess());
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (

        <Sidebar className='w-full md:w-56' >
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1' >
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === "profile"}
                            icon={HiUser}
                            label={currentuser.isAdmin ? "Admin" : "user"}
                            labelColor="dark"
                            as="div"
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>


                    {
                        currentuser.isAdmin && (

                            <Link to='/dashboard?tab=posts' >
                                <Sidebar.Item
                                    active={tab === 'posts'}
                                    icon={HiDocumentText}
                                    as='div'
                                >

                                    Posts

                                </Sidebar.Item>
                            </Link>
                        )
                    }

                    {
                        currentuser.isAdmin && (

                            <Link to='/dashboard?tab=users' >
                                <Sidebar.Item
                                    active={tab === 'users'}
                                    icon={HiOutlineUserGroup}
                                    as='div'
                                >

                                    users

                                </Sidebar.Item>
                            </Link>
                        )
                    }


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