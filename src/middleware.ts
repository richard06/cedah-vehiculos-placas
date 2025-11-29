import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "tu-secreto-super-seguro"
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/vehiculos');

  console.log('🔍 Middleware ejecutándose:', {
    path: request.nextUrl.pathname,
    hasToken: !!token,
    isAuthPage,
    isProtectedRoute
  });

  // Verificar si el token es válido
  let isValidToken = false;
  if (token) {
    try {
      // Usar jose en lugar de jsonwebtoken (compatible con Edge Runtime)
      await jwtVerify(token, JWT_SECRET);
      isValidToken = true;
      console.log('✅ Token válido');
    } catch (error) {
      console.log('❌ Token inválido:', error);
      isValidToken = false;
    }
  }

  // Si no hay token válido y está en ruta protegida, redirigir a login
  if (!isValidToken && isProtectedRoute) {
    console.log('🚫 Bloqueando acceso a ruta protegida, redirigiendo a /login');
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // Si hay token válido y está en login, redirigir a vehículos
  if (isValidToken && isAuthPage) {
    console.log('✅ Usuario autenticado en /login, redirigiendo a /vehiculos');
    return NextResponse.redirect(new URL('/vehiculos', request.url));
  }

  console.log('✅ Permitiendo acceso');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/vehiculos/:path*', 
    '/login',
    '/api/vehiculos/:path*',
    '/api/estado/:path*',
  ],
};