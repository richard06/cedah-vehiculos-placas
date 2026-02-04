'use client';

import { useEffect, useMemo } from 'react';

export type ValidationResult = {
  found: boolean;
  vehiculo?: {
    numeroplaca: string;
    tipotransporte: string;
    vigencia: string;
  };
  message?: string;
};

type Props = {
  onResultChange?: (r: ValidationResult | null) => void;
  hideResult?: boolean;
  scenario?: 'success' | 'error';
};

export default function ValidarPlacaMock({
  onResultChange,
  hideResult,
  scenario = 'success',
}: Props) {
  const mockResult = useMemo<ValidationResult>(() => {
    if (scenario === 'error') {
      return {
        found: false,
        message: 'Error: Datos de placa no registrados en CNE (MOCK)',
      };
    }

    return {
      found: true,
      vehiculo: {
        numeroplaca: '58AP1G',
        tipotransporte: 'VEHÍCULO DE REPARTO',
        vigencia: '2046-04-27',
      },
    };
  }, [scenario]);

  useEffect(() => {
    onResultChange?.(mockResult);
    return () => onResultChange?.(null);
  }, [mockResult, onResultChange]);

  // Si ocultas resultado, no mostramos nada aquí (lo muestra page.tsx)
  if (hideResult) return <div className="w-full" />;

  // (Opcional) Si algún día quieres que también se vea aquí, puedes renderizarlo,
  // pero ahorita tu intención es que lo pinte page.tsx.
  return <div className="w-full" />;
}
