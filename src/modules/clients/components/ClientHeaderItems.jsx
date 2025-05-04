import { LogInIcon } from "lucide-react";
import { ShoppingBasketIcon } from "lucide-react";
import { ShoppingCartIcon } from "lucide-react";
import { Link } from "react-router-dom";

const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

export default function ClientHeaderItems() {
  const items = [
    {
      url: "/catalog",
      content: (
        <>
          <ShoppingCartIcon /> Productos
        </>
      ),
    },
    {
      url: "#",
      content: (
        <>
          <ShoppingBasketIcon /> Mis Compras
        </>
      ),
    },
    {
      url: "/login",
      content: (
        <>
          <LogInIcon /> Iniciar Sesión
        </>
      ),
    },
  ];

  return (
    <>
      <Link
        to="/about"
        className="text-[#4CAF50] font-bold hover:underline flex items-center text-xl"
        style={fontStyle} // Mantener la fuente personalizada
      >
        ¿Quienes somos?
      </Link>
      {items.map((item, i) => {
        return (
          <Link
            key={i}
            to={item.url}
            className="text-black hover:underline flex items-center gap-2"
          >
            {item.content}
          </Link>
        );
      })}
    </>
  );
}
