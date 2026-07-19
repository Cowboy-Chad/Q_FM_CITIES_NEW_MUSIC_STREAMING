import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'
import FlameEffect from '../FlameEffect'
import FireworksEffect from '../FireworksEffect'
import SlidingSwitch from '../SlidingSwitch'
import AppHeader from '../layout/AppHeader'
import AppFooter from '../layout/AppFooter'
import Toast from '../layout/Toast'
import SubscriptionPage from '../SubscriptionPage'
import CitiesGrid from './CitiesGrid'

export default function CitiesPage({
  activeTheme,
  onThemeChange,
  fireworksEnabled,
  toast,
  showSubscription,
  isSubscribed,
  onShowSubscription,
  onSubscriptionSuccess,
}) {
  const themeClass = 'theme-' + activeTheme
  const navigate = useNavigate()
  const { selectCity } = usePlayer()

  function handleCitySelect(index) {
    selectCity(index)
    navigate('/city/' + index)
  }

  return (
    <div className={'app-container' + (themeClass ? ' ' + themeClass : '')}>
      <FlameEffect>
        <div className="station-icon" aria-hidden="true">
          <svg width="24" height="36" viewBox="0 0 24 36">
            <rect className="tower-base" x="4" y="30" width="16" height="4" rx="1" />
            <rect className="tower-body" x="10" y="8" width="4" height="22" rx="1" />
            <rect className="tower-bar" x="2" y="24" width="20" height="3" rx="1" />
            <rect className="tower-bar" x="4" y="18" width="16" height="3" rx="1" />
            <rect className="tower-bar" x="6" y="12" width="12" height="3" rx="1" />
            <rect className="tower-antenna" x="11" y="0" width="2" height="8" rx="1" />
          </svg>
        </div>
      </FlameEffect>
      {fireworksEnabled && <FireworksEffect />}
      <SlidingSwitch activeTheme={activeTheme} onThemeChange={onThemeChange} />
      <AppHeader
        title="Q-FM Cities"
        subtitle="The Sound of The Open Range"
        isSubscribed={isSubscribed}
        onSubscribeClick={() => onShowSubscription(true)}
      />
      <CitiesGrid onCitySelect={handleCitySelect} />
      <AppFooter />
      <Toast message={toast} />

      {showSubscription && (
        <SubscriptionPage
          onClose={() => onShowSubscription(false)}
          onSubscribe={onSubscriptionSuccess}
        />
      )}
    </div>
  )
}