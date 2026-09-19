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
//725095508798-e72ej4f8m8p18c84b54i37f5vs9kvt6f.apps.googleusercontent.com
function App() {
  
  
  return (
    <GoogleOAuthProvider clientId="725095508798-e72ej4f8m8p18c84b54i37f5vs9kvt6f.apps.googleusercontent.com">
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