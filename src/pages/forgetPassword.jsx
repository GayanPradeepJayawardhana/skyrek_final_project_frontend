import { useState } from "react"
import api from "../utils/api"
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordPage(){
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    function sendOTP(){
        setLoading(true)
        api.post("/users/otp", { email : email }).then((res)=>{

            console.log(res);
            setLoading(false)
            toast.success("OTP sent to your email")
            setOtpSent(true)
        }).catch((err)=>{

            console.log(err);
            toast.error(  err?.response?.data?.message || "Login failed" )
            setLoading(false)

        })

    }

    function verifyOTP(){

        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match")
            return
        }

        setLoading(true)

        api.post("/users/verify-otp", { email : email , otp : otp , password : newPassword }).then(()=>{
            toast.success("Password changed successfully")
            navigate("/signin")
        }).catch((err)=>{

            console.log(err);
            toast.error(  err?.response?.data?.message || "OTP verification failed" )
            setLoading(false)
        })

    }
    return(
        <div className="w-full h-screen flex justify-center items-center bg-[url('/login-bg.jpg')]">
            {loading && <LoadingScreen/>}
            {otpSent?

            <div className="w-[400px] h-[400px] backdrop-blur-md rounded-lg shadow-lg flex flex-col justify-center items-center gap-6 p-6">
                <h1 className="text-3xl font-semibold text-white">Enter Your Email</h1>
                <input value={email} disabled={true} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" className="w-full text-white h-[40px] rounded-md px-2 border border-white"/>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" placeholder="Enter OTP" className="w-full text-white h-[40px] rounded-md px-2 border border-white"/>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Enter New Password" className="w-full text-white h-[40px] rounded-md px-2 border border-white"/>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm New Password" className="w-full text-white h-[40px] rounded-md px-2 border border-white"/>
                <button disabled={loading} onClick={verifyOTP} className="w-full h-[40px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
            </div>
            :
            <div className="w-[400px] h-[400px] backdrop-blur-md rounded-lg shadow-lg flex flex-col justify-center items-center gap-6 p-6">
                <h1 className="text-3xl font-semibold text-white">Enter Your Email</h1>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" className="w-full text-white h-[40px] rounded-md px-2 border border-white"/>
                <button disabled={loading} onClick={sendOTP} className="w-full h-[40px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
            </div>}
        </div>
    )
}