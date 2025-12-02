import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Vehículos",
  description: "Gestión de vehículos con autenticación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* Ya no necesitamos SessionProvider de NextAuth */}
        {children}
      </body>
    </html>
  );
}