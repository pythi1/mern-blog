import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {

    const { postSlug } = useParams();
    const [Loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [post, setpost] = useState(null);
    const [recentPosts, setrecentPosts] = useState(null);


    // console.log(post);

    useEffect(() => {

        const FetchPost = async () => {

            try {

                setloading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();

                if (!res.ok) {
                    seterror(true);
                    setloading(false);
                    return;
                }

                if (res.ok) {
                    setpost(data.posts[0]);
                    setloading(false);
                    seterror(false);
                }

            } catch (error) {
                seterror(true);
                setloading(false);

            }

        };

        FetchPost();

    }, [postSlug]);


    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();

                if (res.ok) {
                    setrecentPosts(data.posts);
                    // console.log(data.posts);
                }
            }

            fetchRecentPosts();
        } catch (error) {
            console.log(error);
        }
    }, []);



    if (Loading) return (
        <div className='flex justify-center items-center min-h-screen' >
            <Spinner size='xl' />
        </div>
    )

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen' >
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl' >
                {post && post.title}
            </h1>

            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5' >
                <Button color='gray' pill size='xs' >
                    {post && post.category}
                </Button>
            </Link>

            <img
                src={post && post.image}
                alt={post && post.title}
                className='mt-10 p-3 max-h-[600px] w-full object-cover'
            />

            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs' >
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post && (post.content.length / 1000).toFixed(0)} min read</span>
            </div>

            <div
                className='p-3 max-w-2xl mx-auto w-full post-content'
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            >

            </div>

            <div className='max-w-4xl mx-auto w-full' >
                <CallToAction />
            </div>
            <CommentSection postId={post._id} />

            <div className='flex flex-col justify-center items-center mb-5' >
                <h1 className='text-xl mt-5' >Recent article</h1>
                <div className='flex flex-wrap gap-5 m-5 justify-center' >
                    { recentPosts && 
                        recentPosts.map((post) => <PostCard key={post._id} post={post} />

                        )}
                </div>
            </div>

        </main>
    )
}
