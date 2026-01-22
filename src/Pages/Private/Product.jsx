import { useForm } from "react-hook-form";
import { ProductSchema } from "./Schema/Product.schema";

const Product = () => {
    const {register, handleSubmit} = useForm ({
        resolver : zodResolver(ProductSchema),

    });


    const productSave = (data) => {
        console.log(data);
    };


    return (
    <>
    <form onSubmit ={handleSubmit(productSave)}>
        <label>Product Name</label>
        <input{...register("productName")} type="text" placeholder="enter product name">
        {errors.ProductName && <p>{errors.ProductName.message}</p>}
        </input>
        <label>Product Quantity</label>
        <input {...register("productQuantity")} type="number" placeholder="enter product quantity">
        </input>
        <label>Product Number</label>
        <input {...register("productNumber")} type="number" placeholder="enter product Number">
        </input>
        <label>Product manufacture date</label>
        <input {...register("productManufactureDate")} type="number" placeholder="enter product manufacture date">
        </input>
        <label>Product expiry date</label>
        <input {...register("productExpirydate")} type="number" placeholder="enter product expiry date">
        </input>
        
        
    </form>



    </>
    )
};

export default Product;

