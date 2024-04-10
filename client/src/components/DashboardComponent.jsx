import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashboardComponent() {

    const { currentuser } = useSelector(state => state.user);
    const [users, setusers] = useState([]);
    const [comments, setcomments] = useState([]);
    const [posts, setposts] = useState([]);
    const [totalUsers, settotalusers] = useState(0);
    const [totalPosts, settotalposts] = useState(0);
    const [totalcomments, settotalcomments] = useState(0);
    const [lastmonthposts, setlastmonthposts] = useState(0);
    const [lastmonthusers, setlastmonthusers] = useState(0);
    const [lastmonthcomments, setlastmonthcomments] = useState(0);


    useEffect(() => {
        const fetchusers = async () => {

            try {
                const res = await fetch(`/api/user/getusers?limit=5`);
                const data = await res.json();

                if (res.ok) {
                    setusers(data.users);
                    setlastmonthusers(data.lastMonthUsers);
                    settotalusers(data.totalUsers);
                }

            } catch (error) {
                console.log(error.message);
            }

        };

        const fetchposts = async () => {
            try {

                const res = await fetch(`/api/post/getposts?limit=5`);
                const data = await res.json();

                if (res.ok) {
                    setposts(data.posts);
                    setlastmonthposts(data.lastMonthPosts);
                    settotalposts(data.totalPosts)
                }

            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchcomments = async () => {
            try {

                const res = await fetch('/api/comment/getcomments?limit=5');
                const data = await res.json();

                if (res.ok) {
                    setcomments(data.comments);
                    setlastmonthcomments(data.lastmonthComments);
                    settotalcomments(data.totalComments)
                }

            } catch (error) {
                console.log(error.message);
            }
        }


        if (currentuser.isAdmin) {
            fetchcomments();
            fetchposts();
            fetchusers();
        }

    }, [currentuser])

    return (
        <div className="p-3 mx-auto" >
            <div className='flex-wrap flex gap-4 justify-center' >


                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md' >
                    <div className='flex justify-between' >
                        <div>
                            <h3 className='text-gray-500 text-md uppercase' >Total Users</h3>
                            <p className='text-2xl' >{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm' >
                        <span className='text-green-500 flex items-center' >
                            <HiArrowNarrowUp />
                            {lastmonthusers}
                        </span>
                        <div className='text-gray-500' >last Month</div>
                    </div>
                </div>



                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md' >
                    <div className='flex justify-between' >
                        <div>
                            <h3 className='text-gray-500 text-md uppercase' >Total comments</h3>
                            <p className='text-2xl' >{totalcomments}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm' >
                        <span className='text-green-500 flex items-center' >
                            <HiArrowNarrowUp />
                            {lastmonthcomments}
                        </span>
                        <div className='text-gray-500' >last Month</div>
                    </div>
                </div>



                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md' >
                    <div className='flex justify-between' >
                        <div>
                            <h3 className='text-gray-500 text-md uppercase' >Total Posts</h3>
                            <p className='text-2xl' >{totalPosts}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm' >
                        <span className='text-green-500 flex items-center' >
                            <HiArrowNarrowUp />
                            {lastmonthposts}
                        </span>
                        <div className='text-gray-500' >last Month</div>
                    </div>
                </div>


            </div>

            <div className=' flex flex-wrap gap-4 py-3 mx-auto justify-center  ' >
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800' >
                    <div className='flex justify-between p-3 text-sm font-semibold ' >
                        <h1 className='text-center' > Recent Users</h1>
                        <Button outline gradientDuoTone='purpleToPink'  > 
                            <Link to={`/dashboard?tab=users`} >See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>User name</Table.HeadCell>
                        </Table.Head>
                        {users && users.map((user) => (
                            <Table.Body key={user._id} className='divide-y' >
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 ' > 
                                    <Table.Cell>
                                        <img 
                                        src={user.profilePicture} 
                                        alt='User' 
                                        className='w-10 h-10 rounded-full bg-gray-500 '
                                        />
                                    </Table.Cell>

                                    <Table.Cell> {user.username} </Table.Cell>

                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800' >
                    <div className='flex justify-between p-3 text-sm font-semibold ' >
                        <h1 className='text-center' > Recent Comments</h1>
                        <Button outline gradientDuoTone='purpleToPink'  > 
                            <Link to={`/dashboard?tab=comments`} >See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment content </Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {comments  && comments.map((comment) => (
                            <Table.Body key={comment._id} className='divide-y' >
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 ' > 
                                    <Table.Cell className='' > <p className='line-clamp-2' > {comment.content} </p> </Table.Cell>

                                    <Table.Cell> {comment.numberOfLikes} </Table.Cell>

                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800' >
                    <div className='flex justify-between p-3 text-sm font-semibold ' >
                        <h1 className='text-center' > Recent posts</h1>
                        <Button outline gradientDuoTone='purpleToPink'  > 
                            <Link to={`/dashboard?tab=users`} >See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                           <Table.HeadCell>Post category</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map((post) => (
                            <Table.Body key={post._id} className='divide-y' >
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 ' > 
                                    <Table.Cell>
                                        <img 
                                        src={post} 
                                        alt='User' 
                                        className='w-10 h-10 rounded-full bg-gray-500 '
                                        />
                                    </Table.Cell>

                                    <Table.Cell> {post.title} </Table.Cell>

                                    <Table.Cell> {post.category} </Table.Cell>

                                
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

            </div>
        </div>
    )
}
