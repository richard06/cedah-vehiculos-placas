'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  AlertCircle,
  CarFront,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import { FriendlyCaptchaSDK } from '@friendlycaptcha/sdk';

/* =========================
   CONFIGURACIÓN CAPTCHA
========================= */
const SITE_KEY = 'FCMH682ENJIB14E2';

/* =========================
   TIPOS
========================= */
export interface ValidationResult {
  found: boolean;
  vehiculo?: {
    numeroplaca: string;
    tipotransporte: string;
    vigencia: string;
  };
  message?: string;
}

/* Tipos mínimos FriendlyCaptcha (sin any) */
type CaptchaWidget = {
  destroy: () => void;
};

type CaptchaSDK = {
  createWidget: (options: {
    element: HTMLElement;
    sitekey: string;
    startMode?: 'manual' | 'auto';
    language?: string;
  }) => CaptchaWidget;
};

type Props = {
  onResultChange?: (r: ValidationResult | null) => void;
  hideResult?: boolean;
};

export default function ValidarPlaca({ onResultChange, hideResult }: Props) {
  const [numeroplaca, setNumeroPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaStarted, setCaptchaStarted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [tipoBusqueda, setTipoBusqueda] = useState<'placa' | 'serie'>('placa');

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetRef = useRef<CaptchaWidget | null>(null);
  const captchaSdkRef = useRef<CaptchaSDK | null>(null);

  /* =========================
     CREAR CAPTCHA (SOLO AL DAR CLICK)
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!captchaStarted || !captchaContainerRef.current) return;

    // 🔴 si hay widget, NO creamos otro
    if (captchaWidgetRef.current) return;

    if (!captchaSdkRef.current) {
      captchaSdkRef.current =
        new FriendlyCaptchaSDK({ apiEndpoint: 'global' }) as unknown as CaptchaSDK;
    }

    captchaWidgetRef.current = captchaSdkRef.current.createWidget({
      element: captchaContainerRef.current,
      sitekey: SITE_KEY,
      startMode: 'manual',
      language: 'en'
    });

    const handleSolved = (e: Event) => {
      const custom = e as CustomEvent<{ response: string }>;
      setCaptchaToken(custom.detail.response);
    };

    captchaContainerRef.current.addEventListener('frc:widget.complete', handleSolved);

    return () => {
      captchaContainerRef.current?.removeEventListener('frc:widget.complete', handleSolved);
    };
  }, [captchaStarted]);

  const resetCaptchaAndResult = () => {
    setResult(null);
    onResultChange?.(null);

    if (captchaWidgetRef.current) {
      captchaWidgetRef.current.destroy();
      captchaWidgetRef.current = null;
    }

    setCaptchaToken(null);
    setCaptchaStarted(false);
    setShowCaptcha(false);
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleValidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!numeroplaca || !captchaToken) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroplaca,
          tipoBusqueda,
          captcha: captchaToken
        })
      });

      const data = await response.json().catch(() => ({}));

      const finalResult: ValidationResult = {
        found: Boolean(data?.found),
        vehiculo: data?.vehiculo,
        message: data?.message ?? (!response.ok ? 'Error al validar, intente nuevamente' : undefined)
      };

      setResult(finalResult);
      onResultChange?.(finalResult);
    } catch {
      const errResult: ValidationResult = {
        found: false,
        message: 'Error al conectar con el servidor'
      };
      setResult(errResult);
      onResultChange?.(errResult);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleValidate} className="space-y-4">
          {/* SELECT: Placa / Serie */}
          <div className="flex shadow-md rounded-md overflow-hidden h-14 border bg-white">
            <div className="bg-[#691C32] w-16 flex items-center justify-center">
              <SlidersHorizontal className="text-white w-6 h-6" />
            </div>

            <select
              value={tipoBusqueda}
              onChange={(e) => {
                const value = e.target.value as 'placa' | 'serie';
                setTipoBusqueda(value);
                setNumeroPlaca('');
                resetCaptchaAndResult();
              }}
              className="flex-1 px-6 outline-none font-semibold bg-white"
            >
              <option value="placa">Placa</option>
              <option value="serie">Serie</option>
            </select>
          </div>

          {/* INPUT */}
          <div className="flex shadow-md rounded-md overflow-hidden h-16 border bg-white">
            <div className="bg-[#691C32] w-16 flex items-center justify-center">
              <CarFront className="text-white w-6 h-6" />
            </div>

            <input
              value={numeroplaca}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setNumeroPlaca(value);
                setResult(null);
                onResultChange?.(null);

                // 🔑 destruimos widget al cambiar texto
                if (captchaWidgetRef.current) {
                  captchaWidgetRef.current.destroy();
                  captchaWidgetRef.current = null;
                }

                setCaptchaToken(null);
                setCaptchaStarted(false);
                setShowCaptcha(value.length >= 5);
              }}
              placeholder={
                tipoBusqueda === 'placa'
                  ? 'INGRESE NÚMERO DE PLACA (EJ:58AP1G)'
                  : 'INGRESE NÚMERO DE SERIE (VIN)'
              }
              className="flex-1 px-6 outline-none font-semibold"
            />
          </div>

          {/* CLICK TO START */}
          {showCaptcha && !captchaStarted && (
            <div
              onClick={() => setCaptchaStarted(true)}
              className="cursor-pointer border rounded-md p-4 flex items-center gap-4 hover:bg-gray-50"
            >
              <ShieldCheck className="w-8 h-8 text-gray-700" />
              <div>
                <p className="font-semibold">Anti-Robot Verification</p>
                <p className="text-sm text-gray-600">Click to start verification</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">FriendlyCaptcha ↗</span>
            </div>
          )}

          {/* CAPTCHA REAL */}
          {captchaStarted && (
            <div className="flex justify-center">
              <div ref={captchaContainerRef} />
            </div>
          )}

          {/* BOTÓN */}
          {captchaToken && (
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#8B2C4A] text-white rounded-md"
              >
                {loading ? 'Validando...' : 'Validar'}
              </button>
            </div>
          )}
        </form>

        {/* RESULTADO (solo si NO está oculto) */}
        {!hideResult && result && (
          <>
            {/* ÉXITO */}
            {result.found && result.vehiculo && (
              <div className="border border-green-800 rounded-xl overflow-hidden max-w-8xl mx-auto shadow-sm">
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

                        <span className="text-green-700 font-extrabold text-xl sm:text-2">
                          AUTORIZADO
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ERROR */}
            {!result.found && (
              <div className="max-w-md mx-auto">
                <div className="bg-red-200 border-2 border-red-300 rounded-lg p-1">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-8 h-8 text-yellow-900 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-yellow-900">
                        {result.message ??
                          (tipoBusqueda === 'placa'
                            ? 'Error: Datos de placa no registrados en CNE'
                            : 'Error: Datos de serie no registrados en CNE')}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
