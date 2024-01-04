import { userSubscriptions } from "@/lib/db/schema";
import SubscriptionBtn from "./SubscriptionBtn";
import { Button } from "./ui/button";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import axios from "axios";

export default async function Product({ product }: { product: any }) {
    const { userId } = await auth();
    const user = await currentUser();
    const return_url = process.env.NEXT_BASE_URL + "/";

    let _userSubscriptions = userId ? await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions?.userId!, userId!)) : []

    return <div className=" border rounded-md p-5 mt-5 hover:bg-slate-800">
        <img className=" max-w-28 max-h-28" src={product?.images?.[0]} alt="" />
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <SubscriptionBtn product={product} currentStatus={_userSubscriptions}/>
    </div>
}