import { SearchIcon } from "lucide-react";
import TextField from "../../../components/TextField";
import ClientLayout from "../../../modules/clients/layouts/ClientLayout";
import PurchaseTable from "../../../modules/clients/components/PurchaseTable";
import { useState } from "react";

export default function Purchases() {
  const [query, setQuery] = useState("");
  const purchases = Array.from({ length: 20 }, (_, i) => ({
    id: `FA25710920${i + 1}`,
    bill_id: 14000 + i,
    number: `SETP9900130${50 + i}`,
    cufe: `cufe-factura-${i + 1}`,
    fecha: `2025-05-${((i % 30) + 1).toString().padStart(2, "0")}`,
    cliente: {
      id: `1000000${(i % 5) + 1}`,
      name: `Cliente ${i + 1}`,
      email: `cliente${i + 1}@correo.com`,
      phone: `32200000${i.toString().padStart(2, "0")}`,
    },
    vendedor: `Vendedor ${
      ["Laura Gómez", "Carlos Ruiz", "Ana Pérez", "Luis Martínez"][i % 4]
    }`,
    productos: [
      {
        id: `prod-${i + 1}-A`,
        lotes: [
          {
            lote_id: `LT${1000 + i}`,
            amount: (i % 5) + 1,
          },
        ],
        name: `Producto A ${i + 1}`,
        category: "Medicamentos",
        supplier: ["Genfar", "Roche", "Siegfried Rhein", "Bayer"][i % 4],
        cantidad: (i % 10) + 1,
        price: 1000 + i * 100,
      },
      {
        id: `prod-${i + 1}-B`,
        lotes: [
          {
            lote_id: `LT${2000 + i}`,
            amount: (i % 3) + 1,
          },
        ],
        name: `Producto B ${i + 1}`,
        category: "Medicamentos",
        supplier: ["Genfar", "Roche", "Siegfried Rhein", "Bayer"][(i + 1) % 4],
        cantidad: (i % 5) + 2,
        price: 1500 + i * 80,
      },
    ],
  }));

  function handleSearch() {
    console.log(query);
  }

  return (
    <ClientLayout>
      <section className="bg-[#C8C8CC] p-5">
        <h1 className="text-4xl font-bold my-5"> Tu Historial</h1>

        <label className="flex flex-col gap-2">
          Número de identificación
          <div className="flex gap-2">
            <TextField
              placeholder="Intruduzca su identificación"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="bg-black text-white rounded-xl size-12 flex items-center justify-center"
              onClick={handleSearch}
            >
              <SearchIcon />
            </button>
          </div>
        </label>

        <div className="my-10">
          <PurchaseTable purchases={purchases} />
        </div>
      </section>
    </ClientLayout>
  );
}
