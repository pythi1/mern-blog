import React from 'react';
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from "react-redux";
import { signInSuccess } from '../redux/user/Userslice';
import { useNavigate } from "react-router-dom";

export default function Oauth() {

    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: "select_account" })
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            // console.log(resultFromGoogle);

            const res = await fetch("api/auth/google", {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL
                }),
            })
            const data = await res.json();
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate("/home")
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Button type='button' gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick} >
            <AiFillGoogleCircle className='w-6 h-6' />
            continue with google
        </Button>
    )
}
