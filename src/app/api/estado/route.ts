import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// PUT /api/vehiculos/estado
// Body: { id: number, activo: boolean }

export async function PUT(request: Request) {
  try {
    const { id, activo } = await request.json();

    if (!id || typeof activo !== "boolean") {
      return NextResponse.json(
        { error: "Datos inválidos: id y activo son requeridos" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE vehiculo
      SET activo = ${activo}, updated_at = NOW()
      WHERE id = ${id}
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

  } catch (error) {
    console.error("Error al cambiar estado del vehículo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
