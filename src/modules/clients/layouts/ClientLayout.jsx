import { motion } from "framer-motion";
import ClientHeader from "../components/ClientHeader";
import Footer from "../components/Footer";
import WhatsappFloatButton from "../components/WhatsappFloatButton";

const ClientLayout = ({ children, title }) => {
  const pageVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 2, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  const pageTransition = {
    duration: 0.3,
    ease: "easeInOut",
  };
  return (
    <div className="flex flex-col min-h-screen w-full">
      <ClientHeader title={title} />

      <main className="flex-1 overflow-auto pt-20">
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
        >
          {children}
          <WhatsappFloatButton />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientLayout;