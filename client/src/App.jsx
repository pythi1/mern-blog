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
import UpdatePost from './pages/updatePosts.jsx';
import PostPage from './pages/PostPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Search from './pages/Search.jsx';


function App() {

  return (
    <BrowserRouter>
    <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<PrivateAdminRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>

        <Route path="/signin" element={<Singin />} />

        <Route path="/signup" element={<Singup />} />

        <Route path="/search" element={<Search />} />

        <Route path="/projects" element={<Projects />} />

        <Route path='/post/:postSlug' element={<PostPage />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
