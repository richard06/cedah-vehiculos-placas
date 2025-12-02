import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Eliminar cookie del servidor
  response.cookies.delete("auth-token");

  return response;
}