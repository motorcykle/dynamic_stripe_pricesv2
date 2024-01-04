"use client"

import { SignInButton, useSession } from "@clerk/nextjs";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SubscriptionBtn ({ currentStatus, product }: { product: any, currentStatus: any }) {
    const { isSignedIn } = useSession()
    const router = useRouter()

    async function subscribeToPrice (priceId: string ) {
        try {
            console.log("****", priceId)
            const res = await axios.post("/api/stripe/subbing", {
                priceId
            })
            
            router.push(res?.data?.url)
        } catch (error) {
            console.log(error)
        }
    }

    async function upgradeOrDowngrade (priceId: string ) {
        try {
            console.log("****", priceId)
            const res = await axios.post("/api/stripe/changing", {
                priceId
            })
            
            console.log(res)
            router.push(res?.data?.url)
        } catch (error) {
            console.log(error)
        }
    }

    const notSubscribed = !currentStatus?.[0];

    if (!isSignedIn) return <SignInButton />
    

    // subscribe

    if (notSubscribed) {
        return (
            <Button onClick={() => subscribeToPrice(product?.default_price)} variant={"outline"}>{"Upgrade to " + product?.name}</Button>
        )
    }

    // Subid: {currentStatus.stripeSubscriptionId} Priceid: {currentStatus.stripePriceId}
    // Upgrade / downgrade
    if (!notSubscribed) {
        return (
            <Button onClick={() => upgradeOrDowngrade(product?.default_price)} disabled={currentStatus?.[0].stripePriceId == product?.default_price}>Sub to this plan</Button>
        )
    }
}