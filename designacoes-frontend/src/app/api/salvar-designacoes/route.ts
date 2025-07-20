import { NextResponse } from "next/server";
import { writeFileSync } from "fs";

export async function POST(request: Request) {
  const body = await request.json();

  // Aqui você salvaria no JSON local
  writeFileSync("CAMINHO/DO/ARQUIVO.json", JSON.stringify(body, null, 2));

  return NextResponse.json({ status: "ok" });
}