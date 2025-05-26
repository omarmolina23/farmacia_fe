import { createCreditNote } from "../../../../../../services/FactusService";
import { buildCreditNote } from "./generateCreditNote";

export async function sendCreditNote({ bill_id, reference_code, productos }) {
    const creditNote = buildCreditNote({ bill_id, reference_code, productos });
    try {
        const response = await createCreditNote(creditNote);
        console.log("✅ Nota de crédito enviada exitosamente:", response);
        return response;
    } catch (error) {
        console.error("❌ Error al enviar la NotaCredito:", error.message);
        throw error;
    }
}
