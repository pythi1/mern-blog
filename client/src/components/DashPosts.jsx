import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {

    const { currentuser } = useSelector(state => state.user);
    const [userPosts, setuserPosts] = useState([]);
    const [showMore, setshowMore] = useState(true);
    const [showModal, setshowModal] = useState(false);
    const [postIdToDelete, setpostIdToDelete] = useState('');

    console.log(userPosts);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const curruserid = currentuser._id;
                const res = await fetch(`/api/post/getposts?userId=${curruserid}`);
                const data = await res.json();


                if (res.ok) {
                    setuserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setshowMore(false);
                    }
                }

            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentuser.isAdmin) {
            fetchPosts();
        }

    }, [currentuser._id]);


    const handleShowMoreClick = async () => {
        const startindex = userPosts.length;

        try {
            const res = await fetch(`/api/post/getposts?userId=${currentuser._id}&startIndex=${startindex}`);
            const data = await res.json();
            if (res.ok) {
                setuserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setshowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }

    }


    const handleDeletePost = async () => {

        setshowModal(false);
        try {
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentuser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                setuserPosts((prev) =>
                    prev.filter((post) =>
                        post._id !== postIdToDelete
                    ));
            }
        } catch (error) {
            console.log(error.message);
        }

    }




    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' >
            {
                currentuser.isAdmin && userPosts.length > 0
                    ?
                    <>
                        <Table hoverable className='shadow-md' >

                            <Table.Head>

                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Post Image</Table.HeadCell>
                                <Table.HeadCell>Post Title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell> <span>Edit</span> </Table.HeadCell>

                            </Table.Head>

                            {userPosts.map((post) => (
                                <Table.Body key={post._id} className='divide-y' >
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' >
                                        <Table.Cell >
                                            {new Date(post.updatedAt).toLocaleDateString()}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Link to={`/post/${post.slug}`} >
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className='w-20 h-10 object-cover bg-gray-500 '
                                                />
                                            </Link>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Link
                                                className='font-medium text-gray-900 dark:text-white'
                                                to={`/post/${post.slug}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </Table.Cell>

                                        <Table.Cell>
                                            {post.category}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span
                                                onClick={() => { setshowModal(true); setpostIdToDelete(post._id); }}
                                                className='font-medium text-red-500 hover:underline cursor-pointer'
                                            >
                                                DELETE
                                            </span>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Link
                                                className='text-teal-500 hover:underline cursor-pointer'
                                                to={`/update-post/${post._id}`}
                                            >
                                                <span>edit</span>
                                            </Link>
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
                    <p>You have no posts.</p>
            }

            <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md' >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center' >
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to DELETE this post</h3>

                        <div className='flex justify-center gap-4' >
                            <Button color='failure' onClick={handleDeletePost} > Yes i'm sure</Button>

                            <Button color='gray' onClick={() => setshowModal(false)} > No </Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
