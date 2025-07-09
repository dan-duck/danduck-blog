import { NextRequest, NextResponse } from 'next/server';
import { checkPostExists } from '@/lib/posts';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const exists = checkPostExists(slug);
    
    return NextResponse.json(
      { exists, slug },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      }
    );
  } catch (error) {
    console.error('Error checking post existence:', error);
    return NextResponse.json(
      { error: 'Failed to check post existence' },
      { status: 500 }
    );
  }
}