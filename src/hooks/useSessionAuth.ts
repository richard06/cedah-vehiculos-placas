// hooks/useSessionAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

const SESSION_KEY = 'auth_session';
const SESSION_TIMESTAMP = 'auth_timestamp';
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora en milisegundos

export function useSessionAuth() {
  // 🚀 Verificación síncrona INICIAL (antes del primer render)
  const initialAuth = () => {
    if (typeof window === 'undefined') return { user: null, loading: true };
    
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP);
    
    if (!sessionData || !timestamp) {
      return { user: null, loading: false };
    }
    
    const now = Date.now();
    const sessionTime = parseInt(timestamp, 10);
    
    if (now - sessionTime > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_TIMESTAMP);
      return { user: null, loading: false };
    }
    
    try {
      return { user: JSON.parse(sessionData), loading: false };
    } catch {
      return { user: null, loading: false };
    }
  };

  const initial = initialAuth();
  const [user, setUser] = useState<User | null>(initial.user);
  const [loading, setLoading] = useState(initial.loading);
  const router = useRouter();

  // Verificar si la sesión es válida
  const isSessionValid = (): boolean => {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP);

    if (!sessionData || !timestamp) return false;

    const now = Date.now();
    const sessionTime = parseInt(timestamp, 10);

    // Si pasó más de 1 hora, expirar
    if (now - sessionTime > SESSION_TIMEOUT) {
      clearSession();
      return false;
    }

    return true;
  };

  // Cargar sesión del sessionStorage
  const loadSession = () => {
    try {
      if (!isSessionValid()) {
        setUser(null);
        setLoading(false);
        return;
      }

      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const userData = JSON.parse(sessionData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error cargando sesión:', error);
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  // Guardar sesión en sessionStorage
  const saveSession = (userData: User, token?: string) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    sessionStorage.setItem(SESSION_TIMESTAMP, Date.now().toString());
    if (token) {
      sessionStorage.setItem('auth_token', token); // 🔑 Guardar también el token
    }
    setUser(userData);
  };

  // Limpiar sesión
  const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_TIMESTAMP);
    sessionStorage.removeItem('auth_token'); // 🔑 Limpiar también el token
    setUser(null);
  };

  // Logout
  const logout = async () => {
    try {
      // Llamar al endpoint de logout para limpiar cookies del servidor
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include', // 👈 Incluir cookies
      });
      clearSession();
      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      clearSession();
      router.push('/login');
    }
  };

  // Cargar/verificar sesión al montar
  useEffect(() => {
    // Solo verificar si aún no tenemos usuario cargado
    if (!user) {
      loadSession();
    }
  }, [user]);

  // Verificar sesión cada 30 segundos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (!isSessionValid()) {
        router.push('/login');
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [user, router]);

  // 🔑 Función para obtener el token desde sessionStorage
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('auth_token');
  };

  // ⚠️ REMOVIDO: No ejecutar logout en beforeunload
  // El sessionStorage se limpia automáticamente al cerrar la pestaña
  // No necesitamos hacer fetch de logout aquí porque causa problemas

  return {
    user,
    loading,
    isAuthenticated: !!user,
    saveSession,
    logout,
    getToken, // 🔑 Exportar función para obtener token
  };
}