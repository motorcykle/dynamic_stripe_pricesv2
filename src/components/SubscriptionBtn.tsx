"use client"

import { Button } from "./ui/button";

export default function SubscriptionBtn ({ currentStatus, product }: { product: any, currentStatus: any }) {

    console.log(currentStatus, product)

    const notSubscribed = !currentStatus[0];

    return (
        <Button variant={"outline"}>{notSubscribed && "Upgrade to " + product?.name}</Button>
    )
}