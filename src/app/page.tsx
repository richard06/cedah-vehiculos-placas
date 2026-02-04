'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import ValidatePlaca from "@/components/ValidarPlacaMock";
//import ValidatePlaca from "@/components/ValidarPlaca";
import { Search, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

type ValidationResult = {
  found: boolean;
  vehiculo?: {
    numeroplaca: string;
    tipotransporte: string;
    vigencia: string;
  };
  message?: string;
};

export default function Home() {
  const [fechaHora, setFechaHora] = useState("");
  const [resultadoValidacion, setResultadoValidacion] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const tick = () => {
      setFechaHora(
        new Date()
          .toLocaleString("es-MX", {
            timeZone: "America/Mexico_City",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(",", "")
      );
    };

    tick(); // pinta inmediato
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-8 border-[var(--gold)] box-content !box-content">
        <div className="h-0 bg-[var(--gold)]" />
        <div className="w-full px-4 py-4 bg-[var(--maroon-custom)]">
          <div className="flex items-center gap-3 bg-[var(--maroon-custom)]">
            <div className="w-40 h-30 bg-[var(--maroon)] rounded-full flex items-center justify-center">
              <Image
                src="https://cedah.energia.gob.mx/demo1/media/logos/logo_blanco.svg"
                alt="Logo"
                width={30}
                height={20}
                className="w-40 h-30"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-35 py-6 flex-1">
        <Card className="shadow-lg border-0 rounded-xl">
          <CardHeader className="bg-[var(--maroon)] text-white p-1 rounded-t-[5px]">
            <h2 className="text-xl font-bold flex items-start gap-3">
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              DISTRIBUCIÓN DE GAS LICUADO DE PETRÓLEO MEDIANTE PLANTA DE DISTRIBUCIÓN GLP
            </h2>
          </CardHeader>

          <CardContent className="p-3 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Estado del Permiso */}
              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Estado del Permiso
                </div>

                <Badge
                  className="w-auto bg-[var(--success-green)] hover:bg-[var(--success-green)]
                             text-white px-4 py-2 text-base rounded-full inline-flex items-center gap-2"
                >
                  <span className="bg-white rounded-full flex items-center justify-center w-5 h-5">
                    <svg className="w-3 h-3 text-[var(--success-green)]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Vigente
                </Badge>
              </div>

              {/* Razón Social */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" />
                  </svg>
                  Razón Social
                </div>
                <h5 className="font-semibold text-gray-900">GAS GLOBAL CORPORATIVO, S.A. DE C.V.</h5>
              </div>

              {/* Número de Permiso */}
              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Número de Permiso
                </div>
                <h5 className="font-semibold text-red-600">LP/14939/DIST/PLA/2016</h5>
              </div>

              {/* Vigencia */}
              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Vigencia
                </div>
                <h5 className="font-semibold text-gray-900">Del 2014-03-06 al 2046-04-27</h5>
              </div>
            </div>

            {/* Productos Autorizados */}
            <div className="mb-6">
              <h6 className="text-[var(--success-green)] font-semibold mb-3 flex items-center gap-2">
                <svg className="w-7 h-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C12 2 5 9 5 14.5C5 19 8.5 22 12 22C15.5 22 19 19 19 14.5C19 9 12 2 12 2Z"
                    fill="var(--success-green)"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 14.5C9 16.4 10.3 18 12 18"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Productos Autorizados
              </h6>

              <Badge className="bg-gray-600 hover:bg-gray-600 text-white px-3 py-2 text-sm rounded-sm">
                <svg
                  className="w-5 h-5 inline mr-2 align-middle"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C12 2 5 9 5 14.5C5 19 8.5 22 12 22C15.5 22 19 19 19 14.5C19 9 12 2 12 2Z" />
                  <path d="M9 14.5C9 16.4 10.3 18 12 18" strokeLinecap="round" />
                </svg>

                GLP

                <svg className="w-5 h-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Badge>
            </div>

            {/* Seguros Card */}
            <Card className="shadow-sm border-0 mb-6 max-w-md rounded-xl">
              <CardHeader className="bg-[var(--success-green)] text-white text-center py-4 rounded-t-xl">
                <h6 className="font-bold flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Seguros
                </h6>
              </CardHeader>

              <CardContent className="text-center py-6">
                <h6 className="text-gray-900 mb-3">Información de Pólizas</h6>

                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-sm">
                  <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  En proceso de carga
                </Badge>
              </CardContent>
            </Card>

            {/* Consulta pública */}
            <div className="text-center py-3 border-t">
              <small className="text-gray-500 text-[15px]">
                Consulta pública{" "}
                {new Date().toLocaleString("es-MX", {
                  timeZone: "America/Mexico_City",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }).replace(",", "")}
              </small>
            </div>

            {/* Validar Placa (cuadro gris NO se mueve) */}
            <div className="mt-6 p-6 bg-gray-100 rounded-lg">
              <h5 className="text-center mb-4 flex items-center justify-center gap-2 text-lg font-semibold text-[20px]">
                <Search size={20} color="#691C32" />
                Validar Vehículo
              </h5>

              <div className="w-full max-w-4xl mx-auto">
                <ValidatePlaca hideResult onResultChange={setResultadoValidacion} />
              </div>
            </div>

            {/* ✅ RESULTADO FUERA DEL CUADRO GRIS (donde estaba "hola") */}
            <div className="w-full mx-auto mt-6">
              {/* ÉXITO */}
              {resultadoValidacion?.found && resultadoValidacion?.vehiculo && (
                <div className="border border-green-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-green-700 text-white px-4 py-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span className="font-semibold text-base sm:text-lg leading-tight">
                      Validación Exitosa – Vehículo Registrado en CNE
                    </span>
                  </div>

                  <div className="bg-white p-5 sm:p-6 text-gray-900">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base">
                          <strong>Placa:</strong>{" "}
                          <span className="break-words">{resultadoValidacion.vehiculo.numeroplaca}</span>
                        </p>

                        <p className="text-sm sm:text-base">
                          <strong>Tipo de Transporte:</strong>{" "}
                          <span className="break-words">{resultadoValidacion.vehiculo.tipotransporte}</span>
                        </p>

                        <p className="text-sm sm:text-base">
                          <strong>Vigencia:</strong>{" "}
                          {new Date(resultadoValidacion.vehiculo.vigencia).toISOString().split("T")[0]}
                        </p>
                      </div>

                      <div className="md:min-w-[320px]">
                        <p className="font-bold text-sm sm:text-base mb-2">Estatus Actual de Unidad:</p>

                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>

                          <span className="text-green-700 font-extrabold text-xl sm:text-2xl">
                            AUTORIZADO
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {resultadoValidacion && !resultadoValidacion.found && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-7 h-7 text-yellow-900 flex-shrink-0" />
                      <h4 className="text-base sm:text-lg font-bold text-yellow-900">
                        {resultadoValidacion.message ?? "Error: Datos no registrados en CNE"}
                      </h4>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--maroon)] text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="w-50 h-50 bg-[var(--maroon)] rounded-full flex items-center">
              <Image
                src="https://framework-gb.cdn.gob.mx/gobmx/img/logo_blanco.svg"
                alt="Logo"
                width={30}
                height={20}
                className="w-40 h-30"
              />
            </div>

            {/* Enlaces */}
            <div>
              <h5 className="font-bold mb-4">Enlaces</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="https://participa.gob.mx" target="_blank" rel="noopener" className="hover:underline">Participa</a></li>
                <li><a href="http://www.ordenjuridico.gob.mx" target="_blank" rel="noopener" className="hover:underline">Marco Jurídico</a></li>
                <li><a href="https://consultapublicamx.inai.org.mx/vut-web/" target="_blank" rel="noopener" className="hover:underline">Plataforma Nacional de Transparencia</a></li>
                <li><a href="https://alertadores.funcionpublica.gob.mx/" target="_blank" rel="noopener" className="hover:underline">Alerta</a></li>
                <li><a href="https://sidec.funcionpublica.gob.mx" target="_blank" rel="noopener" className="hover:underline">Denuncia</a></li>
              </ul>
            </div>

            {/* ¿Qué es gob.mx? */}
            <div>
              <h5 className="font-bold mb-4">¿Qué es gob.mx?</h5>
              <p className="text-sm mb-3">
                Es el portal único de trámites, información y participación ciudadana.{" "}
                <a href="https://www.gob.mx/que-es-gobmx" className="underline">Leer más</a>
              </p>
              <ul className="space-y-2 text-sm">
                <li><a href="https://datos.gob.mx" target="_blank" className="hover:underline">Portal de datos abiertos</a></li>
                <li><a href="https://www.gob.mx/accesibilidad" target="_blank" className="hover:underline">Declaración de accesibilidad</a></li>
                <li><a href="https://www.gob.mx/terminos" target="_blank" className="hover:underline">Términos y Condiciones</a></li>
              </ul>
            </div>

            {/* Síguenos en */}
            <div>
              <h5 className="font-bold mb-4">Síguenos en</h5>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/gobmexico" target="_blank" rel="noopener" className="hover:opacity-80 bg-white/10 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/GobiernoMX" target="_blank" rel="noopener" className="hover:opacity-80 bg-white/10 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/gobmexico/" target="_blank" rel="noopener" className="hover:opacity-80 bg-white/10 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@gobiernodemexico" target="_blank" rel="noopener" className="hover:opacity-80 bg-white/10 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Pleca */}
        <div className="h-12 bg-gradient-to-r from-[#8B2C4A] via-[#691C32] to-[#8B2C4A] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('https://framework-gb.cdn.gob.mx/gobmx/img/pleca.svg')",
            }}
          />
        </div>
      </footer>
    </div>
  );
}
