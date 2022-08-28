import { CheckIcon } from '@heroicons/react/outline'
import { Product } from '@stripe/firestore-stripe-payments'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import loadCheckouts from '../lib/stripe'
import Loader from './Loader'
import Table from './Table'

interface list {
  title: string
}

interface Props {
  products: Product[]
}

const Plan = ({ products }: Props) => {
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2])
  const [isBillingLoading, setIsBillingLoading] = useState(false)

  const { logout, user } = useAuth()

  const list = ({ title }: list) => (
    <li className="flex items-center gap-x-2">
      <CheckIcon className="h-7 w-7 text-[#E50914]" />
      {title}
    </li>
  )

  const subscribePlan = () => {
    if (!user) return

    loadCheckouts(selectedPlan?.prices?.[0]?.id!)
    setIsBillingLoading(true)
  }

  return (
    <div>
      <Head>
        <title>Netflix</title>
      </Head>
      <header className="border-b border-white/10 bg-[#141414] px-6 py-2 lg:px-10 lg:py-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}NetflixLogo.svg`}
          width={150}
          height={90}
          className="cursor-pointer object-contain"
        />
        <button
          onClick={logout}
          className="text-lg font-medium hover:underline"
        >
          Sign Out
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that's right for you
        </h1>
        <ul className="mt-30">
          {list({ title: 'Watch all you want. Ad-free' })}
          {list({ title: 'Recommendation just for you' })}
          {list({ title: 'Change or cancel your plan anytime' })}
        </ul>
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center justify-center self-end md:w-3/5">
            {products?.map((product: Product) => (
              <div
                key={product.id}
                className={`planCard ${
                  selectedPlan?.id === product?.id
                    ? 'opacity-100'
                    : 'opacity-60'
                }`}
                onClick={() => setSelectedPlan(product)}
              >
                {product.name}
              </div>
            ))}
          </div>

          <Table products={products} selectedPlan={selectedPlan} />
          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded  bg-[#E50914] py-4 text-sm shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribePlan}
          >
            {isBillingLoading ? <Loader color="#fff" /> : 'Subscribe'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Plan
