import { useState } from "react"
import toast from "react-hot-toast"
import { FaTwitter } from "react-icons/fa6";
import uploadMedia from "../utils/mediaUpload";

export default function TestPage(){

    return(
        <div className="w-full h-full bg-green-400 md:bg-red-600 lg:bg-blue-500">
            
        </div>
    )
}


// export default function TestPage(){

//     const [file, setFile] = useState(null)

//     async function uploadFile(){

//        const res = await uploadMedia(file)

//        console.log(res)

//     }

//     return(
//         <div className="w-full h-full  flex justify-center items-center">

//             <input type="file" onChange={
//                 (e)=>{
//                     setFile(e.target.files[0])
//                 }
//             }/>

//             <button
//                 onClick={uploadFile}
//                 className="bg-blue-600 p-4 rounded-lg text-white">
//                 Upload
//             </button>
//         </div>
//     )

// }




// export default function TestPage(){

//     const [score , setScore] =  useState(50)
//     const [mood , setMood] = useState("😐")
//     const [isFollowed , setIsFollowed] = useState(false)

//     //let score = 50

    

//     return(
//         <div className="w-full h-full bg-green-400 flex justify-center items-center">
//             <div className="w-[450px] h-[450px]  bg-white flex justify-center items-center flex-col">
//                 <h1 className="font-bold text-7xl">{score}</h1>
//                 <div className="w-full h-[100px] flex justify-center items-center">
//                     <button className="w-[100px] bg-red-600 h-[40px] mx-5"
//                         onClick={
//                             ()=>{
//                                 // score = 49
//                                 setScore(score - 1)
//                             }
//                         }>
//                         Decrease
//                     </button>
//                     <button 
//                         className="w-[100px] bg-green-600 h-[40px] mx-5"
//                         onClick={
//                             ()=>{

//                                 setScore(score + 1)

//                             }
//                         }>
//                         Increase
//                     </button>
//                 </div>
//                 <h1 className="font-bold text-7xl">{mood}</h1>
//                  <div className="w-full h-[100px] flex justify-center items-center">
//                     <button className="w-[100px] bg-red-600 h-[40px] mx-5"
//                         onClick={
//                             ()=>{
//                                 setMood("☹️")
//                                 toast.error("Oh no! You are sad")
//                             }
//                         }>
//                         Sad
//                     </button>
//                     <button 
//                         className="w-[100px] bg-green-600 h-[40px] mx-5"
//                         onClick={
//                             ()=>{
//                                 setMood("😐")
//                                 toast("You are neutral",{
//                                     icon: "😐"
//                                 })
//                             }
//                         }>
//                         Neurtal
//                     </button>
//                      <button 
//                         className="w-[100px] bg-blue-600 h-[40px] mx-5"
//                         onClick={
//                             ()=>{
//                                 toast.success("Yay! You are happy")
//                                 setMood("😀")
//                             }
//                         }>
//                         Happy
//                     </button>
                        
//                 </div>
//                 <FaTwitter onClick={
//                     ()=>{
//                         toast("Follow us on Twitter",{
//                             icon: <FaTwitter className="text-blue-500"/>
//                         })
//                         setIsFollowed(!isFollowed)
//                     }
//                 } 
//                 className={isFollowed ? "text-[100px] text-blue-600" : "text-[100px] text-gray-600"}/>                
//             </div>
//         </div>
//     )
// }