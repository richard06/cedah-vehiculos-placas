import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAllVehiculos } from "@/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "tu-secreto-super-seguro"
);

export async function GET(request: NextRequest) {
  // 🔐 Validar token desde la cookie
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado - Token no encontrado" },
      { status: 401 }
    );
  }

  try {
    // Verificar y decodificar el JWT con jose
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Si llegamos aquí, el token es válido
    // Opcionalmente puedes usar los datos del usuario: payload.id, payload.email, etc.

    const vehiculos = await getAllVehiculos();
    return NextResponse.json(vehiculos);
    
  } catch (error) {
    console.error("Error validando token:", error);
    // Token inválido o expirado
    return NextResponse.json(
      { error: "No autorizado - Token inválido o expirado" },
      { status: 401 }
    );
  }
}