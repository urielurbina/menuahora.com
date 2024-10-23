import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request, { params }) {
  const { username } = params;
  console.log('Requested username:', username);

  try {
    const { db } = await connectToDatabase();
    console.log('Connected to database');
    const businessData = await db.collection('businesses').findOne({ username });
    console.log('Business data:', businessData);

    if (!businessData) {
      console.log('Business not found');
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json(businessData);
  } catch (error) {
    console.error('Error fetching business data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
