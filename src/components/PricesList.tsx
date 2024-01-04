import { stripe } from "@/lib/stripe";
import Product from "./Product";

export default async function PricesList() {
    
    // const prices = await stripe.prices.list();
    const products = await (await stripe.products.list()).data?.filter(prod => prod.active)

    return <div className="">
        {products?.map(product => <Product key={product.id} product={product} />)}
    </div>
}