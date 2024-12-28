import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';



export default function UpdatePost() {

    const [file, setFile] = useState(null);
    const [imageUploadProgress, setimageUploadProgress] = useState(null);
    const [imageUploadError, setimageUplaodError] = useState(null);
    const [formInput, setformInput] = useState({});
    const [publishError, setpublishError] = useState(null);
    const { postId } = useParams();
    const { currentuser } = useSelector((state) => state.user);

    const navigate = useNavigate();



    useEffect(() => {

        // console.log("postid : ", postId);
        // console.log("userid : ", currentuser._id);
        


        try {

            const fetchPost = async () => {

                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    // console.log(data.message);
                    setpublishError(data.message);
                    return;
                }

                if (res.ok) {
                    setpublishError(null);
                    // setformInput(data.posts[0]);
                    setformInput((prev) => ( { ...prev, ...data.posts[0]}));
                }
            }

            fetchPost();


        } catch (error) {
            console.log(" error in fetching post ", error)
            setpublishError('failed to fetch post...');
        }

    }, [postId])


    // console.log(currentuser._id)
    console.log("forminput : ", formInput);



    const handleUploadImage = async () => {

        try {
            if (!file) {
                setimageUplaodError('please select an image');
                return;
            }

            setimageUplaodError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '_' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setimageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setimageUplaodError('image upload error');
                    setimageUploadProgress(null);
                },

                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setimageUploadProgress(null);
                        setimageUplaodError(null);
                        setformInput((prevState) => ({ ...prevState, image: downloadURL }));
                    });
                }
            );

        } catch (error) {
            setimageUplaodError("image uplaod failed.");
            setimageUploadProgress(null);
            console.log(error);
        }
    }


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            // console.log( "form data : ", formInput);
            console.log( "formid : ", formInput._id);
            // console.log( "currentid : ", currentuser._id);
            const res = await fetch(`/api/post/updatepost/${formInput._id}/${currentuser._id}`, {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formInput),
            });

            const data = await res.json();

            if (!res.ok) {
                setpublishError(data.message);
                return;
            }

            setpublishError(null);
            navigate(`/post/${data.slug}`);


        } catch (error) {
            setpublishError('Something went wrong.');
        }
    }




    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen' >
            <h1 className='text-center text-3xl my-7 font-semibold' >Update Post</h1>
            <form className='flex flex-col gap-4 ' onSubmit={handleFormSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between' >

                    <TextInput
                        type='text'
                        placeholder='title'
                        required id='title'
                        className='flex-1 '

                        onChange={(e) => setformInput( (prev) => ({ ...prev, title: e.target.value }))}
                        value={formInput.title}
                    />

                    <Select id='category'

                        onChange={(e) => setformInput((prev) => ({ ...prev, category: e.target.value }))}
                        value={formInput.category}
                    >
                        <option value="uncategorized" > select a category </option>
                        <option value='javascript' > Javascript </option>
                        <option value='react' > React </option>
                        <option value='mongo' > Mongo DB </option>
                        <option value='web' > Webdev </option>
                        <option value='android' > Android </option>
                    </Select>

                </div>

                <div className='flex gap-4 items-center justify-between border-4 border-teal-600 border-dotted p-3' >
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {
                            imageUploadProgress ?

                                <div className='w-16 h-16' > <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} /> </div>

                                : "Update"
                        }
                    </Button>
                </div>
                {
                    imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>
                }

                {

                    formInput.image && (
                        <img
                            src={formInput.image}
                            alt='uplaod'
                            className='w-full h-72 object-cover'
                        />
                    )

                }

                <ReactQuill
                    id='content'
                    theme='snow'
                    placeholder='write something'
                    className='h-72 mb-12'
                    required
                    onChange={(value) => setformInput((prev) => ({ ...prev, content: value }))}
                    value={formInput.content}
                />

                <Button type='submit' gradientDuoTone='purpleToPink' >Update</Button>

                {
                    publishError && <Alert color='failure' className='mt-5 ' >{publishError}</Alert>
                }

            </form>
        </div>
    )
}
