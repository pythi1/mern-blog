import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa'

export default function Comment({ comment, onlike }) {

    const [user, setuser] = useState({});

    // console.log(user);

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
                    <span className='font-bold mr-1 text-sm truncate' > <Link to={`/dashboard?tab=profile`} > {user ? `@${user.username} ` : 'anonymous user'} </Link>  </span>
                    <span className='text-gray-500 text-xs ' > {moment(comment.createdAt).fromNow()} </span>
                </div>
                <p className='text-gray-500 pb-2' >{comment.content}</p>

                <div className='flex items-center pt-2 text-xs gap-3' >
                    <button
                        type='button'
                        className={`text-gray-400 hover:text-blue-500 ${user && comment.likes.includes(user._id) && '!text-blue-500'}`}
                        onClick={() => onlike(comment._id)}
                    >
                        <FaThumbsUp className='text-sm ' />
                    </button>
                    <p className='text-gray-400' >
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                        }
                    </p>
                </div>

            </div>
        </div>
    )
}
