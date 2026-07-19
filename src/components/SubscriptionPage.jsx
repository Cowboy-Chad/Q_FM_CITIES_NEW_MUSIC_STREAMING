import { useState } from 'react'
import FakePayPal from './FakePayPal'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    label: 'forever',
    popular: false,
    features: [
      'Browse all city stations',
      'Listen to preview clips',
      'Basic search',
      'Community radio streams',
    ],
    disabled: ['High-quality audio (128kbps+)', 'Offline listening', 'Custom playlists', 'No ads', 'Priority support'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    label: '/month',
    popular: false,
    features: [
      'All Free features',
      'High-quality audio (320kbps)',
      'Unlimited skips',
      'No advertisements',
      'Custom playlists',
    ],
    disabled: [],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 79.99,
    label: '/year (save 33%)',
    popular: true,
    features: [
      'All Monthly features',
      'Offline listening',
      'Exclusive artist content',
      'Priority customer support',
      'Early access to new cities',
    ],
    disabled: [],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 199.99,
    label: 'one-time',
    popular: false,
    features: [
      'All Yearly features',
      'Lifetime access',
      'All future content updates',
      'Supporter badge on profile',
      'Direct line to the artist',
    ],
    disabled: [],
  },
]

export default function SubscriptionPage({ onClose, onSubscribe }) {
  const [showPayPal, setShowPayPal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  function handleSubscribe(plan) {
    if (plan.id === 'free') {
      onClose()
      return
    }
    setSelectedPlan(plan)
    setShowPayPal(true)
  }

  function handlePayPalSuccess(plan) {
    setShowPayPal(false)
    if (onSubscribe) onSubscribe(plan)
    onClose()
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget && !showPayPal) {
      onClose()
    }
  }

  // If FakePayPal is open, render it on top
  if (showPayPal && selectedPlan) {
    return (
      <FakePayPal
        onClose={() => { setShowPayPal(false); setSelectedPlan(null) }}
        onSuccess={handlePayPalSuccess}
      />
    )
  }

  return (
    <div className="sub-overlay" onClick={handleOverlayClick}>
      <div className="sub-modal">
        {/* Close button */}
        <button className="sub-close" onClick={onClose} aria-label="Close">&times;</button>

        {/* Header */}
        <div className="sub-header">
          <h2 className="sub-title">Subscription Options</h2>
        </div>

        {/* Plans grid */}
        <div className="sub-plans">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={'sub-plan-card' + (plan.popular ? ' popular' : '') + (plan.id === 'free' ? ' free' : '')}
            >
              {plan.popular && <div className="sub-plan-badge">Most Popular</div>}

              <div className="sub-plan-header">
                <div className="sub-plan-name">{plan.name}</div>
                <div className="sub-plan-price">
                  {plan.price === 0 ? (
                    <span className="sub-plan-free">Free</span>
                  ) : (
                    <>
                      <span className="sub-plan-currency">$</span>
                      {plan.price.toFixed(2)}
                    </>
                  )}
                </div>
                <div className="sub-plan-label">{plan.label}</div>
              </div>

              <ul className="sub-plan-features">
                {plan.features.map((f, i) => (
                  <li key={i} className="sub-feature-included">
                    <span className="sub-feature-icon">&#x2713;</span> {f}
                  </li>
                ))}
                {plan.disabled.map((f, i) => (
                  <li key={i} className="sub-feature-disabled">
                    <span className="sub-feature-icon">&times;</span> {f}
                  </li>
                ))}
              </ul>

              <button
                className={'sub-plan-btn' + (plan.id === 'free' ? ' sub-plan-btn--outline' : '')}
                onClick={() => handleSubscribe(plan)}
              >
                {plan.id === 'free' ? 'Current Plan' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sub-footer">
          <span className="sub-footer-secure">&#x1F512; Secure checkout powered by FakePayPal&trade;</span>
          <span className="sub-footer-cancel">Cancel anytime &middot; No questions asked</span>
        </div>
      </div>
    </div>
  )
}