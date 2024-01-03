import PricesList from '@/components/PricesList'
import SubOrBilling from '@/components/SubOrBilling'
import { Button } from '@/components/ui/button'
import { checkSubscription } from '@/lib/subscription'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default async function Home() {
  const isSEOSTAR = await checkSubscription()

  return (
    <main className="">
      <div className="prices">
        {/* 
          We list out all the prices and check if you're subscribed to any if not,
          we show you're on a free plan,
          we have three plans 1. free plan, 2. basic plan, 3. premium plan,
          if you're subscribed already we have to to do a change in your sub item ref(https://stripe.com/docs/billing/subscriptions/upgrade-downgrade),
          we would have to put it in your webhook and update the DB aswell (user_subscription)

          ### this is the only function of this app, making this feature of badically subscribing and upgrading or downgrading!
          ### good luck
        */}

        {/* LIST PRICES */}
        <SignedIn>
          <UserButton afterSignOutUrl="/"/>  
        </SignedIn>
        
        <SignedOut>
          <SignInButton>
          <Button>Log in</Button>
          </SignInButton>
        </SignedOut>

        <PricesList />

      </div>
    </main>
  )
}
