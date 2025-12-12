'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Calendar, Car, CarFront } from 'lucide-react';

interface ValidationResult {
  found: boolean;
  vehiculo?: {
    numeroplaca: string;
    tipotransporte: string;
    vigencia: string;
    activo: boolean;
    esVigente: boolean;
    diasRestantes: number;
  };
  message?: string;
}

export default function ValidatePlaca() {
  const [numeroplaca, setNumeroPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numeroplaca.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroplaca })
      });

      const data = await response.json();
      setResult(data);

    } catch (error) {
      setResult({
        found: false,
        message: 'Error al conectar con el servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">

        {/* FORMULARIO */}
        <form onSubmit={handleValidate} className="space-y-4">

          {/* Input con icono */}
          <div className="flex shadow-md rounded-md overflow-hidden h-14 border border-gray-200 bg-white">
            <div className="bg-[#691C32] w-16 flex items-center justify-center flex-shrink-0">
              <CarFront className="text-white w-6 h-6" />
            </div>

            <input
              type="text"
              value={numeroplaca}
              onChange={(e) => setNumeroPlaca(e.target.value)}
              placeholder="INGRESE NÚMERO DE PLACA (EJ: 58AP1G)"
              className="flex-1 px-6 text-gray-600 placeholder-gray-400 outline-none font-semibold uppercase text-sm tracking-wide"
              disabled={loading}
            />
          </div>

          {/* BOTÓN */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !numeroplaca.trim()}
              className="px-6 py-2 bg-[#8B2C4A] text-white rounded-md hover:bg-[#691C32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>

              {loading ? 'Validando...' : 'Validar'}
            </button>
          </div>

        </form>

        {/* RESULTADO */}
        {result && (
          <div className="mt-6 animate-fade-in">

            {result.found && result.vehiculo ? (

              /* CONTENEDOR PRINCIPAL */
              <div className="border border-green-700 rounded-lg overflow-hidden">

                {/* BARRA SUPERIOR VERDE */}
                <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                  <span className="font-semibold text-lg">
                    Validación Exitosa - Placa Registrada en CNE
                  </span>
                </div>

                {/* CONTENIDO EN DOS COLUMNAS */}
                <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* COLUMNA IZQUIERDA */}
                  <div className="space-y-3">
                    <p><strong>Placa:</strong> {result.vehiculo.numeroplaca}</p>
                    <p><strong>Tipo Transporte:</strong> {result.vehiculo.tipotransporte}</p>
                    <p>
                      <strong>Vigencia:</strong>{" "}
                      {new Date(result.vehiculo.vigencia).toISOString().split("T")[0]}
                    </p>
                  </div>

                  {/* COLUMNA DERECHA */}
                  <div className="flex flex-col items-start md:items-center justify-center">
                    <span className="text-gray-800 font-semibold text-lg">
                      Estatus Actual de Unidad:
                    </span>

                    <div className="flex items-center gap-2 text-green-700 font-bold text-2xl mt-2">
                      <CheckCircle className="w-7 h-7 text-green-700" />
                      AUTORIZADO
                    </div>
                  </div>

                </div>

              </div>

            ) : (

              /* ERROR */
              <div className="bg-red-200 border-2 border-red-300 rounded-lg p-1">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-8 h-8 text-yellow-900" />
                  <h4 className="text-lg font-bold text-yellow-900">
                    Error: Datos de placa no registrados en CNE
                  </h4>
                </div>
              </div>

            )}

          </div>
        )}

      </CardContent>
    </Card>
  );
}
