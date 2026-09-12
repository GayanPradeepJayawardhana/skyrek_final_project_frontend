import { useState } from "react"
import { getTotal } from "../utils/cart"
import getFormattedPrice from "../utils/price-formatter"
import { useLocation } from "react-router-dom"
import CreateOrder from "../components/createOrder"

export default function CheckoutPage(){

    const location = useLocation()
    const data = location.state
    const [cart , setCart] = useState(data)

    return (
        <div className="w-full h-full overflow-y-scroll flex items-center flex-col">
            {
                cart.map(
                    (cartItem, index) => {
                        return (
                            <div className="w-[400px] lg:w-[600px] h-[250px] lg:h-[150px]  shadow-2xl bg-white my-4 flex flex-row relative" key={index}>
                                <img src={cartItem.product.image} className="h-full aspect-square"/>
                            
                                <div className="h-full  w-[450px] flex flex-col  p-4">
                                    <h3 className="text-lg font-bold">{cartItem.product.name}</h3>
                                    {/* labelled price */}
                                    <p className="text-gray-500 text-sm line-through">{getFormattedPrice(cartItem.product.labelledPrice)}</p>
                                    <p className="text-accent font-semibold">{getFormattedPrice(cartItem.product.price)}</p>
                                    <div className="h-[30px] w-[100px] mt-2 border border-accent rounded-4xl flex flex-row items-center justify-center overflow-hidden">
                                        <button className="w-[30px] h-full hover:bg-accent hover:text-white"
                                        onClick={
                                            ()=>{
                                                const newCart = [...cart]
                                                const newQty = newCart[index].qty - 1

                                                if(newQty > 0){
                                                    newCart[index].qty = newQty
                                                    setCart(newCart)
                                                }
                                            }
                                        }>
                                            -
                                        </button>
                                        <span className="w-[40px] h-full flex justify-center items-center">
                                            {cartItem.qty}
                                        </span>
                                        <button className="w-[30px] h-full hover:bg-accent hover:text-white"
                                        onClick={
                                            ()=>{
                                                const newCart = [...cart]

                                                // const newCart = {...cart}

                                                newCart[index].qty = newCart[index].qty + 1

                                                setCart(newCart)
                                            }
                                        }>
                                            +
                                        </button>
                                    </div>
                                </div>
                                
                                {/* total price */}
                                <span className="absolute bottom-2 text-xl right-2 text-accent font-semibold">
                                    {getFormattedPrice(cartItem.product.price * cartItem.qty)}
                                </span>
                            </div>
                        )
                    }
                )
            }

            <div className="w-[400px] lg:w-[600px] h-[150px] sticky bottom-0  shadow-2xl bg-white my-4 flex flex-row items-center justify-between p-4">
                <CreateOrder cart={cart} />
                <div className="flex justify-end h-full items-center">
                    <span className="text-gray-500 text-lg mr-4 hidden lg:block">Total:</span>
                    <span className="text-accent lg:text-2xl font-bold ">
                        {getFormattedPrice(getTotal(cart))}
                    </span>
                </div>
            </div>
        </div>
    )
}