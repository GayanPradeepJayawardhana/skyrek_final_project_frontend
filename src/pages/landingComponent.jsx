export default function LandingPage(){
    return(
        <div className="w-full h-full relative ">
            <video src="720p.mp4" autoPlay muted loop className="w-full h-full object-cover"/>
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Welcome to iComputers</h1>
                    <p className="text-lg mb-8">Your one-stop shop for all your computer needs.</p>
                    <a href="/products" className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition duration-300">Shop Now</a>
                </div>
            </div>
        </div>
    )
}
