import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import useSubscription from '../hooks/useSubscription'
import { goToBillingPortal } from '../lib/stripe'
import Loader from './Loader'

const Membership = () => {
  const [isBillingLoading, setIsBillingLoading] = useState(false)
  const { user } = useAuth()
  const subscription = useSubscription(user)

  const manageSubscription = () => {
    if (subscription) {
      goToBillingPortal()
      setIsBillingLoading(true)
    }
  }
  return (
    <div className="accountGrid">
      <div className="space-y-2 py-4">
        <h4>Membership & Billing</h4>
        <button
          disabled={isBillingLoading || !subscription}
          className="h-10 w-3/5 whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5"
          onClick={manageSubscription}
        >
          {isBillingLoading ? <Loader color="#e50914" /> : 'Cancel Membership'}
        </button>
      </div>
      <div className="col-span-3">
        <div className="flex flex-col items-center justify-between border-b border-white/10 py-4 md:flex-row">
          <div>
            <div>{user?.email}</div>
            <div>Password: *******</div>
          </div>
          <div className="md:text-right">
            <p className="membershipLink">Change Email</p>
            <p className="membershipLink">Change Password</p>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0">
          <div>
            <p>
              {subscription?.cancel_at_period_end
                ? 'Your membership will end on '
                : 'Your next billing date is '}
              {subscription?.current_period_end}
            </p>
          </div>
          <div className="md:text-right">
            <p className="membershipLink">Manage payment info</p>
            <p className="membershipLink">Add backup payment method</p>
            <p className="membershipLink">Billing Details</p>
            <p className="membershipLink">Change billing day</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Membership
