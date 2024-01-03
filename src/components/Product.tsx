import { userSubscriptions } from "@/lib/db/schema";
import SubscriptionBtn from "./SubscriptionBtn";
import { Button } from "./ui/button";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";

export default async function Product({ product }: { product: any }) {
    const { userId } = await auth();
    const user = await currentUser();
    const return_url = process.env.NEXT_BASE_URL + "/";

    let _userSubscriptions = userId ? await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions?.userId!, userId!)) : []

    async function subscribeToPrice ({priceId}: { priceId: string }) {
        "use server";

        try {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: return_url,
                cancel_url: return_url,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user?.emailAddresses[0].emailAddress,
                line_items: [
                  {
                    price: priceId,
                    quantity: 1,
                  },
                ],
                metadata: {
                  userId,
                },
              });

            return stripeSession?.url
        } catch (error) {
            console.log(error)
        } 
    }

    return <div className=" border rounded-md p-5 mt-5 hover:bg-slate-800">
        <img className=" max-w-28 max-h-28" src={product?.images?.[0]} alt="" />
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <SubscriptionBtn subFunction={subscribeToPrice} product={product} currentStatus={_userSubscriptions}/>
    </div>
}