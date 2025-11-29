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
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // No mostrar nada si no está autenticado
  if (!loading && !isAuthenticated) {
    return null;
  }

  return (
    <>
      <NavBar />
      <main className="p-4">{children}</main>
    </>
  );
}