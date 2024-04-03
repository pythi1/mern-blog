import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa'
import { Button, Textarea } from 'flowbite-react'

export default function Comment({ comment, onlike, onEdit, onDelete }) {

    const [user, setuser] = useState({});
    const [isEditing, setisEditing] = useState(false);
    const [editedContent, seteditedContent] = useState(comment.content);

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

    }, [comment]);


    const handleEditComment = async (e) => {
        // e.preventDefaukt();

        setisEditing(true);
        seteditedContent(comment.content);

    };

    const handleSave = async () => {

        try {

            const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })

            });

            if (res.ok) {
                setisEditing(false);
                onEdit(comment, editedContent);
            }

        } catch (error) {
            console.log(error);
        }

    }


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

                {isEditing ? (
                    <>
                        <Textarea
                            className='mb-2'

                            value={editedContent}
                            onChange={(e) => seteditedContent(e.target.value)}
                        />
                        <div className='flex justify-end gap-2 text-xs' >

                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                onClick={handleSave}
                            >
                                Save
                            </Button>

                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                outline
                                onClick={() => setisEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (

                    <>
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
                            {
                                user && (user._id === comment.userId || user.isAdmin) && (
                                    <>
                                        <button
                                            type='button'
                                            className='text-gray-400 hover:text-blue-500'
                                            onClick={handleEditComment}
                                        >
                                            edit
                                        </button>

                                        <button
                                            type='button'
                                            className='text-gray-400 hover:text-red-500'
                                            onClick={() => onDelete(comment._id)}
                                        >
                                            delete
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}
