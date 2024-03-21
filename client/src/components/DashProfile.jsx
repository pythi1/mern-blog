import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react"
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashProfile() {

  const { currentuser } = useSelector(state => state.user);
  const [imageFile, setimageFile] = useState(null);
  const [imageUrl, setimageUrl] = useState(null);
  const filePickerRef = useRef();
  const [imagefileUploadingProgress, setimagefileUploadingProgress] = useState(null);
  const [imagefileuploaderror, setimagefileuploaderror] = useState(null);

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

      },

      

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setimageUrl(downloadUrl);
        });
      }

    )

  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full' >
      <h1 className='my-7 text-center font-semibold text-3xl' >Profile</h1>
      <form className='flex flex-col gap-4' >
        <input type='file' accept='image/*' onChange={handleimagechange} ref={filePickerRef} hidden />

        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()} >

          {imagefileUploadingProgress && (
            <CircularProgressbar 
            value={imagefileUploadingProgress || 0} 
            text={`${imagefileUploadingProgress}%`} 
            strokeWidth={5}
            styles={{
              root:{
                position: "absolute",
                width: "100%",
                height: "100%",
                top:"0",
                left: "0",
              },
              path:{
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



        <TextInput type='text' id="username" placeholder='Username' defaultValue={currentuser.username} />
        <TextInput type='email' id="email" placeholder='email' defaultValue={currentuser.email} />
        <TextInput type='password' id="password" placeholder='password' />

        <Button type='submit' gradientDuoTone="purpleToBlue" outline >Update</Button>

        <div className='text-red-500 flex justify-between mt-5 ' >
          <span className='cursor-pointer' >Delete Acount</span>
          <span className='cursor-pointer' >Delete Acount</span>
        </div>

      </form>
    </div>
  )
}

export default DashProfile;