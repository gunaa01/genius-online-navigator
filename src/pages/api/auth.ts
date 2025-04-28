import { NextResponse } from 'next/server';
import { authService } from '@/services/api/authService';
import { schemas } from '@/lib/validation';

console.log('API Route loaded');

export async function POST(request: Request) {
  console.log('Request received:', request.method, request.url);
  
  try {
    console.log('Request body:', await request.json());
    
    // Validate input
    const body = await request.json();
    const validation = schemas.login().safeParse(body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error);
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Authenticate user
    const { email, password } = validation.data;
    const response = await authService.login({ email, password });
    
    if (!response.success) {
      console.log('Auth error:', response.error);
      return NextResponse.json(
        { error: response.error },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      user: response.data.user,
      token: response.data.tokens.accessToken
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
