import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ScanPage = () => {
    const [params] = useSearchParams();
    const session = params.get('session');
    const scannerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);

    const startScanner = async () => {
        const scanner = new Html5Qrcode('reader');
        scannerRef.current = scanner;

        try {
            await scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                decoded => {
                    console.log('QR leído:', decoded);
                    const productId = typeof decoded === 'string' ? decoded : String(decoded);
                    try {
                        window.opener?.postMessage({ sessionId: session, productId }, window.origin);
                    } catch (err) {
                        console.error('Error al enviar el mensaje:', err);
                    }
                    scanner.stop().catch(err => {
                        console.warn('No se pudo detener el escáner:', err.message);
                    });
                    window.close();
                },
                error => {
                    console.warn('Error de escaneo:', error);
                }
            );
            setIsScanning(true);
        } catch (err) {
            console.error('Error al iniciar el escáner:', err);
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current && isScanning) {
                scannerRef.current.stop().catch(err => {
                    console.warn('Error al detener escáner al desmontar:', err.message);
                });
            }
        };
    }, [isScanning]);

    return (
        <div className="p-6">
            <h2>Escanear producto</h2>
            <div className="mb-4">
                <button
                    onClick={startScanner}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Iniciar escaneo
                </button>
            </div>
            <div id="reader" style={{ width: '100%', height: 400 }} />
        </div>
    );
};

export default ScanPage;
