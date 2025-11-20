// src/modules/admin/sales/invoice/generateInvoiceData.js

/**
 * Construye la estructura de datos para la factura electrónica según esquema Factus.
 * @param {Object} params
 * @param {string|number} [params.ventaId]
 * @param {Object} params.cliente
 * @param {Array} params.productos
 * @returns {Object}
 */
export function buildCreditNote({ bill_id, reference_code, productos }) {
// estos son los productos que se devuelven 
    const items = productos.map(producto => ({
        code_reference: String(producto.id),
        name: producto.nombre,
        quantity: producto.cantidad,
        discount_rate: 0,
        price: Number(producto.precio),
        tax_rate: "19.00",
        unit_measure_id: 70,    
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: []
    }));

    return {
        numbering_range_id: 9,
        //* 
        // 1. Devolución parcial de los bienes y/o no aceptación parcial del servicio. 
        // 2. Anulación de factura electrónica.
        correction_concept_code: 2, 
        customization_id: 20,
        bill_id: bill_id,
        reference_code: reference_code,
        observation: "",
        payment_method_code: "10",
        items
    };
}

