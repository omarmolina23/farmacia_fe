import { createCreditNote } from "../../../../../../services/FactusService";
import { buildCreditNote } from "./generateCreditNote";

export async function sendCreditNote({ bill_id, reference_code, productos }) {
    console.log("📤 Enviando CreditNote...");
    const creditNote = buildCreditNote({ bill_id, reference_code, productos });
    console.log("📤 Nota Credito lista para enviar:", JSON.stringify(creditNote, null, 2));

    try {
        const response = await createCreditNote(creditNote);
        console.log("✅ Respuesta Factus:", response);
        return response.data;
    } catch (error) {
        console.error("❌ Error al enviar la NotaCredito:", error.message);
        throw error;
    }
}
