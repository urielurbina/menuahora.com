import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import {
  sendServerEvent,
  extractUserDataFromRequest,
  FB_EVENTS,
} from '@/libs/facebook-pixel';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';

// API route for sending events to Facebook Conversions API
// This enables hybrid tracking (browser pixel + server CAPI) for better attribution
export async function POST(request) {
  try {
    const body = await request.json();
    const { eventName, eventId, customData = {}, userData: clientUserData = {} } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    // Get session and user if authenticated
    const session = await getServerSession(authOptions);
    let user = null;

    if (session?.user?.id) {
      await connectMongo();
      user = await User.findById(session.user.id);
    }

    // Extract user data from request headers (IP, user agent, cookies)
    const serverUserData = extractUserDataFromRequest(request, user);

    // Merge client-provided user data with server-extracted data
    const mergedUserData = {
      ...serverUserData,
      ...clientUserData,
    };

    // Get the source URL
    const referer = request.headers.get('referer') || request.headers.get('origin');
    const eventSourceUrl = body.eventSourceUrl || referer || 'https://www.repisa.co';

    // Send to Facebook Conversions API
    const result = await sendServerEvent({
      eventName,
      eventId,
      eventSourceUrl,
      userData: mergedUserData,
      customData,
      actionSource: 'website',
      // Uncomment for testing in Facebook Events Manager:
      // testEventCode: 'TEST12345',
    });

    return NextResponse.json({
      success: true,
      eventName,
      eventId,
      result,
    });
  } catch (error) {
    console.error('FB Conversions API error:', error);
    return NextResponse.json(
      { error: 'Failed to send conversion event' },
      { status: 500 }
    );
  }
}
