"use client";

import { useSignaturePad } from "@/app/signature-pad/useSignaturePad";

export default function SignaturePad() {
  const { canvasRef, signaturePad } = useSignaturePad();

  return (
    <div className="w-min">
      <section className="bg-white">
        <canvas width={500} height={500} ref={canvasRef} />
      </section>
      <button
        className="bg-white active:bg-yellow-200 text-black mt-6 ml-6 p-2 rounded-md cursor-pointer"
        onClick={() => signaturePad?.clear()}
      >
        clear
      </button>
    </div>
  );
}
