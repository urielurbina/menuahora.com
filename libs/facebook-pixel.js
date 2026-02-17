// Facebook Pixel and Conversions API utility
// Handles both client-side pixel and server-side CAPI with deduplication

import crypto from 'crypto';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const FB_ACCESS_TOKEN = process.env.FB_CONVERSIONS_API_TOKEN;
const FB_API_VERSION = 'v18.0';

// Hash function for user data (required by Facebook)
export function hashData(data) {
  if (!data) return null;
  const normalized = String(data).toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Generate unique event ID for deduplication
export function generateEventId() {
  return `${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

// Get Facebook cookies from request headers
export function getFacebookCookies(cookieHeader) {
  if (!cookieHeader) return { fbc: null, fbp: null };

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );

  return {
    fbc: cookies._fbc || null,
    fbp: cookies._fbp || null
  };
}

// Send event to Facebook Conversions API
export async function sendServerEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData = {},
  customData = {},
  actionSource = 'website',
  testEventCode = null, // Use for testing in Events Manager
}) {
  if (!FB_ACCESS_TOKEN || !FB_PIXEL_ID) {
    console.warn('Facebook Conversions API not configured - missing token or pixel ID');
    return null;
  }

  const eventTime = Math.floor(Date.now() / 1000);

  // Prepare user data with proper hashing
  const user_data = {};

  // Hash PII fields
  if (userData.email) user_data.em = [hashData(userData.email)];
  if (userData.phone) user_data.ph = [hashData(userData.phone)];
  if (userData.firstName) user_data.fn = [hashData(userData.firstName)];
  if (userData.lastName) user_data.ln = [hashData(userData.lastName)];
  if (userData.city) user_data.ct = [hashData(userData.city)];
  if (userData.state) user_data.st = [hashData(userData.state)];
  if (userData.zipCode) user_data.zp = [hashData(userData.zipCode)];
  if (userData.country) user_data.country = [hashData(userData.country)];
  if (userData.dateOfBirth) user_data.db = [hashData(userData.dateOfBirth)];
  if (userData.gender) user_data.ge = [hashData(userData.gender)];

  // Non-hashed fields
  if (userData.clientIpAddress) user_data.client_ip_address = userData.clientIpAddress;
  if (userData.clientUserAgent) user_data.client_user_agent = userData.clientUserAgent;
  if (userData.fbc) user_data.fbc = userData.fbc;
  if (userData.fbp) user_data.fbp = userData.fbp;
  if (userData.externalId) user_data.external_id = [hashData(userData.externalId)];
  if (userData.subscriptionId) user_data.subscription_id = userData.subscriptionId;

  const eventData = {
    event_name: eventName,
    event_time: eventTime,
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: actionSource,
    user_data,
  };

  // Add custom data if provided (for Purchase, InitiateCheckout, etc.)
  if (Object.keys(customData).length > 0) {
    eventData.custom_data = customData;
  }

  const payload = {
    data: [eventData],
  };

  // Add test event code if provided (for testing)
  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook Conversions API error:', result);
      return null;
    }

    console.log(`FB CAPI: ${eventName} event sent successfully`, result);
    return result;
  } catch (error) {
    console.error('Facebook Conversions API request failed:', error);
    return null;
  }
}

// Standard events with custom data
export const FB_EVENTS = {
  PAGE_VIEW: 'PageView',
  LEAD: 'Lead',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  ADD_PAYMENT_INFO: 'AddPaymentInfo',
  PURCHASE: 'Purchase',
  CONTACT: 'Contact',
  VIEW_CONTENT: 'ViewContent',
  SEARCH: 'Search',
  ADD_TO_CART: 'AddToCart',
  ADD_TO_WISHLIST: 'AddToWishlist',
  SUBSCRIBE: 'Subscribe',
  START_TRIAL: 'StartTrial',
};

// Helper function to extract user data from request
export function extractUserDataFromRequest(request, user = null) {
  const headers = request.headers;
  const cookieHeader = headers.get('cookie');
  const { fbc, fbp } = getFacebookCookies(cookieHeader);

  // Get IP address (handle various proxy headers)
  const clientIpAddress =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') || // Cloudflare
    null;

  const clientUserAgent = headers.get('user-agent');

  const userData = {
    clientIpAddress,
    clientUserAgent,
    fbc,
    fbp,
  };

  // Add user data if available
  if (user) {
    if (user.email) userData.email = user.email;
    if (user.name) {
      const nameParts = user.name.split(' ');
      userData.firstName = nameParts[0];
      if (nameParts.length > 1) userData.lastName = nameParts.slice(1).join(' ');
    }
    if (user._id) userData.externalId = user._id.toString();
    if (user.customerId) userData.subscriptionId = user.customerId;
  }

  return userData;
}
