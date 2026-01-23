
import { useEffect } from 'react'
import './index.css'
import { useAuthStore } from './store/auth/auth.store'
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import { AdminHomePage } from './pages/admin/AdminHomePage';
import UserHomePage from './pages/user/UserHomePage';
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import "./App.css"

document.documentElement.classList.add("dark");



function App() {

  const { checkAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])


  return (
    <div className='bg-card'>
      <Routes>

        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={authUser?.role === 'ADMIN' ? <AdminHomePage /> : authUser?.role === 'USER' ? <UserHomePage /> : <Navigate to="/login" />} />
        {/* <Route path="/" element={authUser?.role === 'user' ? <UserHomePage/> : <Navigate to="/login" />} /> */}

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
