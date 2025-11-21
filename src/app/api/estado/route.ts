import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function PUT(request: Request) {
  try {
    let body;

    // Protegerse contra body vacío o mal formado
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "El body debe ser JSON válido" },
        { status: 400 }
      );
    }

    const { numeroplaca, activo } = body;

    if (!numeroplaca || typeof activo !== "boolean") {
      return NextResponse.json(
        { error: "numeroplaca y activo son requeridos" },
        { status: 400 }
      );
    }

    // Forzar convertir placa a string siempre
    const placa = String(numeroplaca).toUpperCase().trim();

    const result = await sql`
      UPDATE vehiculo
      SET activo = ${activo}, updated_at = NOW()
      WHERE numeroplaca = ${placa}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Vehículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Estado actualizado correctamente",
      vehiculo: result.rows[0],
    });

  } catch (error: any) {
    console.error("Error al cambiar estado del vehículo:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
