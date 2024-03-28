import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashPosts() {

    const { currentuser } = useSelector(state => state.user);
    const [userPosts, setuserPosts] = useState([]);
    const [ showMore, setshowMore ] = useState(true);

    console.log(userPosts);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const curruserid = currentuser._id;
                const res = await fetch(`/api/post/getposts?userId=${curruserid}`);
                const data = await res.json();


                if (res.ok) {
                    setuserPosts(data.posts);
                    if(data.posts.length < 9){
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
            if(res.ok){
                setuserPosts((prev) => [...prev, ...data.posts]);
                if(data.posts.length < 9){
                    setshowMore(false);
                }
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
                                <Table.Body className='divide-y' >
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
                                            <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`} > {post.title} </Link>
                                        </Table.Cell>

                                        <Table.Cell>
                                            {post.category}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span className='font-medium text-red-500 hover:underline cursor-pointer' >DELETE</span>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Link className='text-teal-500 hover:underline cursor-pointer' to={`/update-post/${post._id}`} >
                                                <span>edit</span>
                                            </Link>
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>
                            ))}

                        </Table>
                        {
                            showMore && <button onClick={handleShowMoreClick} className='w-full text-sm py-7 text-teal-500 self-center' >show more..</button>
                        }
                    </>
                    :
                    <p>You have no posts.</p>
            }
        </div>
    )
}
