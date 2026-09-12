import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadMedia from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import api from "../../utils/api";
export default function AdminEditProductForm(){

    //get details transfered from previous page
    const location = useLocation()
    const [productId, setProductId] = useState(location.state.productId);
    const [name, setName] = useState(location.state.name);
    const [altNames, setAltNames] = useState(location.state.altNames.join(","));
    const [description, setDescription] = useState(location.state.description);
    const [price, setPrice] = useState(location.state.price);
    const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice);
    const [images, setImages] = useState([]);
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable);
    const [category, setCategory] = useState(location.state.category);
    const [stock, setStock] = useState(location.state.stock);
    const [brand, setBrand] = useState(location.state.brand);
    const [model, setModel] = useState(location.state.model);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    console.log(location);

    async function editProduct(){

        setIsLoading(true);

        const token = localStorage.getItem("token");

        if(token == null){
            toast.error("You must be logged in to add a product");
            navigate("/signin");
            return;
        }

        
    try{
        const imageUploadPromises = []

        for(let i=0; i<images.length; i++){

            imageUploadPromises.push(uploadMedia(images[i]))

        }
        //imageUploadPromises -> [Promise1, Promise2, Promise3]

        let imageUrls = await Promise.all(imageUploadPromises);

        if(imageUrls.length == 0){
            imageUrls = location.state.images;
        }

        const altNamesArray = altNames.split(",")

        console.log(altNamesArray)


        const requestBody = {
            name : name,
            altNames : altNamesArray,
            description : description,
            price : price,
            labelledPrice : labelledPrice,
            images : imageUrls,
            isAvailable : isAvailable,
            category : category,
            stock : stock,
            brand : brand,
            model : model
        }

        //backend
        await api.put("/products/"+productId, requestBody , 
            {
                headers : {
                    Authorization : "Bearer " + token
                }
            } 
        )

        toast.success("Product updated successfully");
        navigate("/admin/products");

        setIsLoading(false);
    }catch(error){
        toast.error(error?.response?.data?.message || "Failed to update product");
        setIsLoading(false);
    }


        //images upload ["url1", "url2", "url3"]
        //"headphone,headset,audio device"
        //altNames -> ["headphone", "headset", "audio device"]

        //json of a product send backend

    }



    return(
        <div className="w-full h-full flex items-center flex-col">
            <div className="w-full h-[100px] bg-white shadow-2xl rounded-lg flex p-4 items-center justify-between">
                <h1 className="text-2xl font-semibold">Edit Product</h1>
                <div className="h-full gap-4 flex items-center">
                    <Link to="/admin/products" className="bg-red-600 text-white w-[100px] text-center py-2 rounded-lg">
                        Cancel
                    </Link>

                    <button disabled={isLoading} className="save-btn" onClick={editProduct}>
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>                
            </div>
            <div className="w-full  p-4 flex px-2 flex-wrap">
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Product ID</label>
                    <input disabled value={productId} onChange={(e)=>setProductId(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" placeholder="PD-001"/>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col  px-2 my-2 ">
                    <label className="font-semibold">Product Name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" placeholder="Nvidea RTX 5090"/>
                </div>
                <div className="w-1/2 h-[70px] flex flex-col  px-2 my-2">
                    <label className="font-semibold">Alternative Names <span className="italic text-sm text-gray-400">(comma-separated)</span></label>
                    <input value={altNames} onChange={(e)=>setAltNames(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" placeholder="VGA, Graphic Card, GPU"/>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Price</label>
                    <input value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" placeholder="0.00"/>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Labelled Price</label>
                    <input value={labelledPrice} onChange={(e)=>setLabelledPrice(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" placeholder="0.00"/>
                </div>
                <div className="w-full h-[170px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Description</label>
                    <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full h-full border rounded-lg px-2" placeholder="Enter product description"/>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Images</label>
                    <input multiple={true} onChange={(e)=>{setImages(e.target.files)}} type="file" className="w-full h-[40px] border rounded-lg px-2" placeholder="PD-001"/>
                </div>
                {/* <div className="w-1/4 h-[70px] flex flex-col px-2">
                    <label className="font-semibold">Availability</label>
                    <input type="checkbox" checked={isAvailable} onChange={(e)=>setIsAvailable(e.target.checked)} className="w-full h-[40px] border rounded-lg px-2" />
                </div> */}
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Availability</label>
                    <select value={isAvailable} onChange={(e)=>{setIsAvailable(e.target.value)}} className="w-full h-[40px] border rounded-lg px-2">
                        <option value={true} >Available</option>
                        <option value={false} >Unavailable</option>
                    </select>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Stock</label>
                    <input value={stock} onChange={(e)=>setStock(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" placeholder="0"/>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2"></div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Category</label>
                    <select value={category} onChange={(e)=>{setCategory(e.target.value)}} className="w-full h-[40px] border rounded-lg px-2">
                        <option value="graphic card">Graphics Card</option>
                        <option value="motherboard">Motherboard</option>
                        <option value="cpu">CPU</option>
                        <option value="ram">RAM</option>
                        <option value="storage">Storage</option>
                        <option value="power supply">Power Supply</option>
                        <option value="case">Case</option>
                        <option value="cooling">Cooling</option>
                        <option value="peripherals">Peripherals</option>
                        {/* keybords mouse laptops others */}
                        <option value="keyboards">Keyboards</option>
                        <option value="mouse">Mouse</option>
                        <option value="laptops">Laptops</option>
                        <option value="others">Others</option>
                    </select>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Brand <span className="italic text-sm text-gray-400">(optional)</span></label>
                    <select value={brand} onChange={(e)=>{setBrand(e.target.value)}} className="w-full h-[40px] border rounded-lg px-2">
                        <option value="nvidia">NVIDIA</option>
                        <option value="amd">AMD</option>
                        <option value="intel">Intel</option>
                        <option value="asus">ASUS</option>
                        <option value="msi">MSI</option>
                        <option value="gigabyte">Gigabyte</option>
                        <option value="corsair">Corsair</option>
                        <option value="cooler master">Cooler Master</option>
                        <option value="logitech">Logitech</option>
                        <option value="razer">Razer</option>
                        <option value="dell">Dell</option>
                        <option value="hp">HP</option>
                        <option value="lenovo">Lenovo</option>
                        <option value="apple">Apple</option>
                        <option value="red dragon">Red Dragon</option>
                        <option value="">No brand</option>
                    </select>
                </div>
                <div className="w-1/4 h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Model <span className="italic text-sm text-gray-400">(optional)</span></label>
                    <input value={model} onChange={(e)=>setModel(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" placeholder="RTX 5090"/>
                </div>
            </div>
        </div>
    )

}