import { useState, useEffect, useCallback } from 'react'

const FAKE_PLANS = [
  { id: 'monthly', name: 'Monthly Subscription', price: 9.99, label: '/month' },
  { id: 'yearly', name: 'Yearly Subscription', price: 79.99, label: '/year (save 33%)' },
  { id: 'lifetime', name: 'Lifetime Access', price: 199.99, label: 'one-time' },
]

const CARD_TYPES = [
  { pattern: /^4/, name: 'Visa', color: '#1A1F71' },
  { pattern: /^5[1-5]/, name: 'Mastercard', color: '#EB001B' },
  { pattern: /^3[47]/, name: 'Amex', color: '#2E77BC' },
  { pattern: /^6(?:011|5)/, name: 'Discover', color: '#FF6000' },
]

function detectCardType(number) {
  const clean = number.replace(/\D/g, '')
  return CARD_TYPES.find(t => t.pattern.test(clean)) || null
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  const groups = []
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4))
  }
  return groups.join(' ')
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2)
  }
  return digits
}

export default function FakePayPal({ onClose, onSuccess }) {
  const [step, setStep] = useState('plans') // plans | card | processing | success | error
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card') // card | paypal
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [errors, setErrors] = useState({})
  const [progress, setProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const detectedCard = detectCardType(cardNumber)

  // Processing animation
  useEffect(() => {
    if (step !== 'processing') return
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 15 + 5
      })
    }, 300)
    return () => clearInterval(interval)
  }, [step])

  // Auto-advance after processing completes
  useEffect(() => {
    if (step === 'processing' && progress >= 100) {
      const timer = setTimeout(() => {
        setStep('success')
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
          if (onSuccess) onSuccess(selectedPlan)
          onClose()
        }, 2500)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [step, progress, selectedPlan, onSuccess, onClose])

  const validateCard = useCallback(() => {
    const errs = {}
    const cleanNum = cardNumber.replace(/\D/g, '')
    if (cleanNum.length < 13 || cleanNum.length > 16) {
      errs.cardNumber = 'Enter a valid card number'
    }
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      errs.cardExpiry = 'Enter a valid expiry (MM/YY)'
    } else {
      const [mm, yy] = cardExpiry.split('/').map(Number)
      if (mm < 1 || mm > 12) errs.cardExpiry = 'Invalid month'
      const now = new Date()
      const expYear = 2000 + yy
      const expMonth = mm
      if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
        errs.cardExpiry = 'Card has expired'
      }
    }
    if (cardCvv.replace(/\D/g, '').length < 3) {
      errs.cardCvv = 'Enter a valid CVV'
    }
    if (cardName.trim().length < 2) {
      errs.cardName = 'Enter the cardholder name'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [cardNumber, cardExpiry, cardCvv, cardName])

  function handlePay() {
    if (!validateCard()) return
    setStep('processing')
  }

  function selectPlan(plan) {
    setSelectedPlan(plan)
    setStep('card')
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget && step !== 'processing') {
      onClose()
    }
  }

  // Confetti particles
  const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 0.8 + Math.random() * 1.2,
    color: ['#FFD700', '#0070BA', '#FFC439', '#00A0E9', '#ffffff'][Math.floor(Math.random() * 5)],
    size: 6 + Math.random() * 10,
  }))

  return (
    <div className="paypal-overlay" onClick={handleOverlayClick}>
      {/* Confetti */}
      {showConfetti && (
        <div className="paypal-confetti">
          {confettiPieces.map(p => (
            <div
              key={p.id}
              className="paypal-confetti-piece"
              style={{
                left: p.left + '%',
                animationDelay: p.delay + 's',
                animationDuration: p.duration + 's',
                background: p.color,
                width: p.size + 'px',
                height: p.size + 'px',
              }}
            />
          ))}
        </div>
      )}

      <div className="paypal-modal">
        {/* Close button */}
        <button
          className="paypal-close"
          onClick={onClose}
          disabled={step === 'processing'}
          aria-label="Close"
        >
          &times;
        </button>

        {/* PayPal Logo */}
        <div className="paypal-logo">
          <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M320 30c0-16.6-13.4-30-30-30H180l-40 100h40l15-40h55c16.6 0 30-13.4 30-30z" fill="#003087"/>
            <path d="M320 30c0-16.6-13.4-30-30-30H180l-40 100h40l15-40h55c16.6 0 30-13.4 30-30z" fill="#009CDE" opacity="0.6"/>
            <path d="M250 30c0-16.6-13.4-30-30-30H130L90 100h40l15-40h55c16.6 0 30-13.4 30-30z" fill="#003087"/>
            <path d="M250 30c0-16.6-13.4-30-30-30H130L90 100h40l15-40h55c16.6 0 30-13.4 30-30z" fill="#009CDE" opacity="0.6"/>
            <path d="M180 30c0-16.6-13.4-30-30-30H60L20 100h40l15-40h55c16.6 0 30-13.4 30-30z" fill="#003087"/>
          </svg>
        </div>

        {/* STEP: Plans */}
        {step === 'plans' && (
          <div className="paypal-step">
            <h2 className="paypal-title">PAYPAL PROCESSING</h2>
            <p className="paypal-subtitle">Place Real PayPal Backend Here.</p>
            <div className="paypal-plans">
              {FAKE_PLANS.map(plan => (
                <button
                  key={plan.id}
                  className={'paypal-plan' + (selectedPlan?.id === plan.id ? ' selected' : '')}
                  onClick={() => selectPlan(plan)}
                >
                  <div className="paypal-plan-name">{plan.name}</div>
                  <div className="paypal-plan-price">
                    <span className="paypal-plan-currency">$</span>
                    {plan.price.toFixed(2)}
                  </div>
                  <div className="paypal-plan-label">{plan.label}</div>
                </button>
              ))}
            </div>
            <div className="paypal-guarantee">
              <span>&#x1F512;</span> Secure checkout &middot; Cancel anytime
            </div>
          </div>
        )}

        {/* STEP: Card Details */}
        {step === 'card' && selectedPlan && (
          <div className="paypal-step">
            <h2 className="paypal-title">Complete your payment</h2>
            <p className="paypal-subtitle">
              {selectedPlan.name} &mdash; <strong>${selectedPlan.price.toFixed(2)}</strong> {selectedPlan.label}
            </p>

            {/* Payment method toggle */}
            <div className="paypal-method-toggle">
              <button
                className={'paypal-method-btn' + (paymentMethod === 'card' ? ' active' : '')}
                onClick={() => setPaymentMethod('card')}
              >
                <span className="paypal-method-icon">&#x1F4B3;</span> Card
              </button>
              <button
                className={'paypal-method-btn' + (paymentMethod === 'paypal' ? ' active' : '')}
                onClick={() => setPaymentMethod('paypal')}
              >
                <span className="paypal-method-icon">P</span> PayPal
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="paypal-card-form">
                {/* Card Number */}
                <div className="paypal-field">
                  <label>Card number</label>
                  <div className="paypal-input-wrapper">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      className={errors.cardNumber ? 'error' : ''}
                      maxLength={19}
                    />
                    {detectedCard && (
                      <span className="paypal-card-type" style={{ color: detectedCard.color }}>
                        {detectedCard.name}
                      </span>
                    )}
                  </div>
                  {errors.cardNumber && <span className="paypal-field-error">{errors.cardNumber}</span>}
                </div>

                {/* Expiry + CVV row */}
                <div className="paypal-field-row">
                  <div className="paypal-field">
                    <label>Expiry</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      className={errors.cardExpiry ? 'error' : ''}
                      maxLength={5}
                    />
                    {errors.cardExpiry && <span className="paypal-field-error">{errors.cardExpiry}</span>}
                  </div>
                  <div className="paypal-field">
                    <label>CVV</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="123"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={errors.cardCvv ? 'error' : ''}
                      maxLength={4}
                    />
                    {errors.cardCvv && <span className="paypal-field-error">{errors.cardCvv}</span>}
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="paypal-field">
                  <label>Cardholder name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className={errors.cardName ? 'error' : ''}
                  />
                  {errors.cardName && <span className="paypal-field-error">{errors.cardName}</span>}
                </div>

                <button className="paypal-pay-btn" onClick={handlePay}>
                  Pay ${selectedPlan.price.toFixed(2)}
                </button>
              </div>
            ) : (
              <div className="paypal-paypal-login">
                <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
                  You'll be redirected to PayPal to log in and confirm your payment.
                </p>
                <button className="paypal-pay-btn paypal-pay-btn--paypal" onClick={() => setStep('processing')}>
                  <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" fill="#003087"/>
                    <path d="M19.23 6.534c-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287z" fill="#009CDE" opacity="0.6"/>
                  </svg>
                  Continue with PayPal
                </button>
              </div>
            )}

            <button className="paypal-back-btn" onClick={() => setStep('plans')}>
              &larr; Back to plans
            </button>
          </div>
        )}

        {/* STEP: Processing */}
        {step === 'processing' && (
          <div className="paypal-step paypal-step--processing">
            <div className="paypal-processing-spinner">
              <svg viewBox="0 0 50 50" className="paypal-spinner-svg">
                <circle cx="25" cy="25" r="20" fill="none" stroke="#e6e6e6" strokeWidth="4" />
                <circle
                  cx="25" cy="25" r="20" fill="none"
                  stroke="#0070BA" strokeWidth="4"
                  strokeDasharray={`${progress * 1.256} 125.6`}
                  strokeLinecap="round"
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <div className="paypal-processing-percent">{Math.round(progress)}%</div>
            </div>
            <h2 className="paypal-title">Processing payment...</h2>
            <p className="paypal-subtitle">Please don't close this window</p>
            <div className="paypal-processing-bar">
              <div className="paypal-processing-fill" style={{ width: progress + '%' }} />
            </div>
            <div className="paypal-processing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* STEP: Success */}
        {step === 'success' && (
          <div className="paypal-step paypal-step--success">
            <div className="paypal-success-check">
              <svg viewBox="0 0 50 50" width="60" height="60">
                <circle cx="25" cy="25" r="23" fill="#2ecc71" />
                <path d="M14 27l7 7 15-15" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="paypal-title">Payment successful!</h2>
            <p className="paypal-subtitle">
              Thank you for your {selectedPlan?.name?.toLowerCase() || 'subscription'}.
            </p>
            <div className="paypal-success-amount">
              ${selectedPlan?.price?.toFixed(2) || '0.00'}
            </div>
            <p className="paypal-success-receipt">
              A receipt has been sent to your email.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="paypal-footer">
          <svg viewBox="0 0 50 16" width="50" height="16">
            <rect x="0" y="0" width="50" height="16" rx="2" fill="#1A1F71" />
            <text x="25" y="12" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">VISA</text>
          </svg>
          <svg viewBox="0 0 50 16" width="50" height="16">
            <rect x="0" y="0" width="50" height="16" rx="2" fill="#EB001B" />
            <text x="25" y="12" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">MC</text>
          </svg>
          <svg viewBox="0 0 50 16" width="50" height="16">
            <rect x="0" y="0" width="50" height="16" rx="2" fill="#2E77BC" />
            <text x="25" y="12" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">AMEX</text>
          </svg>
          <span className="paypal-footer-secure">&#x1F512; Secured by PayPal</span>
        </div>
      </div>
    </div>
  )
}
