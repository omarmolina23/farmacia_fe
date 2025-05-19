import { createCreditNote } from "../../../../../../services/FactusService";
import { buildCreditNote } from "./generateCreditNote";

export async function sendCreditNote({ bill_id, reference_code, productos }) {
    const creditNote = buildCreditNote({ bill_id, reference_code, productos });
    try {
        const response = await createCreditNote(creditNote);
        return response.data;
    } catch (error) {
        console.error("❌ Error al enviar la NotaCredito:", error.message);
        throw error;
    }
}
