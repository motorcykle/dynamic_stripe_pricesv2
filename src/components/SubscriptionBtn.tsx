"use client"

import { SignInButton, useSession } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function SubscriptionBtn ({ currentStatus, product, subFunction }: { product: any, currentStatus: any, subFunction: any }) {
    const session = useSession()

    console.log(currentStatus, product)

    const notSubscribed = !currentStatus?.[0];

    if (!session) return <SignInButton />

    if (notSubscribed) {
        return (
            <Button onClick={() => subFunction(product?.default_price)} variant={"outline"}>{"Upgrade to " + product?.name}</Button>
        )
    }

    // Subid: {currentStatus.stripeSubscriptionId} Priceid: {currentStatus.stripePriceId}

    if (!notSubscribed) {
        return (
            <Button disabled={currentStatus.stripePriceId == product?.default_price}>Sub to this plan</Button>
        )
    }
}