import { useEffect, useState } from "react";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import ProductCard from "../components/productCard";

export default function ProductsPage(){
    const [products , setProducts] = useState([]);
    const [loading , setLoading] = useState(true);
    const [query , setQuery] = useState("");
    const [searching , setSearching] = useState(false);

    useEffect(()=>{
        if(loading){
            api.get("/products")
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
        }
    }, [loading]);

    function searchProducts(){
        setSearching(true);
        api.get("products/search/"+query).then((response) => {

            setProducts(response.data);
            setSearching(false);

        }).catch((error) => {

            console.error("Error searching products:", error);
            setSearching(false);
        });
    }
    return(
        <div className="w-full bg-primary flex justify-center items-center gap-6 flex-wrap p-20">
            {
                loading && <LoadingScreen/>
            }
            {
                searching && <LoadingScreen/>
            }
            <div className="w-full h-[70px] flex justify-center items-center gap-4">

                <input type="text" placeholder="Search products..." className="w-[400px] h-[40px] rounded-lg p-2" value={query} onChange={(e)=>setQuery(e.target.value)}/>
                <button onClick={searchProducts} disabled={searching} className="w-[120px] h-[40px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                    {searching ? "Searching..." : "Search"}
                </button>
                <button onClick={()=>{
                    setQuery("")
                    setLoading(true)
                }} className="w-[120px] h-[40px] bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300">
                    All Products
                </button>
            </div>
            {
                !loading && <>
                    {
                        products.map((product)=>{
                            return (
                                <ProductCard key={product.id} product={product} key={product.productId}/>
                            )
                        })
                    }
                </>
            }
        </div>
    )
}