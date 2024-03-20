import React from 'react';
import { useSelector } from "react-redux";


function ThemeProvider(props) {
    const { theme } = useSelector((state) => state.theme)
    return (

        <div className={theme} >
            <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen' >
                {props.children}
            </div>
        </div>
    )
};

export default ThemeProvider;