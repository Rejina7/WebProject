import z from "zod";

export const ProductSchema=z.object({
    productName:z.string().nonempty({message:"Product Name required"}),
    productType:z.string().nonempty({message:"Product type required"}),
    productPrice:z.string().nonempty({message:"Price is required"}),
    productQuantity:z.string().nonempty({message:"Quantity is required"})
})