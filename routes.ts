import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { EXTERNAL_ENDPOINTS } from '@/lib/api/config';

// Static mock teacher accounts (username/password only, no API calls)
const STATIC_TEACHERS = [
  {
    username: 'teacher',
    password: 'teacher2026',
    role: 'teacher',
    name: 'Teacher',
  },
];

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (parseErr: any) {
      logger.warn('Login failed - invalid JSON body', 'AUTH', parseErr);
      return NextResponse.json(
        { success: false, error: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      );
    }

    const { username, email, password } = body;
    const loginId = (username || email || '').trim();

    if (!loginId || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      );
    }

    let finalRole: string = 'user';
    let token: string | undefined;
    let refreshToken: string | undefined;
    let apiResponseData: any;
    let userPayload: any = null;

    // ========================================
    // LOGIC FIX: Check for static teachers first
    // ========================================
    const matchedTeacher = STATIC_TEACHERS.find(
      (t) => t.username === loginId && t.password === password
    );

    if (matchedTeacher) {
      // Static teacher: no API call
      logger.info(`Static teacher logged in: ${loginId}`, 'AUTH');
      finalRole = matchedTeacher.role;
      
      // Mock token for teacher
      token = `teacher-token-${Date.now()}`;
      userPayload = {
        id: 12,
        name: matchedTeacher.name,
        email: matchedTeacher.username,
        role: finalRole,
      };

    } else {
      // ========================================
      // This is a regular user (e.g., "staff"), so call the external API
      // ========================================
      const formData = new URLSearchParams();
      formData.append('username', loginId);
      formData.append('password', password);

      const res = await fetch(EXTERNAL_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try {
          apiResponseData = await res.json();
        } catch (parseErr: any) {
          const fallbackText = await res.text().catch(() => '');
          logger.error('Login failed - invalid JSON from external API', 'AUTH', parseErr);
          return NextResponse.json(
            {
              success: false,
              error: fallbackText || 'Invalid response from external auth service',
              detail: 'external-auth-invalid-json',
            },
            { status: res.status || 500 }
          );
        }
      } else {
        const text = await res.text();
        logger.error('Login failed - non-JSON response from external API', 'AUTH', new Error(text));
        return NextResponse.json(
          {
            success: false,
            error: text || `Server error: ${res.status} ${res.statusText}`,
            detail: 'external-auth-non-json',
          },
          { status: res.status || 500 }
        );
      }

      if (!res.ok) {
        const errorMsg = apiResponseData?.error || apiResponseData?.message || apiResponseData?.detail || 'Invalid credentials';
        logger.warn('External API login failed', 'AUTH', new Error(errorMsg));
        return NextResponse.json(
          { success: false, error: errorMsg },
          { status: res.status }
        );
      }

      // Extract tokens from the external API response
      token = apiResponseData.token || apiResponseData.access_token || apiResponseData.access;
      refreshToken = apiResponseData.refresh_token || apiResponseData.refresh;

      if (!token) {
        logger.warn('Login failed - no token in external API response', 'AUTH', new Error(JSON.stringify(apiResponseData)));
        return NextResponse.json(
          { success: false, error: 'Invalid response from server' },
          { status: 500 }
        );
      }

      // Extract role from the external API response for staff users
      const userData = apiResponseData.user || apiResponseData.data?.user || {};
      finalRole = userData.role || userData.user_role || userData.role_name || 'user'; // Default to 'user' if no role is found
      userPayload = userData;
      logger.info(`User logged in via external API: ${loginId} with role: ${finalRole}`, 'AUTH');
    }

    // ========================================
    // Create the final response
    // ========================================
    const response = NextResponse.json({
      success: true,
      token,
      refresh_token: refreshToken,
      role: finalRole, // This will be 'teacher' or 'staff' or whatever the API returns
      user: userPayload,
    });

    // Set token in cookie for middleware access
    response.cookies.set('token', token!, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    if (refreshToken) {
      response.cookies.set('refresh_token', refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    logger.error('Login API route failed', 'AUTH', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Login failed. Please check your connection.' },
      { status: 500 }
    );
  }
}
