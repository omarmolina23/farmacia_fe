import { Html5Qrcode } from 'html5-qrcode';
import { getProductAll } from "../../services/SalesService";
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_BARCODE_URL;

const ScanPage = () => {
    const { session } = useParams();
    const scannerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [sock, setSocket] = useState(null);
    const [products, setProducts] = useState([]);
    const [productFound, setProductFound] = useState(null);

    useEffect(() => {
        getProductAll()
            .then(data => {
                console.log("✅ Productos cargados:", data);
                setProducts(data);
            })
            .catch(err => console.error('❌ Error al cargar productos:', err));
    }, []);

    useEffect(() => {
        getProductAll()
            .then(data => {
                console.log("✅ Productos cargados:", data);
                setProducts(data);
            })
            .catch(err => console.error('❌ Error al cargar productos:', err));
    }, []);

    useEffect(() => {
        const sock = io(SOCKET_SERVER_URL, {
            reconnectionAttempts: 5,
        });

        setSocket(sock);
        console.log("🔌 Conectando socket...");

        sock.on("connect", () => {
            console.log("📱 Teléfono conectado con ID:", sock.id);
            sock.emit("join-room", session);
            console.log(`📱 Unido a la sala '${session}'`);
        });
        /*
                return () => {
                    sock.disconnect();
                    console.log("🔌 Socket desconectado");
                };*/
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
        } catch (err) {
            console.warn('⚠️ No se pudo reproducir sonido:', err);
        }
    };

    const pauseScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
                scannerRef.current = null;
                console.log("⏹️ Escáner detenido");
            } catch (err) {
                console.warn('⚠️ Error al detener el escáner:', err.message);
            }
        }
        setIsScanning(false);
    };

    const closeSession = () => {
        pauseScanner();
        setProductFound(null);
        if (sock) sock.disconnect();
        console.log("🚪 Sesión cerrada");
    };

    const startScanner = async () => {
        if (!sock) {
            console.error('❌ Socket no está inicializado');
            return;
        }

        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode('reader');
        }

        try {
            await scannerRef.current.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                decoded => {
                    const productId = decoded.trim();
                    console.log("📦 Código leído:", productId);
                    console.log("📦 Productos disponibles al escanear:", products);

                    const found = products.find(p => String(p.id).trim() === productId);

                    if (found) {
                        console.log("✅ Producto encontrado:", found);
                        setProductFound(found);
                        playBeep();
                        console.log("📱 Escaneando producto:", found.id );
                        sock.emit("scan", {
                            sessionId: session,
                            productBarcode: found.id ,
                        });
                    } else {
                        console.warn('⚠️ Producto no encontrado:', productId);
                        setProductFound(null);
                    }

                    pauseScanner(); // Pausar después de escanear
                },
                error => {
                    console.warn('⚠️ Error de escaneo:', error);
                }
            );

            setIsScanning(true);
            console.log("📸 Escáner iniciado");
        } catch (err) {
            console.error('❌ Error al iniciar el escáner:', err);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50">
            <header className="z-50 fixed top-0 w-full bg-[#D0F25E] p-4 flex justify-between items-center shadow-md">
                <h1 className="text-lg lg:text-xl font-bold text-gray-800">Escáner</h1>
            </header>

            <main className="flex flex-col flex-1 pt-20 px-4 sm:px-6 lg:px-8 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 text-center sm:text-left">
                    Escanear producto
                </h2>

                <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-3">
                    <button
                        onClick={startScanner}
                        disabled={isScanning}
                        className={`px-6 py-2 rounded text-white font-medium transition duration-300 ${isScanning
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#8B83BA] hover:bg-[#756BA4]'
                            }`}
                    >
                        Iniciar
                    </button>
                    <button
                        onClick={closeSession}
                        className="px-6 py-2 rounded text-white font-medium bg-[#818180] hover:bg-[#6d6d6d] transition duration-300"
                    >
                        Cerrar sala
                    </button>
                </div>

                <div
                    id="reader"
                    className="w-full border rounded shadow bg-white"
                    style={{ height: 400 }}
                />

                {productFound && (
                    <div className="mt-6 bg-white rounded-lg shadow p-6 w-full max-w-lg mx-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Producto escaneado</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li><strong>ID:</strong> {productFound.id}</li>
                            <li><strong>Nombre:</strong> {productFound.name}</li>
                            <li><strong>Categoría:</strong> {productFound.category}</li>
                            <li><strong>Proveedor:</strong> {productFound.supplier}</li>
                            <li><strong>Precio:</strong> ${productFound.price}</li>
                            <li><strong>Cantidad:</strong> {productFound.amount}</li>
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ScanPage;
