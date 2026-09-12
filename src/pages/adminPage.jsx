import { BsGift } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { TbUsers } from "react-icons/tb";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AdminProductsPage from "./admin/adminProductPage";
import AdminAddProductForm from "./admin/adminAddProductForm";
import AdminEditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";
import AdminUsersPage from "./admin/adminUsersPage";

export default function AdminPage(){

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(
        ()=>{
            const token = localStorage.getItem("token");

            if(token != null){

                api.get("/users/me" , {
                    headers : {
                        "Authorization" : `Bearer ${token}`
                    }
                }).then((res)=>{
                    
                    if(res.data.isAdmin){
                        setUser(res.data);
                    }else{
                        toast.error("You are not authorized to access this page");
                        navigate("/");
                    }

                }).catch((err)=>{
                    console.log(err);
                    setUser(null);
                });

            }else{
                toast.error("You are not authorized to access this page");
                navigate("/login");
            }
        }
        ,[]
    )

    return(
        <div className="w-full h-full flex bg-primary">

            <div className="w-[300px] h-full bg-white flex flex-col shadow-2xl">
                <div className="w-full h-[100px] py-4 px-2">
                        
                        <img src="/logo.png" className="h-full "/>

                </div>

                <Link to="/admin" className="w-full p-4 text-xl text-gray-500  flex items-center gap-4">
                    <FiShoppingCart />
                    <span className="w-full h-full block ">Orders</span>
                </Link>

                <Link to="/admin/products" className="w-full p-4 text-xl text-gray-500  flex items-center gap-4">
                    <BsGift />
                    <span className="w-full h-full block ">Products</span>
                </Link>

                <Link to="/admin/users" className="w-full p-4 text-xl text-gray-500  flex items-center gap-4">
                    <TbUsers />
                    <span className="w-full h-full block ">Users</span>
                </Link>
                
            </div>

            <div className="w-[calc(100%-300px)] h-full p-4">
                {user==null?<LoadingScreen/>:
                <Routes>
                    <Route path="/" element={<AdminOrdersPage/>}/>
                    <Route path="/products" element={<AdminProductsPage/>}/>
                    <Route path="/users" element={<AdminUsersPage/>}/>
                    <Route path="/add-product" element={<AdminAddProductForm/>}/>
                    <Route path="/edit-product" element={<AdminEditProductForm/>}/>
                </Routes>}
            </div>
        </div>
    )
}