import React from "react";
import ClientLayout from "../../../modules/clients/layouts/ClientLayout";
import ProductCard from "../../../modules/clients/components/ProductCard";
import { useState } from "react";
import { filterProduct } from "../../../services/ProductService";
import { useEffect } from "react";
import FilterSelector from "../../../modules/clients/components/FilterSelector";
import { getCategoryAll } from "../../../services/CategoryService";
import { getTagAll } from "../../../services/TagService";
import { getSupplierAll } from "../../../services/SupplierService";
import { parseCurrency } from "../../../lib/utils";
import Pagination from "../../../components/Pagination";
import { Link, useSearchParams } from "react-router-dom";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [elemsPerPage, setElemsPerPage] = useState(10);

  async function getProducts() {
    const params = {};

    const iterator = searchParams.keys();
    let it = iterator.next();
    while (!it.done) {
      params[it.value] = searchParams.get(it.value);

      it = iterator.next();
    }

    const products = await filterProduct(params);
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
    getCategories();
    getTags();
    getSuppliers();
  }, []);

  useEffect(() => {
    getProducts();
  }, [searchParams]);

  function handleCheckboxFilter(values, key) {
    const checkedValues = values.filter((value) => value.checked);

    if (checkedValues.length === 0) {
      searchParams.delete(key);
    } else {
      searchParams.set(
        key,
        checkedValues.map((value) => value.label).join(",")
      );
    }

    setSearchParams(searchParams);
  }

  function handleRadioFilter(values, keys) {
    const checkedValues = values.filter((value) => value.checked);

    if (checkedValues.length === 0) {
      for (const key of keys) {
        searchParams.delete(key);
      }
    } else {
      const value = checkedValues[0];

      for (const key of keys) {
        if (value[key]) {
          searchParams.set(key, value[key]);
        } else {
          searchParams.delete(key);
        }
      }
    }

    setSearchParams(searchParams);
  }

  function searchParamContainsValue(key, value) {
    if (!searchParams.get(key)) return false;

    return searchParams.get(key).split(",").includes(String(value));
  }

  return (
    <ClientLayout title="Client Home">
      <section className="grid grid-cols-[16rem_1fr]">
        <div className="bg-[#BE97F0] p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">Filtro</span>
            <Link
              to={
                searchParams.get("query")
                  ? `?query=${searchParams.get("query")}`
                  : ""
              }
            >
              Reiniciar
            </Link>
          </div>
          <FilterSelector
            title="Categoría"
            options={categories
              .filter((cat) => cat.status === "ACTIVE")
              .map((cat) => ({
                label: cat.name,
                checked: searchParamContainsValue("category", cat.name),
              }))}
            onChange={(values) => handleCheckboxFilter(values, "category")}
          />
          <FilterSelector
            title="Etiqueta"
            options={tags.map((tag) => ({
              label: tag.name,
              checked: searchParamContainsValue("tag", tag.name),
            }))}
            onChange={(values) => handleCheckboxFilter(values, "tag")}
          />
          <FilterSelector
            title="Proveedor"
            options={suppliers.map((supplier) => ({
              label: supplier.name,
              checked: searchParamContainsValue("supplier", supplier.name),
            }))}
            onChange={(values) => handleCheckboxFilter(values, "supplier")}
          />
          <FilterSelector
            title="Precio"
            type="radio"
            options={[
              {
                label: `Menos de ${parseCurrency(10000)}`,
                maxPrice: 10000,
                checked: searchParamContainsValue("maxPrice", 10000),
              },
              ...[
                [10001, 30000],
                [30001, 60000],
                [60001, 100000],
              ].map((item) => ({
                label: `${parseCurrency(item[0])} - ${parseCurrency(item[1])}`,
                minPrice: item[0],
                maxPrice: item[1],
                checked:
                  searchParamContainsValue("minPrice", item[0]) &&
                  searchParamContainsValue("maxPrice", item[1]),
              })),
              {
                label: `Más de ${parseCurrency(100001)}`,
                minPrice: 100001,
                checked: searchParamContainsValue("minPrice", 100001),
              },
            ]}
            onChange={(values) =>
              handleRadioFilter(values, ["minPrice", "maxPrice"])
            }
          />
        </div>
        <div className="bg-[#D1CBFD]">
          <h1 className="text-3xl font-bold text-center my-6">Productos</h1>
          <div className="flex flex-wrap gap-6 justify-center m-6">
            {products.map((product, i) => {
              const elemNumber = i + 1;

              const isInRange =
                elemsPerPage * (currentPage - 1) < elemNumber &&
                elemNumber <= elemsPerPage * currentPage;

              if (!isInRange) return;

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
          <div className="max-w-5xl mx-auto">
            <Pagination
              currentPage={currentPage}
              totalItems={products.length}
              rowsPerPage={elemsPerPage}
              setCurrentPage={setCurrentPage}
              setRowsPerPage={setElemsPerPage}
              rowsOptions={[10, 15, 20, 25, 30, 50]}
            />
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}
