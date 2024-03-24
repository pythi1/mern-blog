import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Singin from './pages/Singin';
import Singup from './pages/Singup';
import Projects from './pages/Projects';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute.jsx';
import PrivateAdminRoute from './components/PrivateAdminRoute.jsx';
import CreatePost from './pages/CreatePost.jsx';


function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<PrivateAdminRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
        </Route>

        <Route path="/signin" element={<Singin />} />

        <Route path="/signup" element={<Singup />} />

        <Route path="/projects" element={<Projects />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
