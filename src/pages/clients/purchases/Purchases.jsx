import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { getSalesUser } from "../../../services/SalesService";
import TextField from "../../../components/TextField";
import ClientLayout from "../../../modules/clients/layouts/ClientLayout";
import PurchaseTable from "../../../modules/clients/components/PurchaseTable";

export default function Purchases() {
  const [query, setQuery] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const sales = await getSalesUser(query);
      setPurchases(sales); // Asegúrate que el backend responde con un array de ventas
    } catch (err) {
      console.error("Error al obtener las compras:", err);
      setError("No se pudieron cargar las compras. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ClientLayout>
      <section className="bg-[#C8C8CC] p-5">
        <h1 className="text-4xl font-bold my-5">Tu Historial</h1>

        <label className="flex flex-col gap-2">
          Número de identificación
          <div className="flex gap-2">
            <TextField
              placeholder="Introduzca su identificación"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <button
              className="bg-black text-white rounded-xl size-12 flex items-center justify-center"
              onClick={handleSearch}
              disabled={loading}
            >
              <SearchIcon />
            </button>
          </div>
        </label>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="my-10">
          {loading ? (
            <p>Cargando compras...</p>
          ) : (
            <PurchaseTable purchases={purchases} />
          )}
        </div>
      </section>
    </ClientLayout>
  );
}
