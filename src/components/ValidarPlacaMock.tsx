'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function ValidarPlacaMock() {
  const [result] = useState({
    found: true,
    vehiculo: {
      numeroplaca: '58AP1G',
      tipotransporte: 'Pipa',
      vigencia: '2046-04-27',
    },
  });

  return (
    <div className="w-full">
{result.found && result.vehiculo && (
  <div className="border border-green-700 rounded-xl overflow-hidden max-w-4xl mx-auto shadow-sm">
    {/* HEADER */}
    <div className="bg-green-700 text-white px-4 py-4 flex items-center gap-3">
      <CheckCircle className="w-6 h-6 flex-shrink-0" />
      <span className="font-semibold text-base sm:text-lg leading-tight">
        Validación Exitosa – Vehículo Registrado en CNE
      </span>
    </div>

    {/* BODY */}
    <div className="bg-white p-5 sm:p-6 text-gray-900">
      {/* En móvil: stack / En md+: dos columnas (datos izquierda, estatus derecha) */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* DATOS (izquierda) */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base">
            <strong>Placa:</strong>{' '}
            <span className="break-words">{result.vehiculo.numeroplaca}</span>
          </p>

          <p className="text-sm sm:text-base">
            <strong>Tipo de Transporte:</strong>{' '}
            <span className="break-words">{result.vehiculo.tipotransporte}</span>
          </p>

          <p className="text-sm sm:text-base">
            <strong>Vigencia:</strong>{' '}
            {new Date(result.vehiculo.vigencia).toISOString().split('T')[0]}
          </p>
        </div>

        {/* ESTATUS (derecha en md+, abajo en móvil) */}
        <div className="md:min-w-[320px]">
          <p className="font-bold text-sm sm:text-base mb-2">
            Estatus Actual de Unidad:
          </p>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <span className="text-green-700 font-extrabold text-xl sm:text-2">
              AUTORIZADO
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
