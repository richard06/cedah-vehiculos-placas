"use client";

import { useEffect, useState } from "react";
import { useSessionAuth } from "@/hooks/useSessionAuth";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const { user, logout } = useSessionAuth();

  // Para evitar hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-indigo-600">
              Sistema de Vehículos
            </h1>
          </div>

          {/* No renderizar nada del usuario hasta que el cliente esté montado */}
          {isClient && user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span className="font-medium">{user.name}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{user.email}</span>
              </div>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
