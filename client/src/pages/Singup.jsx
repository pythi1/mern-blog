import React from 'react'
import { Form, Link } from 'react-router-dom';
import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Radio,
  RangeSlider,
  Select,
  Textarea,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';

function Singup() {
  return (
    <div className='min-h-screen mt-20 ' >

      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5' >

        {/* left */}
        <div className='flex-1'>
          <Link to="/home" className='font-bold dark:text-white text-4xl' >
            <span className='px-5 py-1 bg-gradient-to-r from-purple-500 via-red-600 to-pink-500 rounded-lg font-bold text-white' >My</span>
            Blog
          </Link>
          <p className='text-sm mt-5' >
            this is a demo web site for mern project..
          </p>

        </div>


        {/* right */}

        <div className='flex-1' >

          <form className='flex flex-col gap-4 ' >
            <div>
              <Label value='enter your name' />
              <TextInput
                type='text'
                placeholder='enter your name'
                id='username'
              />
            </div>

            <div>
              <Label value='Your Email' />
              <TextInput
                type='text'
                placeholder='your email'
                id='email'
              />
            </div>

            <div>
              <Label value='Password' />
              <TextInput
                type='text'
                placeholder='your password'
                id='password'
              />
            </div>

            <Button gradientDuoTone="purpleToPink" outline type='submit' >
              SignUp
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5 font-semibold' >
          <span>Have an account</span>
          <Link to="/signin" className='text-blue-600' > Signin </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Singup;