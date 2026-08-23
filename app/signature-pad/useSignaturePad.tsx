"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad, { type Options } from "signature_pad";

export function useSignaturePad(options?: Options) {
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    setSignaturePad(new SignaturePad(canvasRef.current, options));
  }, [options]);

  return { canvasRef, signaturePad };
}
