import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Membership from '../components/Membership'
import useAuth from '../hooks/useAuth'
import useSubscription from '../hooks/useSubscription'
import { goToBillingPortal, payments } from '../lib/stripe'

interface Props {
  products: Product[]
}

const account = ({ products }: Props) => {
  const { user, logout } = useAuth()
  const subscription = useSubscription(user)

  return (
    <div>
      <Head>
        <title>Netflix - Account</title>
      </Head>
      <header>
        <Link href="/">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}NetflixLogo.svg`}
            width={90}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>
        <Link href="/account">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}account.png`}
            className="cursor-pointer object-contain"
          />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col items-center gap-x-4 md:flex-row">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="flex items-center space-x-2">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}membersince.svg`}
              alt=""
              className="h-7 w-7"
            />
            <p className="text-sm font-semibold text-[#555]">
              Member since {subscription?.created}
            </p>
          </div>
        </div>
        <Membership />
        <div className="accountGrid">
          <h1>Plan Details</h1>
          <div>
            {
              products?.filter(
                (product) => product.id === subscription?.product
              )?.[0]?.name
            }
          </div>
          <div className="membershipLink" onClick={goToBillingPortal}>
            Change Plan
          </div>
        </div>
      </main>
    </div>
  )
}

export default account

export const getStaticProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((product) => product)
    .catch((error) => console.log(error.message))

  return {
    props: {
      products,
    },
  }
}
