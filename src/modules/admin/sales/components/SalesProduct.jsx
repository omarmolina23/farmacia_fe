const SalesProduct = ({
    numeroProducto,
    name,
    category,
    supplier,
    batch,
    cantidad,
    price,
    precioTotal,
    isSelected,
    onProductSelect
}) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    return (
        <>
            <tr
                className={`text-left h-10 align-middle ${isSelected ? 'bg-gray-100' : ''
                    } hover:bg-gray-50 transition-colors`}
            >
                <td className="px-2">
                    <input
                        type="checkbox"
                        value={numeroProducto}
                        checked={isSelected}
                        onChange={onProductSelect}
                        className="m-2 accent-blue-600"
                        aria-label={`Select product ${name}`}
                        title={`Select product ${name}`}
                    />
                </td>
                <td>{numeroProducto}</td>
                <td className="text-left">{name}</td>
                <td className="text-left">{category}</td>
                <td className="text-left">{supplier}</td>
                <td className="text-center">{batch}</td>
                <td className="text-center">{cantidad}</td>
                <td className="text-center">{formatter.format(price)}</td>
                <td className="text-center">{formatter.format(precioTotal)}</td>
            </tr>
            <tr>
                <td colSpan="9">
                    <hr className="border-t border-gray-300" />
                </td>
            </tr>
        </>
    );
};

export default SalesProduct;
