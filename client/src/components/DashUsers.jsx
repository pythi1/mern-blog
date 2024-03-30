import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';                      
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes} from 'react-icons/fa'

export default function DashUsers() {

    const { currentuser } = useSelector(state => state.user);
    const [users, setusers] = useState([]);
    const [showMore, setshowMore] = useState(true);
    const [showModal, setshowModal] = useState(false);
    const [userIdToDelete, setuserIdToDelete] = useState('');

    console.log(users);

    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();


                if (res.ok) {
                    setusers(data.users);
                    if (data.users.length < 9) {
                        setshowMore(false);
                    }
                }

            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentuser.isAdmin) {
            fetchUsers();
        }

    }, [currentuser._id]);


    const handleShowMoreClick = async () => {
        const startindex = users.length;

        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startindex}`);
            const data = await res.json();
            if (res.ok) {
                setusers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setshowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    const handleDeleteUser = async () => {
        console.log(userIdToDelete);

        setshowModal(false);
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                setusers((prev) =>
                    prev.filter((user) =>
                        user._id !== userIdToDelete
                    ));
            }
        } catch (error) {
            console.log(error.message);
        }

    }





    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' >
            {
                currentuser.isAdmin && users.length > 0
                    ?
                    <>
                        <Table hoverable className='shadow-md' >

                            <Table.Head>

                                <Table.HeadCell>Date Created</Table.HeadCell>
                                <Table.HeadCell>User Image</Table.HeadCell>
                                <Table.HeadCell>User Name</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>

                            </Table.Head>

                            {users.map((user) => (
                                <Table.Body key={user._id} className='divide-y' >
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' >
                                        <Table.Cell >
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </Table.Cell>

                                        <Table.Cell>

                                            <img
                                                src={user.profilePicture}
                                                alt={user.username}
                                                className='w-10 h-10 rounded-full object-cover bg-gray-500 '
                                            />

                                        </Table.Cell>

                                        <Table.Cell>

                                            {user.username}

                                        </Table.Cell>

                                        <Table.Cell>
                                            {user.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span
                                                onClick={() => { setshowModal(true); setuserIdToDelete(user._id); }}
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
                    <p>You have no users.</p>
            }

            <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md' >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center' >
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to DELETE this user</h3>

                        <div className='flex justify-center gap-4' >
                            <Button color='failure' onClick={handleDeleteUser} > Yes i'm sure</Button>

                            <Button color='gray' onClick={() => setshowModal(false)} > No </Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
