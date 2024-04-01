import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Textarea } from 'flowbite-react';

export default function CommentSection({ postId }) {

    const { currentuser } = useSelector(state => state.user);
    const [comment, setcomment] = useState('');
    const [commentError, setcommentError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.length > 200) {
            return;
        }

        try {

            const res = await fetch(`/api/comment/create`, {
                method: "POST",
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment, postId, userId: currentuser._id }),
            });

            console.log("comment:", comment, postId, currentuser._id);

            const data = await res.json();

            if (res.ok) {
                setcomment('');
                setcommentError(null);
            }
        } catch (error) {
            setcommentError(error.message);
        }


    }


    return (
        <div className='max-w-2xl mx-auto w-full p-3' >
            {currentuser
                ?
                <div className=' flex items-center gap-1 my-5 text-gray-500 text-sm' >
                    <p>singed in as :</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentuser.profilePicture} alt='user' />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-500 hover:underline' >
                        @{currentuser.username}
                    </Link>
                </div>
                :
                <div className='text-sm text-teal-500 my-5 flex gap-2' >
                    You must signed in to comment.
                    <Link to={'/signin'} className='text-blue-500 hover:underline' >
                        Sign In
                    </Link>
                </div>
            }

            {currentuser && (
                <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit} >
                    <Textarea
                        placeholder='Add a comment'
                        rows='3'
                        maxLength='200'
                        onChange={(e) => setcomment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs' > {200 - comment.length} char remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit' >Submit</Button>
                    </div>

                    {commentError && <Alert color='failure' className='mt-5' >{commentError}</Alert>}

                </form>


            )}

        </div>
    )
}
