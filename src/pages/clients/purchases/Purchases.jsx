import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { getSalesUser } from "../../../services/SalesService";
import { searchClientById } from "../../../services/ClientService";
import TextField from "../../../components/TextField";
import ClientLayout from "../../../modules/clients/layouts/ClientLayout";
import PurchaseTable from "../../../modules/clients/components/PurchaseTable";
import VerifyModal from "../../../modules/clients/components/VerifyModal";

export default function Purchases() {
  const [query, setQuery] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [clientEmail, setClientEmail] = useState('');


  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const client = await searchClientById(query);
      if (!client.phone) throw new Error();
      setClientEmail(client.email);
      setShowVerify(true);
    } catch {
      setError('Cliente no encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = async () => {
    try {
      const sales = await getSalesUser(query);
      setPurchases(sales);
    } catch {
      setError('Error al cargar compras.');
    } finally {
      setShowVerify(false);
    }
  };

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
      {showVerify && (
        <VerifyModal
          emailReal={clientEmail}
          onVerified={handleVerified}
          onClose={() => setShowVerify(false)}
        />
      )}
    </ClientLayout>
  );
}
