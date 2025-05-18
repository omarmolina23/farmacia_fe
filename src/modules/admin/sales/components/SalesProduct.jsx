const SalesProduct = ({
    numeroProducto,
    name,
    category,
    supplier,
    cantidad,
    price,
    precioTotal,
    isSelected,
    onProductSelect,
    showCheckbox = true
}) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    // Devuelvo un array de <tr> en lugar de fragmento
    return [
        <tr
            key={`${numeroProducto}-data`}
            className={`text-left h-10 align-middle ${isSelected ? 'bg-gray-100' : ''
                } hover:bg-gray-50 transition-colors`}
        >
            {showCheckbox
                ? <td className="px-2">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onProductSelect}
                        className="m-2 accent-blue-600"
                        aria-label={`Select product ${name}`}
                    />
                </td>
                : <td className="px-2" />
            }
            <td>{numeroProducto}</td>
            <td className="text-left">{name}</td>
            <td className="text-left">{category}</td>
            <td className="text-left">{supplier}</td>
            <td className="text-center">{cantidad}</td>
            <td className="text-center">{formatter.format(price)}</td>
            <td className="text-center">{formatter.format(precioTotal)}</td>
        </tr>,

        // Fila separadora, con key y sin espacios extra
        <tr key={`${numeroProducto}-sep`}>
            <td colSpan="9">
                <hr className="border-t border-gray-300" />
            </td>
        </tr>
    ];
};

export default SalesProduct;
