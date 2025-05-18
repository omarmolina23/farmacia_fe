import { createInvoice } from "../../../../../../services/FactusService";
import { buildInvoiceData } from "./generateInvoiceData";

/**
 * Envía la factura electrónica al servicio de Factus y muestra la respuesta.
 * @param {Object} params
 * @param {string|number} [params.ventaId]
 * @param {Object} params.cliente
 * @param {Array} params.productos
 * @returns {Promise<Object>}
 */
export async function sendElectronicInvoice({ ventaId, cliente, productos }) {
    const facturaData = buildInvoiceData({ ventaId, cliente, productos });
    console.log("Factura lista para enviar:", JSON.stringify(facturaData, null, 2));

    try {
        const response = await createInvoice(facturaData);
        console.log("Respuesta Factus:", response);
        return response;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 409 && data?.message?.includes("factura pendiente")) {
                console.warn("⚠️ Existe una factura pendiente por enviar a la DIAN. Revisa el estado en Factus.");
            } else {
                console.error("❌ Error del servidor Factus:", data);
            }
        } else {
            console.error("❌ Error en la petición de Factus:", error.message);
        }
        throw error;
    }
}
