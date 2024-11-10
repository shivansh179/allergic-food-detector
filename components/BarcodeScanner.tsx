// components/BarcodeScanner.tsx
import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

type BarcodeScannerProps = {
  onDetected: (code: string) => void;
};

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const beepSound = typeof window !== 'undefined' ? new Audio('/beep.wav') : null;

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stream: MediaStream | null = null;

    const startScanner = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;

        codeReader.decodeFromVideoElement(videoRef.current!, (result, err) => {
          if (result) {
            beepSound?.play(); // Play beep sound
            onDetected(result.getText());
          }
        });
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startScanner();

    return () => {
      stream?.getTracks().forEach(track => track.stop()); // Stop the video stream
    };
  }, [onDetected, beepSound]);

  return <video ref={videoRef} className="w-full h-auto" autoPlay />;
};

export default BarcodeScanner;
