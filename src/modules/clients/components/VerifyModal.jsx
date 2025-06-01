import { sendCodeVerification } from "../../../services/ClientService";
import gsap from "gsap";
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";

// Variantes de animación
const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 30, opacity: 0 },
};

export default function VerifyModal({ onClose, emailReal, onVerified }) {
    const [step, setStep] = useState('confirm');
    const [inputEmail, setInputEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeReceived, setCodeReceived] = useState('');
    const [sending, setSending] = useState(false);
    const loaderRef = useRef(null);

    const handleSendCode = async () => {
        const normalizedInput = inputEmail.trim().toLowerCase();
        const normalizedReal = emailReal.trim().toLowerCase();

        if (normalizedInput !== normalizedReal) {
            toast.error('El correo ingresado no coincide.');
            return;
        }

        setSending(true);
        gsap.to(loaderRef.current, { rotation: 360, duration: 1, repeat: -1, ease: 'linear' });

        try {
            const response = await sendCodeVerification({ email: normalizedInput });
            setCodeReceived(response.data.code);
            toast.success('Código enviado correctamente al correo');
            setStep('verify');
        } catch (error) {
            toast.error('Error al enviar el código');
        } finally {
            setSending(false);
            gsap.killTweensOf(loaderRef.current);
        }
    };

    const handleVerifyCode = () => {
        if (code === codeReceived) {
            toast.success('Código verificado');
            onVerified();
        } else {
            toast.error('Código incorrecto');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                variants={backdropVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-[#f8f8f8] p-6 rounded-2xl w-[90%] max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    variants={modalVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    {step === 'confirm' && (
                        <div className="flex flex-col items-center">
                            <img src="/img/verification-phone.png" alt="VerifyEmail" className="h-auto w-[63%]" />
                            <h2 className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-lm shadow-inner mb-4">Correo Electrónico</h2>
                            <p className="text-gray-500 text-sm mb-4 text-center px-4">
                                Ingrese su correo para enviar un código de verificación.
                            </p>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className="w-full border rounded px-3 py-2 text-sm mb-4 focus:outline-none"
                                value={inputEmail}
                                onChange={(e) => setInputEmail(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white font-semibold w-full py-2 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
                                onClick={handleSendCode}
                                disabled={sending}
                            >
                                {sending ? (
                                    <span className="flex justify-center">
                                        <div ref={loaderRef} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </span>
                                ) : (
                                    'Enviar Código'
                                )}
                            </button>
                        </div>
                    )}

                    {step === 'verify' && (
                        <div className="flex flex-col items-center">
                            <img src="/img/verification-code.png" alt="Code" className="h-auto w-[63%]" />
                            <h2 className="text-xl font-semibold mb-2">Código de verificación</h2>
                            <p className="text-gray-500 text-sm mb-4 text-center px-4">
                                Por favor, ingrese el código de 6 dígitos que enviamos a su teléfono. Expira en 10 minutos.
                            </p>
                            <div className="flex justify-between space-x-2 mb-4 w-full">
                                {[...Array(6)].map((_, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength="1"
                                        className="w-full text-center border rounded-lg py-2 text-lg font-bold"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length === 1 && i < 5) {
                                                document.getElementById(`otp-${i + 1}`)?.focus();
                                            }
                                            const newCode = code.split('');
                                            newCode[i] = val;
                                            setCode(newCode.join(''));
                                        }}
                                        id={`otp-${i}`}
                                    />
                                ))}
                            </div>
                            <button
                                className="bg-green-500 text-white font-semibold w-full py-2 rounded-full hover:bg-green-600 transition"
                                onClick={handleVerifyCode}
                            >
                                Verificar Código
                            </button>
                        </div>
                    )}

                    <button
                        className="text-gray-400 text-sm mt-6 hover:underline block mx-auto"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
