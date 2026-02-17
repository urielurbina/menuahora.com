"use client";

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Generate unique event ID for deduplication with server
export function generateEventId() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Track standard events with the pixel
export function fbq(eventType, eventName, params = {}, options = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(eventType, eventName, params, options);
  }
}

// Track event with event_id for deduplication
export function trackEvent(eventName, params = {}, eventId = null) {
  const id = eventId || generateEventId();
  fbq('track', eventName, params, { eventID: id });
  return id;
}

// Track custom event with event_id
export function trackCustomEvent(eventName, params = {}, eventId = null) {
  const id = eventId || generateEventId();
  fbq('trackCustom', eventName, params, { eventID: id });
  return id;
}

// Standard event helpers
export const FB = {
  pageView: (eventId) => trackEvent('PageView', {}, eventId),

  lead: (params = {}, eventId) => trackEvent('Lead', params, eventId),

  completeRegistration: (params = {}, eventId) =>
    trackEvent('CompleteRegistration', params, eventId),

  initiateCheckout: (params = {}, eventId) =>
    trackEvent('InitiateCheckout', params, eventId),

  addPaymentInfo: (params = {}, eventId) =>
    trackEvent('AddPaymentInfo', params, eventId),

  purchase: (value, currency = 'MXN', params = {}, eventId) =>
    trackEvent('Purchase', { value, currency, ...params }, eventId),

  contact: (params = {}, eventId) =>
    trackEvent('Contact', params, eventId),

  viewContent: (params = {}, eventId) =>
    trackEvent('ViewContent', params, eventId),

  search: (searchString, params = {}, eventId) =>
    trackEvent('Search', { search_string: searchString, ...params }, eventId),

  addToCart: (params = {}, eventId) =>
    trackEvent('AddToCart', params, eventId),

  subscribe: (params = {}, eventId) =>
    trackEvent('Subscribe', params, eventId),

  startTrial: (params = {}, eventId) =>
    trackEvent('StartTrial', params, eventId),
};

// Send event to both client pixel and server CAPI for better attribution
export async function trackHybridEvent(eventName, params = {}, serverParams = {}) {
  const eventId = generateEventId();

  // Track on client (browser pixel)
  trackEvent(eventName, params, eventId);

  // Send to server for CAPI
  try {
    await fetch('/api/fb-conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        customData: params,
        ...serverParams,
      }),
    });
  } catch (error) {
    console.error('Failed to send server event:', error);
  }

  return eventId;
}

// Component to track page views on route changes
function FacebookPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (FB_PIXEL_ID) {
      FB.pageView();
    }
  }, [pathname, searchParams]);

  return null;
}

// Main Facebook Pixel component
export default function FacebookPixel() {
  if (!FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <FacebookPixelPageView />
      </Suspense>
    </>
  );
}
