import React from "react";
import ClientLayout from "../../../modules/clients/layouts/ClientLayout";
import ProductCard from "../../../modules/clients/components/ProductCard";
import { useState } from "react";
import { getProductAll } from "../../../services/ProductService";
import { useEffect } from "react";

export default function Catalog() {
  const [products, setProducts] = useState([]);

  async function getProducts() {
    const products = await getProductAll();
    setProducts(products);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ClientLayout title="Client Home">
      <section className="grid grid-cols-[auto_1fr]">
        <div className="bg-[#BE97F0]"></div>
        <div className="bg-[#D1CBFD]">
          <h1 className="text-3xl font-bold text-center my-6">Productos</h1>
          <div className="flex flex-wrap gap-6 justify-center m-6">
            {products.map((product, i) => {
              return (
                <ProductCard
                  key={i}
                  name={product.name}
                  price={product.price}
                  tags={product.ProductTag}
                  img={product.images.length > 0 ? product.images[0].url : null}
                  url={`/catalog/${product.id}`}
                />
              );
            })}
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}
