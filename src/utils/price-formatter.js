export default function  getFormattedPrice(price){

    //is price is a valid number
    if(price == null){
        return "N/A"
    }

    const priceInNumber = Number(price); //NaN
    
    if(isNaN(priceInNumber)){
        return "N/A"
    }else{
        
        return "LKR "+priceInNumber.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })    
        
    }

}
