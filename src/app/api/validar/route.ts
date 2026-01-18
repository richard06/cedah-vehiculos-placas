import { NextRequest, NextResponse } from "next/server";
import { getVehiculoByPlaca, getVehiculoBySerie } from "@/lib/db";

// Esta API es PÚBLICA - no requiere autenticación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let numeroplaca = body.numeroplaca ?? body.numeroplaca;
    let tipoBusqueda = body.tipoBusqueda ?? body.tipoBusqueda;

    if (!numeroplaca) {
      return NextResponse.json(
        { error: "Número de placa requerido" },
        { status: 400 }
      );
    }

    // Convertir placa siempre a string y mayúsculas
    numeroplaca = String(numeroplaca).toUpperCase().trim();

    let vehiculo = null;

    if (tipoBusqueda === 'placa') {
      // Buscar vehículo
      vehiculo = await getVehiculoByPlaca(numeroplaca);
    }
    else if (tipoBusqueda === 'serie') {
      vehiculo = await getVehiculoBySerie(numeroplaca);
    }
    else {
      return NextResponse.json(
        { error: "tipoBusqueda inválido" },
        { status: 400 }
      );
    }



    if (!vehiculo) {
      return NextResponse.json(
        { found: false, message: `Error: Datos de ${tipoBusqueda} no registrados en CNE` },
        { status: 404 }
      );
    }

    const vigenciaDate = new Date(vehiculo.vigencia);
    const hoy = new Date();
    const esVigente = vigenciaDate >= hoy && vehiculo.activo;

    return NextResponse.json({
      found: true,
      vehiculo: {
        ...vehiculo,
        esVigente,
        diasRestantes: Math.ceil(
          (vigenciaDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
    });
} catch (err: any) {
  console.error("DB ERROR:", err?.message, err?.code, err?.stack);
  return NextResponse.json(
    { error: "Error al consultar la base de datos" },
    { status: 500 }
  );
}
}