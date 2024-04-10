import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {

    const { currentuser } = useSelector(state => state.user);
    const [Comments, setComments] = useState([]);
    const [showMore, setshowMore] = useState(true);
    const [showModal, setshowModal] = useState(false);
    const [commentIdToDelete, setcommentIdToDelete] = useState('');

    // console.log(Comments);

    useEffect(() => {
        const fetchComments = async () => {
            try {

                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();


                if (res.ok) {
                    if (data.comments && data.comments.length !== 0) {
                        setComments(data.comments);
                        if (data.comments.length < 9) {
                            setshowMore(false);
                        }
                    }
                }


            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentuser.isAdmin) {
            fetchComments();
        }

    }, [currentuser._id]);


    const handleShowMoreClick = async () => {
        const startindex = Comments.length;

        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startindex}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.Comments]);
                if (data.Comments.length < 9) {
                    setshowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    const handleDeletecomment = async () => {
        console.log(commentIdToDelete);

        setshowModal(false);
        try {
            const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                setComments((prev) =>
                    prev.filter((comment) =>
                        comment._id !== commentIdToDelete
                    ));
            }
        } catch (error) {
            console.log(error.message);
        }

    }





    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' >
            {
                currentuser.isAdmin && Comments.length > 0
                    ?
                    <>
                        <Table hoverable className='shadow-md' >

                            <Table.Head>

                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Comment Content</Table.HeadCell>
                                <Table.HeadCell>No Of Likes</Table.HeadCell>
                                <Table.HeadCell>Post ID</Table.HeadCell>
                                <Table.HeadCell>user ID</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>

                            </Table.Head>

                            {Comments.map((comment) => (
                                <Table.Body key={comment._id} className='divide-y' >
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' >
                                        <Table.Cell >
                                            {new Date(comment.updatedAt).toLocaleDateString()}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {comment.content}
                                        </Table.Cell>

                                        <Table.Cell>

                                            {comment.numberOfLikes}

                                        </Table.Cell>

                                        <Table.Cell>
                                            {comment.postId}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.userId}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span
                                                onClick={() => { setshowModal(true); setcommentIdToDelete(comment._id); }}
                                                className='font-medium text-red-500 hover:underline cursor-pointer'
                                            >
                                                DELETE
                                            </span>
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>
                            ))}

                        </Table>
                        {
                            showMore &&
                            <button onClick={handleShowMoreClick} className='w-full text-sm py-7 text-teal-500 self-center' >
                                show more...
                            </button>
                        }
                    </>
                    :
                    <p>You have no comments.</p>
            }

            <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md' >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center' >
                        <HiOutlineExclamationCircle
                            className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'
                        />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to DELETE this comment
                        </h3>

                        <div className='flex justify-center gap-4' >
                            <Button color='failure' onClick={handleDeletecomment} > Yes i'm sure</Button>

                            <Button color='gray' onClick={() => setshowModal(false)} > No </Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
