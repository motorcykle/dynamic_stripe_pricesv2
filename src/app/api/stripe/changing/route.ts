import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const return_url = process.env.NEXT_BASE_URL + "/";

export async function POST(request: Request) {
  
  try {
    const data = await request.json();
    console.log(data)
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !data?.priceId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const _userSubscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));
    if (_userSubscriptions[0].stripePriceId == data?.priceId) {
      // trying to cancel at the billing portal
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: _userSubscriptions[0].stripeCustomerId,
        return_url,
      });
      return NextResponse.json({ url: stripeSession.url });
    }

    
    const subscriptionItems = await stripe.subscriptionItems.list({
      limit: 3,
      subscription: _userSubscriptions?.[0].stripeSubscriptionId!,
    });

    console.log(subscriptionItems.data[0].id)

    
    const subscription = await stripe.subscriptions.update(
      _userSubscriptions?.[0].stripeSubscriptionId!,
      {
        items: [
          {
            id: subscriptionItems.data[0].id,
            price: data?.priceId,
          },
        ],
        metadata: {
          userId,
        }
      }
    );

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: _userSubscriptions[0].stripeCustomerId,
      return_url,
    });
    return NextResponse.json({ url: stripeSession.url });
    
  } catch (error) {
    console.log("stripe error", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}