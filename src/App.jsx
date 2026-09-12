import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/registerPage'
import AdminPage from './pages/adminPage'
import TestPage from './pages/test'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ForgetPasswordPage from './pages/forgetPassword'
//357070172721-psc9uchu79ptgs1e12d4gbnli96j29mj.apps.googleusercontent.com
function App() {
  
  
  return (
    <GoogleOAuthProvider clientId="357070172721-psc9uchu79ptgs1e12d4gbnli96j29mj.apps.googleusercontent.com">
      <div className='w-full h-screen '>
        <Toaster position='top-right'/>
        <Routes>

          <Route path='/*'  element={<HomePage/>}  />

          <Route path='/signin' element={<LoginPage/>}/>

          <Route path='/signup' element={<RegisterPage/>}/>

          <Route path='/forget-password' element={<ForgetPasswordPage/>}/>

          <Route path='/admin/*' element={<AdminPage/>}/>

          <Route path='/test' element={<TestPage/>}/>

        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App