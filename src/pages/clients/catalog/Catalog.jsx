import React from "react";
import ClientLayout from "../../../modules/clients/layouts/ClientLayout";
import ProductCard from "../../../modules/clients/components/ProductCard";
import { useState } from "react";
import { getProductAll } from "../../../services/ProductService";
import { useEffect } from "react";
import FilterSelector from "../../../modules/clients/components/FilterSelector";
import { getCategoryAll } from "../../../services/CategoryService";
import { getTagAll } from "../../../services/TagService";
import { getSupplierAll } from "../../../services/SupplierService";
import { parseCurrency } from "../../../lib/utils";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState({});

  async function getProducts() {
    const products = await getProductAll();
    setProducts(products);
  }

  async function getCategories() {
    const categories = await getCategoryAll();
    setCategories(categories);
  }

  async function getTags() {
    const tags = await getTagAll();
    setTags(tags);
  }

  async function getSuppliers() {
    const suppliers = await getSupplierAll();
    setSuppliers(suppliers);
  }

  useEffect(() => {
    getProducts();
    getCategories();
    getTags();
    getSuppliers();
  }, []);

  function handleFilterChange(values, title) {
    const newFilters = {
      ...filters,
    };

    newFilters[title] = values;

    console.log(newFilters);

    setFilters(newFilters);
  }

  return (
    <ClientLayout title="Client Home">
      <section className="grid grid-cols-[16rem_1fr]">
        <div className="bg-[#BE97F0] p-5 flex flex-col gap-4">
          <span className="text-2xl font-bold mb-2">Filtro</span>
          <FilterSelector
            title="Categoria"
            options={categories
              .filter((cat) => cat.status === "ACTIVE")
              .map((cat) => ({ label: cat.name, value: cat.id }))}
            onChange={handleFilterChange}
          />
          <FilterSelector
            title="Etiqueta"
            options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
            onChange={handleFilterChange}
          />
          <FilterSelector
            title="Proveedor"
            options={suppliers.map((supplier) => ({
              label: supplier.name,
              value: supplier.id,
            }))}
            onChange={handleFilterChange}
          />
          <FilterSelector
            title="Precio"
            options={[
              {
                label: `Menos de ${parseCurrency(10000)}`,
                max: 10000,
              },
              {
                label: `${parseCurrency(10001)} - ${parseCurrency(30000)}`,
                min: 10001,
                max: 30000,
              },
              {
                label: `${parseCurrency(30001)} - ${parseCurrency(60000)}`,
                min: 30001,
                max: 60000,
              },
              {
                label: `${parseCurrency(60001)} - ${parseCurrency(100000)}`,
                min: 60001,
                max: 100000,
              },
              {
                label: `Más de ${parseCurrency(100001)}`,
                min: 100001,
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
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
