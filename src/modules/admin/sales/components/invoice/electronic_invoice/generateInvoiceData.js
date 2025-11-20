// src/modules/admin/sales/invoice/generateInvoiceData.js

/**
 * Genera un ID de venta aleatorio (9 dígitos).
 * @returns {string}
 */
function generateRandomVentaId() {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
}

/**
 * Construye la estructura de datos para la factura electrónica según esquema Factus.
 * @param {Object} params
 * @param {string|number} [params.ventaId]
 * @param {Object} params.cliente
 * @param {Array} params.productos
 * @returns {Object}
 */
export function buildInvoiceData({ fecha, ventaId, cliente, productos }) {
    const idVenta = ventaId || generateRandomVentaId();

    const nextDay = new Date(fecha);
    nextDay.setDate(fecha.getDate() + 1);

    const formatDate = d => d.toISOString().split("T")[0];
    const formatTime = () => "00:00:00";    

    const items = productos.map(producto => ({
        code_reference: String(producto.id),
        name: producto.name,
        quantity: producto.amount,
        discount_rate: 0,
        price: Number(producto.price),
        tax_rate: "19.00",
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: []
    }));

    return {
        numbering_range_id: 8,
        reference_code: `FA${idVenta}`,
        observation: "",
        payment_form: "1",
        payment_method_code: "10",
        billing_period: {
            start_date: formatDate(fecha),
            start_time: formatTime(),
            end_date: formatDate(nextDay),
            end_time: formatTime()
        },
        customer: {
            identification: cliente.id,
            company: "",
            trade_name: "",
            names: cliente.name,
            address: "N/A",
            email: cliente.email,
            phone: cliente.phone,
            legal_organization_id: "2",
            tribute_id: "21",
            identification_document_id: "3",
            municipality_id: "841"
        },
        items
    };
}

