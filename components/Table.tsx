import { CheckIcon } from '@heroicons/react/outline'
import { Product } from '@stripe/firestore-stripe-payments'
import React from 'react'

interface Table {
  products: Product[]
  selectedPlan: Product | null
}

const Table = ({ products, selectedPlan }: Table) => {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <tr className="tableRow">
          <td className="tableDataTitle">Monthly Price</td>

          {products?.map((product) => (
            <td
              key={product?.id}
              className={`tableDataFeatures ${
                selectedPlan?.id === product?.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
            >
              PKR {product?.prices?.[0]?.unit_amount! / 100}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">Video Quality</td>

          {products?.map((product) => (
            <td
              key={product?.id}
              className={`tableDataFeatures ${
                selectedPlan?.id === product?.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
            >
              {product?.metadata?.videoQuality}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">Resolution</td>

          {products?.map((product) => (
            <td
              key={product?.id}
              className={`tableDataFeatures ${
                selectedPlan?.id === product?.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
            >
              {product?.metadata?.resolution}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">
            Watch on your TV, Computer, Mobile phone and Tablet
          </td>

          {products?.map((product) => (
            <td
              key={product?.id}
              className={`tableDataFeatures ${
                selectedPlan?.id === product?.id
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
            >
              {product?.metadata?.portability && (
                <CheckIcon className="inline-block h-8 w-8" />
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default Table
