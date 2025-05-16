import { createCreditNote } from "../../../../../../services/FactusService";
import { buildCreditNote } from "./generateCreditNote";

/**
 * Envía la factura electrónica al servicio de Factus y muestra la respuesta.
 * @param {Object} params
 * @param {string|number} [params.ventaId]
 * @param {Object} params.cliente
 * @param {Array} params.productos
 * @returns {Promise<Object>}
 */
export async function sendElectronicInvoice({ ventaId, cliente, productos }) {
    const creditNote = buildCreditNote({ ventaId, cliente, productos });
    console.log("📤 Factura lista para enviar:", JSON.stringify(creditNote, null, 2));

    try {
        const response = await createCreditNote(creditNote);
        console.log("✅ Respuesta Factus:", response);
        return response;
    } catch (error) {
        console.error("❌ Error al enviar la factura electrónica:", error.message);
        throw error;
    }
}

