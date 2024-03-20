import React from 'react';
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from '../redux/theme/ThemeSlice';


function Header() {

    const path = useLocation().pathname;
    const { currentuser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const {theme} = useSelector((state) => state.theme);

    return (
        <Navbar className='border-b-2' >
            <Link to="/home" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white' >
                <span className='px-5 py-1 bg-gradient-to-r from-purple-500 via-red-600 to-pink-500 rounded-lg font-bold text-white' >My</span>
                Blog
            </Link>

            <form>
                <TextInput
                    type='text'
                    placeholder='search'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>

            <Button className='w-12 h-10 lg:hidden border ' color='grey' pill >
                <AiOutlineSearch />
            </Button>

            <div className='flex gap-2 md:order-2'>
                <Button
                    className='w-12 h-10 hidden sm:inline'
                    color='grey'
                    pill
                   onClick={() => dispatch(toggleTheme())}
                >
                    {theme === "light" ? <FaMoon /> : <FaSun /> }
                     
                </Button>

                {
                    currentuser
                        ?
                        (<Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt='user'
                                    img={currentuser.profilePicture}
                                    rounded
                                />
                            } >
                            <Dropdown.Header>
                                <span className='block text-sm' >@{currentuser.username}</span>
                                <span className='block text-sm font-medium truncate' >{currentuser.email}</span>
                            </Dropdown.Header>

                            <Link to={"/dashboard?tab=profile"} >
                                <Dropdown.Item>profile</Dropdown.Item>
                            </Link>

                            <Dropdown.Divider />
                            <Dropdown.Item>Sign Out</Dropdown.Item>

                        </Dropdown>)
                        :

                        <Link to="/signup" >
                            <Button gradientDuoTone="purpleToBlue" outline >
                                SignUp
                            </Button>
                        </Link>

                }



                <Navbar.Toggle />


            </div>

            <Navbar.Collapse >
                <Navbar.Link active={path == "/home"} as={'div'} >
                    <Link to="/home" >
                        Home
                    </Link>

                </Navbar.Link>

                <Navbar.Link active={path == "/about"} as={'div'} >
                    <Link to="/about" >
                        About
                    </Link>

                </Navbar.Link>

                <Navbar.Link active={path == "/projects"} as={'div'} >
                    <Link to="/projects" >
                        Projects
                    </Link>

                </Navbar.Link>


            </Navbar.Collapse>

        </Navbar>
    )
}

export default Header;