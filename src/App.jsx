import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PlayerProvider } from './context/PlayerContext'
import ErrorBoundary from './components/ErrorBoundary'

const CitiesPage = lazy(() => import('./components/cities/CitiesPage'))
const CityPlayerPage = lazy(() => import('./components/cities/CityPlayerPage'))

function AppShell() {
  const [activeTheme, setActiveTheme] = useState(() => {
    try { return localStorage.getItem('qfm-theme') || 'mediumGray' }
    catch { return 'mediumGray' }
  })
  const [fireworksEnabled, setFireworksEnabled] = useState(true)
  const [showSubscription, setShowSubscription] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(() => {
    try { return localStorage.getItem('qfm-subscribed') === 'true' }
    catch { return false }
  })
  const [subscribedPlan, setSubscribedPlan] = useState(() => {
    try { return localStorage.getItem('qfm-sub-plan') || null }
    catch { return null }
  })

  // Persist theme to localStorage
  useEffect(() => {
    try { localStorage.setItem('qfm-theme', activeTheme) }
    catch { /* ignore */ }
  }, [activeTheme])

  // Persist subscription state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('qfm-subscribed', String(isSubscribed))
      if (subscribedPlan) {
        localStorage.setItem('qfm-sub-plan', subscribedPlan)
      } else {
        localStorage.removeItem('qfm-sub-plan')
      }
    }
    catch { /* ignore */ }
  }, [isSubscribed, subscribedPlan])

  function handleThemeChange(theme) {
    setFireworksEnabled(false)
    setActiveTheme(theme)
  }

  function handleSubscriptionSuccess(plan) {
    setIsSubscribed(true)
    setSubscribedPlan(plan.name)
    setShowSubscription(false)
  }

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <CitiesPage
              activeTheme={activeTheme}
              onThemeChange={handleThemeChange}
              fireworksEnabled={fireworksEnabled}
              showSubscription={showSubscription}
              isSubscribed={isSubscribed}
              onShowSubscription={setShowSubscription}
              onSubscriptionSuccess={handleSubscriptionSuccess}
            />
          }
        />
        <Route
          path="/city/:cityId"
          element={
            <CityPlayerPage
              activeTheme={activeTheme}
              showSubscription={showSubscription}
              isSubscribed={isSubscribed}
              onThemeChange={handleThemeChange}
              setShowSubscription={setShowSubscription}
              handleSubscriptionSuccess={handleSubscriptionSuccess}
            />
          }
        />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <ErrorBoundary>
          <AppShell />
        </ErrorBoundary>
      </PlayerProvider>
    </BrowserRouter>
  )
}
