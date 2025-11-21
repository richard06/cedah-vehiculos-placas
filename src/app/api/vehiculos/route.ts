import { NextResponse } from "next/server";
import { getAllVehiculos } from "@/lib/db";

export async function GET() {
  try {
    const vehiculos = await getAllVehiculos();
    return NextResponse.json(vehiculos);
  } catch (err) {
    return NextResponse.json(
      { error: "Error obteniendo vehículos" },
      { status: 500 }
    );
  }
}
