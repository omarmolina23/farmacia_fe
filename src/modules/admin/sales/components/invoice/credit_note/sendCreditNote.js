import { createCreditNote } from "../../../../../../services/FactusService";
import { buildCreditNote } from "./generateCreditNote";

export async function sendCreditNote({ bill_id, reference_code, productos }) {
    const creditNote = buildCreditNote({ bill_id, reference_code, productos });
    console.log("📤 Nota Credito lista para enviar:", JSON.stringify(creditNote, null, 2));

    try {
        console.log("Enviada CreditNote.");
        /*const response = await createCreditNote(creditNote);
        console.log("✅ Respuesta Factus:", response);
        return response;*/
    } catch (error) {
        console.error("❌ Error al enviar la NotaCredito:", error.message);
        throw error;
    }
}

