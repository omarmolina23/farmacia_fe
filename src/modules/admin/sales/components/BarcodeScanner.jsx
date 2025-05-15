import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: 250 },
                    (decodedText) => {
                        onScanSuccess(decodedText);
                        html5QrCode.stop().then(onClose).catch(console.error);
                    },
                    (errorMessage) => {
                        console.log("Escaneo fallido", errorMessage);
                    }
                );
            }
        });

        return () => {
            html5QrCode.stop().catch(console.error);
        };
    }, []);

    return <div id="reader" style={{ width: "100%" }} />;
};

export default BarcodeScanner;
