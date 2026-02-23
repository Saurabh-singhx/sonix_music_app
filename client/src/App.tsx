
import { useEffect } from 'react'
import './index.css'
import { useAuthStore } from './store/auth/auth.store'
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminHomePage } from './pages/admin/AdminHomePage';
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import "./App.css"
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import UserPage from './pages/user/UserPage';
import AllSongsPage from './pages/user/AllSongsPage';
import AppLayout from './pages/AppLayout';
import MusicLoader from './components/ui/Loader';
import RecommendedSongsPage from './pages/user/RecommendedSongsPage';


function App() {

  const { checkAuth, authUser, isCheckingAuth, isLoggingOut } = useAuthStore();

  useEffect(() => {
    if (authUser?.role !== "guest") {
      checkAuth();
    }
  }, [])

  if (isCheckingAuth || isLoggingOut) {
    return (
      <MusicLoader />
    )
  }


  return (
    <div className=''>
      <Routes >

        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route element = {authUser?<AppLayout/>:<Navigate to="/login"/>}>
          <Route path="/" element={authUser?.role === 'ADMIN' ? <AdminHomePage /> : authUser?.role ? <UserPage /> : <Navigate to="/login" />} />
          <Route path="/allsongs" element={authUser?.role ? <AllSongsPage /> : <Navigate to="/login" />} />
          <Route path="/recommended" element={authUser?.role ? <RecommendedSongsPage/> : <Navigate to="/login" />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  )
}

export default App
