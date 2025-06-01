// src/components/ModalResetPassword.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPassword as forgotPasswordService } from "../../services/UserService";
import { toast } from "react-toastify";
import ModalSendReset from "../../components/ModalSendReset";
import ModalResetPasswordField from "../../components/ModalResetPasswordField";

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

const modalVariants = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0,  opacity: 1 },
  exit:    { y: 30, opacity: 0 },
};

const ModalResetPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, ingresa un correo electrónico.", { position: "top-center" });
      return;
    }
    try {
      await forgotPasswordService(email);
      setIsSuccess(true);
      toast.success("Correo enviado exitosamente", { position: "top-center" });
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        {/* 
          Quitamos `bg-white p-6 rounded-lg shadow-lg w-96 text-center`
          para que solo el hijo lo tenga, evitando duplicar el fondo blanco. 
        */}
        <AnimatePresence exitBeforeEnter>
          {isSuccess ? (
            <motion.div
              key="send"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ModalSendReset onClose={onClose} />
            </motion.div>
          ) : (
            <motion.div
              key="field"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ModalResetPasswordField
                email={email}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onClose={onClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalResetPassword;
