import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';

function Singin() {

  const [ formdata, setformdata ] = useState({});
  const [errormessage, seterrormessage] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformdata({...formdata, [e.target.id]: e.target.value.trim()});
  };
  console.log(formdata);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formdata.email || !formdata.password){
      return seterrormessage("please fill out all fields signin.");
    }

    // sending data to the server

    try{
      setloading(true);
      seterrormessage(null);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if(data.success === false){
        return seterrormessage(data.message + "frontend fetching data");
      }
      setloading(false);
      if(res.ok){
        navigate("/home");
      }
    }
    catch (error) {
      seterrormessage(error.message);
      setloading(false)
    }
  }

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

          <form className='flex flex-col gap-4 ' onSubmit={handleSubmit} >
            {/* <div>
              <Label value='enter your name' />
              <TextInput
                type='text'
                placeholder='enter your name'
                id='username'
                onChange={handleChange}
              />
            </div> */}

            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='your email'
                id='email'
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value='Password' />
              <TextInput
                type='password'
                placeholder='*********'
                id='password'
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone="purpleToPink" outline type='submit' disabled={loading} >
              {
                loading ? ( <><Spinner size="sm" /><span className='pl-3' >loading...</span></> ) : "Sign In"
              }
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5 font-semibold' >
          <span>Don't have an account</span>
          <Link to="/signup" className='text-blue-600' > SignUP </Link>

          </div>
          {
            errormessage && (
              <Alert className='mt-5' color="failure">
                {errormessage}
              </Alert>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default Singin;