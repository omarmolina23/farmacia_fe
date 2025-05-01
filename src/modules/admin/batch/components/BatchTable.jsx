import React from "react";

const BatchTable = ({ index, batch, refreshList }) => {
  const {
    id,
    number_batch,
    amount,
    totalValue,
    entryDate,
    expirationDate,
    isExpired,
    status,
    product,
    supplier,
  } = batch;


  return (
    <tr className="text-left h-9 border-b">
      <td className="pl-4">{index + 1}</td>
      <td className="pl-4">{number_batch}</td>
      <td className="pl-4">{amount}</td>
      <td className="pl-4">{totalValue}</td>
      <td className="pl-4">{supplier?.name || "Sin proveedor"}</td>
      <td className="pl-4">{new Date(entryDate).toLocaleDateString()}</td>
      <td className="pl-4">{new Date(expirationDate).toLocaleDateString()}</td>
      <td className="pl-4">{isExpired ? "Sí" : "No"}</td>
    </tr>
  );
};

export default BatchTable;
