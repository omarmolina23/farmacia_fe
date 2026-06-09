import { Html5Qrcode } from 'html5-qrcode';
import { getProductAll } from '../../services/ProductService';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const SOCKET_SERVER_URL = import.meta.env.VITE_BARCODE_URL;

export default function ScanPage() {
    const { session } = useParams();
    const scannerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);    
    const [sock, setSocket] = useState(null);
    const [products, setProducts] = useState([]);
    const [productFound, setProductFound] = useState(null);

    useEffect(() => {
        getProductAll()
            .then(data => setProducts(data))
            .catch(err => console.error('❌ Error al cargar productos:', err));
    }, []);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, { reconnectionAttempts: 5 });
        setSocket(socket);
        socket.on('connect', () => socket.emit('join-room', session));
        return () => socket.disconnect();
    }, [session]);

    const playBeep = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
            oscillator.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch {
            console.warn('⚠️ No se pudo reproducir sonido');
        }
    };

    const pauseScanner = async () => {
        if (!scannerRef.current) return;
        try {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
            scannerRef.current = null;
        } catch (err) {
            console.warn('⚠️ Error al detener el escáner:', err.message);
        }
        setIsScanning(false);
    };

    const startScanner = async () => {
        if (!sock) return;
        if (!scannerRef.current) scannerRef.current = new Html5Qrcode('reader');
        try {
            await scannerRef.current.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                decoded => {
                    // Limpiamos el resultado (quitamos comillas, espacios, etc.)
                    const code = decoded.trim().replace(/"/g, '');

                    // Buscamos primero por el código de barras completo. Si no
                    // aparece y el código es un EAN-13, probamos con el código
                    // interno de 5 dígitos (posiciones 8-12) como respaldo.
                    let found = products.find(p => String(p.barcode) === code);
                    if (!found && /^\d{13}$/.test(code)) {
                        found = products.find(p => String(p.barcode) === code.slice(7, 12));
                    }

                    if (found) {
                        setProductFound(found);
                        sock.emit('scan', {
                            sessionId: session,
                            productBarcode: found.id,
                        });
                        playBeep();
                        closeSession();
                    } else {
                        setProductFound(null);
                    }

                    pauseScanner();
                },
                error => console.warn('⚠️ Error de escaneo:', error)
            );
            setIsScanning(true);
        } catch (err) {
            console.error('❌ Error al iniciar el escáner:', err);
        }
    };

    const closeSession = () => {
        pauseScanner();
        setProductFound(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 bg-[#D0F25E] py-4 shadow">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-900">Escáner de Productos</h1>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-6 space-y-8 overflow-y-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Escanea el código de un producto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">Apunta con tu cámara al código de barras o QR.</p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={startScanner}
                                disabled={isScanning}
                                className="flex-1"
                            >
                                {isScanning ? 'Escaneando...' : 'Iniciar escáner'}
                            </Button>
                            <Button variant="destructive" onClick={closeSession} className="flex-1">
                                Cerrar sala
                            </Button>
                        </div>
                        <Separator />
                        <div id="reader" className="w-full aspect-video bg-white border rounded shadow" />
                    </CardContent>
                </Card>

                {productFound && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Producto escaneado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <div><strong>ID:</strong> {productFound.id}</div>
                                <div><strong>Nombre:</strong> {productFound.name}</div>
                                <div><strong>Categoría:</strong> {productFound.category}</div>
                                <div><strong>Proveedor:</strong> {productFound.supplier}</div>
                                <div><strong>Precio:</strong> ${productFound.price}</div>
                                <div><strong>Cantidad:</strong> <Badge variant="secondary">{productFound.amount}</Badge></div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}