import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react"
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/user/Userslice.js';
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';

function DashProfile() {

  const { currentuser, error, loading } = useSelector(state => state.user);
  const [imageFile, setimageFile] = useState(null);
  const [imageUrl, setimageUrl] = useState(null);
  const filePickerRef = useRef();
  const [imagefileUploadingProgress, setimagefileUploadingProgress] = useState(null); // ye dikhane ke liye ki kitni file uplaod ho gyi hai 
  const [imagefileuploaderror, setimagefileuploaderror] = useState(null); // error jab image file uplpaod kr rahe ho.
  const [imageFileUploading, setimageFileUploading] = useState(false); // jab file uploading ho rahi ho tab
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateuserError, setupdateuserError] = useState(null);
  const [formdata, setformdata] = useState({});
  const [showModal, setshowModal] = useState(false);





  const dispatch = useDispatch();

  // console.log(imagefileUploadingProgress, imagefileuploaderror);


  const handleimagechange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setimageFile(file);
      setimageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);



  const uploadImage = async () => {
    console.log("uploading image....");



    setimageFileUploading(true);
    setimagefileuploaderror(null);

    const storage = getStorage(app);
    const filename = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setimagefileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setimagefileuploaderror("couldn't upload.");
        setimagefileUploadingProgress(null);
        setimageFile(null);
        setimageUrl(null);
        setimageFileUploading(false);

      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setimageUrl(downloadUrl);
          setformdata({ ...formdata, profilePicture: downloadUrl });
          setimageFileUploading(false);
        });
      }

    )

  };

  const handleInputeChange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value })
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    setupdateuserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formdata).length === 0) {
      setupdateuserError("no changes Made");
      return;
    }

    if (imageFileUploading) {
      setupdateuserError("please wait for  image to finish uploading");
      return;
    }

    try {

      dispatch(updateStart());
      const userid = currentuser._id
      const res = await fetch(`/api/user/update/${userid}`, {
        method: "PUT",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setupdateuserError(data.message)
      }
      else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Update Successfully...")
      }

    } catch (error) {
      dispatch(updateFailure(error.message));
      setupdateuserError(error.message);
    }

  }

  const handleDeleteUser = async () => {
    setshowModal(false);
    try {
      dispatch(deleteUserStart());
      const userid = currentuser._id;
      const res = await fetch(`/api/user/delete/${userid}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  console.log(formdata);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      else {
        dispatch(signOutSuccess());
      }

    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full' >
      <h1 className='my-7 text-center font-semibold text-3xl' >Profile</h1>

      <form onSubmit={handleInputSubmit} className='flex flex-col gap-4' >
        <input type='file' accept='image/*' onChange={handleimagechange} ref={filePickerRef} hidden />

        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()} >

          {imagefileUploadingProgress && (
            <CircularProgressbar
              value={imagefileUploadingProgress || 0}
              text={`${imagefileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62,152,199), ${imagefileUploadingProgress / 100}`,
                }
              }}
            />
          )}

          <img
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imagefileUploadingProgress && imagefileUploadingProgress < 100 && 'opacity-30'}`}
            src={imageUrl || currentuser.profilePicture}
            alt='user profile'
          />
        </div>

        {imagefileuploaderror && <Alert color="failure" >
          {imagefileuploaderror}
        </Alert>}



        <TextInput type='text' id="username" placeholder='Username' defaultValue={currentuser.username} onChange={handleInputeChange} />
        <TextInput type='email' id="email" placeholder='email' defaultValue={currentuser.email} onChange={handleInputeChange} />
        <TextInput type='password' id="password" placeholder='password' onChange={handleInputeChange} />

        <Button type='submit' gradientDuoTone="purpleToBlue" outline disabled={loading || imageFileUploading} > {loading ? "loading..." : "Update"} </Button>

        {
          currentuser.isAdmin && (
            <Link to={'/create-post'}>

              <Button
                gradientDuoTone='purpleToPink'
                type='button'
                className='w-full'
              >
                Create a post
              </Button>
            </Link>
          )
        }

      </form>

      <div className='text-red-500 flex justify-between mt-5 ' >
        <span className='cursor-pointer' onClick={() => setshowModal(true)} >Delete Acount</span>
        <span className='cursor-pointer' onClick={handleSignOut} >Sign Out</span>
      </div>

      {updateUserSuccess && (<Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>)}

      {updateuserError && (<Alert color="failure" className='mt-5'>{updateuserError}</Alert>)}

      {error && (<Alert color="failure" className='mt-5'>{error}</Alert>)}

      <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md' >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center' >
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to DELETE this account</h3>

            <div className='flex justify-center gap-4' >
              <Button color='failure' onClick={handleDeleteUser} > Yes i'm sure</Button>

              <Button color='gray' onClick={() => setshowModal(false)} > No </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>

    </div>
  )
}

export default DashProfile;