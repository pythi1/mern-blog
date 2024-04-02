import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function Comment({ comment }) {

    const [user, setuser] = useState({});

    console.log(user);

    useEffect(() => {
        const getuser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();

                if (res.ok) {
                    setuser(data);
                }

            } catch (error) {
                console.log(error.message);
            }
        };

        getuser();

    }, [comment])
    return (
        <div className='flex p-4 border-b dark:border-gray-500 text-sm' >

            <div className='flex shrink-0 mr-3' >
                <img className='w-10 h-10 rounded-full mt-5 bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>

            <div className='flex-1' >
                <div className='flex items-center mb-1 ' >
                    <span className='font-bold mr-1 text-sm truncate text-blue-300' > <Link to={`/dashboard?tab=profile`} > {user ? `@${user.username} ` : 'anonymous user'} </Link>  </span>
                    <span className='text-gray-500 text-xs ' > {moment(comment.createdAt).fromNow()} </span>
                </div>
                <p className='text-gray-500 pb-2' >{comment.content}</p>
            </div>
        </div>
    )
}
