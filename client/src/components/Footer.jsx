import React from 'react';
import { Footer } from "flowbite-react"
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaThreads, FaTwitter } from 'react-icons/fa6';

function FooterComponent() {
    return (
        <Footer container className='border border-t-8 border-teal-500' >
            <div className='w-full max-w-7xl mx-auto ' >
                <div className='grid w-full justify-between sm:flex md:grid-cols-1' >
                    <div className='mt-5 ' >
                        <Link to="/home" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white' >
                            <span className='px-5 py-1 bg-gradient-to-r from-purple-500 via-red-600 to-pink-500 rounded-lg font-bold text-white' >My</span>
                            Blog
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6' >
                        <div>
                            <Footer.Title title='About' />

                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://100sprojects.com'
                                    target='_blank'
                                    rela="noopener noreferrer"

                                >
                                    100 js Projects

                                </Footer.Link>
                                <Footer.Link
                                    href='https://100sprojects.com'
                                    target='_blank'
                                    rela="noopener noreferrer"

                                >
                                    Badhiya Blog

                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>

                            <Footer.Title title='follow us' />

                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://www.github.com'
                                    target='_blank'
                                    rela="noopener noreferrer"

                                >
                                    Github

                                </Footer.Link>
                                <Footer.Link
                                    href='https://www.linkedin.com/pramod-jangra'
                                    target='_blank'
                                    rela="noopener noreferrer"

                                >
                                    linkedIn

                                </Footer.Link>
                            </Footer.LinkGroup>

                        </div>

                        <div>

                            <Footer.Title title='Legal' />

                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='#'

                                >
                                    Privacy policy

                                </Footer.Link>
                                <Footer.Link
                                    href='#' 

                                >
                                    Terms & condition

                                </Footer.Link>
                            </Footer.LinkGroup>

                        </div>

                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex sm:items-center sm:justify-between' >
                    <Footer.Copyright 
                    href='#' 
                    by="Pramod's blog"
                    year={new Date().getFullYear()}
                    />
                    <div className='flex gap-8 justify-center mt-5 sm:mt-0 ' >
                        <Footer.Icon href='#' icon={FaLinkedin}/>
                        <Footer.Icon href='#' icon={FaInstagram}/>
                        <Footer.Icon href='#' icon={FaFacebook}/>
                        <Footer.Icon href='#' icon={FaTwitter}/>
                        <Footer.Icon href='#' icon={FaThreads}/>
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterComponent;