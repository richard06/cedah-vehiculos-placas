"use client";

import NavBar from "@/components/NavBar";
import { useSessionAuth } from "@/hooks/useSessionAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VehiculosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useSessionAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 Layout - Auth status:', { isAuthenticated, loading });
    if (!loading && !isAuthenticated) {
      console.log('🚫 No autenticado, redirigiendo a /login');
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // No mostrar nada si no está autenticado
  if (!loading && !isAuthenticated) {
    console.log('❌ Bloqueando render, no hay sesión');
    return null;
  }

  // Mostrar loading mientras verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <main className="p-4">{children}</main>
    </>
  );
}