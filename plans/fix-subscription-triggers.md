# Plan: Restrict Subscription Modal to "Sub" Button Only

## Problem

The subscription modal (`showSubscription` state) is currently triggered from **three** places in [`react.jsx`](/home/cowboy-chad/Music/code/q-fm-cities-com/react.jsx), but the user wants it to **only** open from the **"Sub" button** in the player controls.

## Current Triggers (All Need Removal Except the "Sub" Button)

| # | Location | UI Element | Line | Action |
|---|----------|-----------|------|--------|
| 1 | Cities View (grid) | CTA banner "Subscribe" button | 463 | ❌ Remove |
| 2 | Player View (controls) | **"Sub" button** (`.btn-sub`) | 545 | ✅ KEEP |
| 3 | Player View (controls) | Gear/settings button (`.btn-set`) | 558 | ❌ Remove |

## Changes Required

### File: [`react.jsx`](/home/cowboy-chad/Music/code/q-fm-cities-com/react.jsx)

#### Change 1: CTA Banner — Remove subscription trigger from the button

**Location:** Lines 456-466 (Cities View)

**Current behavior:** The CTA banner has a "Subscribe" / "Manage" button that calls `setShowSubscription(true)`.

**Desired behavior:** The CTA banner should remain visible as an informational element, but its button should no longer open the subscription modal. Instead, the button should either:
- **Option A:** Be removed entirely (banner becomes a static info bar)
- **Option B:** Be replaced with a non-functional indicator (e.g., a plain badge/status display)

**Recommended: Option A** — Remove the button entirely and keep the banner as a static informational bar. The banner already shows the subscription status, so it's still useful.

#### Change 2: Gear/Settings Button — Remove subscription trigger

**Location:** Lines 556-562 (Player View)

**Current behavior:** The gear/settings button (`.btn-set`) calls `setShowSubscription(true)` when clicked.

**Desired behavior:** The gear/settings button should either:
- **Option A:** Be removed entirely if it has no other function
- **Option B:** Be repurposed for a different action (e.g., open settings, show track info, etc.), or simply do nothing

**Recommended: Option A** — Remove the gear/settings button entirely since it only existed to open the subscription modal. The "Sub" button is the dedicated subscription access point.

#### Change 3: No changes to the "Sub" button

**Location:** Lines 543-550 (Player View)

The `.btn-sub` button already correctly triggers `setShowSubscription(true)`. No changes needed here.

### File: [`style.css`](/home/cowboy-chad/Music/code/q-fm-cities-com/style.css)

#### Change 3: Remove CSS for `.btn-set` (if gear button is removed)

**Location:** Lines 527-610

If the gear/settings button is removed, the following CSS can be cleaned up:
- `.controls .btn-set` (line 528) — shared styles with `.btn-sub` would need separation
- `.controls .btn-set.subscribed` (line 583)
- `.controls .btn-set.subscribed:hover` (line 590)
- `.controls .btn-set:hover` (line 595)
- `.controls .btn-set-icon` (line 608)

**Note:** Many of these are shared selectors (e.g., `.controls .btn-sub, .controls .btn-set`). The shared styles need to be moved to just `.controls .btn-sub` if the `.btn-set` is removed.

## Implementation Steps

### Step 1: Update `react.jsx` — Remove gear/settings button
- Remove the entire `.btn-set` button block (lines 556-562)
- This eliminates the subscription trigger from the player view

### Step 2: Update `react.jsx` — Remove CTA banner button  
- Remove the `.sub-cta-btn` button from the banner (line 463)
- Keep the banner `<div>` and its text content for informational purposes
- The banner becomes a static status indicator

### Step 3: Update `style.css` — Clean up `.btn-set` styles
- Merge `.controls .btn-sub, .controls .btn-set` shared rules into just `.controls .btn-sub`
- Remove `.controls .btn-set.subscribed`, `.controls .btn-set.subscribed:hover`, `.controls .btn-set:hover`, `.controls .btn-set-icon` rules
- Keep `.controls .btn-sub` and its related styles intact

### Step 4: Verify
- Confirm subscription modal only opens when clicking the "Sub" button
- Confirm CTA banner displays correctly without the button
- Confirm no broken styles or layout issues

## Mermaid Diagram: Before vs After

```mermaid
flowchart LR
    subgraph Before
        B1[CTA Banner Button] -->|setShowSubscription true| Sub[Subscription Modal]
        B2[Sub Button] -->|setShowSubscription true| Sub
        B3[Gear Button] -->|setShowSubscription true| Sub
    end

    subgraph After
        A1[CTA Banner - static only] -->|no action| N[No subscription trigger]
        A2[Sub Button] -->|setShowSubscription true| Sub2[Subscription Modal]
        A3[Gear Button - removed] -->|no action| N2[No subscription trigger]
    end