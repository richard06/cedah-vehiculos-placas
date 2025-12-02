import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "tu-secreto-super-seguro"
);

export async function PUT(request: NextRequest) {
  // 🔐 Validar token desde el header Authorization
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    // Verificar JWT con jose
    await jwtVerify(token, JWT_SECRET);

    // Obtener datos del body
    const { numeroplaca, activo } = await request.json();

    if (!numeroplaca) {
      return NextResponse.json(
        { error: "Número de placa requerido" },
        { status: 400 }
      );
    }

    // Actualizar estado en la base de datos
    await sql`
      UPDATE vehiculos
      SET activo = ${activo}
      WHERE numeroplaca = ${numeroplaca}
    `;

    return NextResponse.json({ 
      success: true,
      message: "Estado actualizado correctamente" 
    });

  } catch (error) {
    console.error("Error actualizando estado:", error);
    
    return NextResponse.json(
      { error: "Error actualizando estado del vehículo" },
      { status: 500 }
    );
  }
}