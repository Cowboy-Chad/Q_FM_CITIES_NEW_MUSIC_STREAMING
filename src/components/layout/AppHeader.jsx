import React from 'react'

export default function AppHeader({ title, subtitle, isSubscribed, onSubscribeClick }) {
  return (
    <div className="app-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button
        className={'header-sub-btn' + (isSubscribed ? ' subscribed' : '')}
        onClick={onSubscribeClick}
        title={isSubscribed ? 'Manage your subscription' : 'Subscribe to Premium'}
      >
        <span className="header-sub-btn-icon">{isSubscribed ? '\u2714\uFE0F' : '\u2B50'}</span>
        <span className="header-sub-btn-label">{isSubscribed ? 'Premium' : 'Subscribe'}</span>
      </button>
    </div>
  )
}