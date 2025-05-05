// src/components/Category/CategorySection.jsx

import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { getCategoryAll } from "../../../services/CategoryService";
import { filterProduct } from "../../../services/ProductService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

const MAX_CATS = 6;
const ACTIVE = "ACTIVE";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) Trae y filtra categorías ACTIVAS, límite 8
        const allCats = await getCategoryAll();
        if (!Array.isArray(allCats)) throw new Error();
        const filtered = allCats
          .filter((c) => c.status === ACTIVE)
          .slice(0, MAX_CATS);

        // 2) Llamada única: traemos todos los productos de esas categorías
        const names = filtered.map((c) => c.name);
        const prods = await filterProduct({ categories: names });

        // 3) Recorremos productos UNA VEZ y guardamos
        // la PRIMERA imagen para cada categoría
        const firstImageByCat = {};
        let found = 0;
        for (const p of prods) {
          const catName = p.category?.name;
          if (
            catName &&
            names.includes(catName) &&
            p.status === ACTIVE &&
            p.images?.length > 0 &&
            !firstImageByCat[catName]
          ) {
            firstImageByCat[catName] = p.images[0].url;
            found++;
            if (found === filtered.length) break;
          }
        }

        // 4) Construye el array final con imageUrl único
        const result = filtered.map((c) => ({
          ...c,
          imageUrl: firstImageByCat[c.name] || "/img/un-photo.png",
        }));

        setCategories(result);
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar categorías");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="bg-[#B6AEF2] py-12 px-4 sm:px-8 w-full">
      <div className="flex flex-col items-center max-w-6xl mx-auto mb-8">
        <h2
          className="text-white text-center text-4xl sm:text-5xl font-bold mb-12"
          style={fontStyle}
        >
          Categorías de productos
        </h2>

        <div className="flex justify-center flex-wrap gap-6 sm:gap-8 w-full">
          {loading
            ? Array.from({ length: MAX_CATS }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-black rounded-lg shadow-md p-4 flex flex-col justify-between items-center w-[240px] h-[240px] animate-pulse"
                >
                  <Skeleton className="h-6 w-32 mb-4 bg-neutral-200 rounded" />
                  <Skeleton className="h-24 w-24 mb-4 bg-neutral-200 rounded-full" />
                  <Skeleton className="h-5 w-20 bg-neutral-200 rounded" />
                </div>
              ))
            : categories.length === 0 ? (
                <p className="text-white text-center">
                  No hay categorías disponibles
                </p>
              ) : (
                categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/catalog?category=${encodeURIComponent(
                      cat.name
                    ).replace(/%20/g, "+")}`}
                    className="block transform transition-transform duration-300 hover:scale-105"
                  >
                    <CategoryCard
                      title={cat.name}
                      imageUrl={cat.imageUrl}
                    />
                  </Link>
                ))
              )}
        </div>

        {!loading && categories.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link to="/catalog">
              <button className="flex items-center justify-center gap-2 border border-black text-black font-bold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 hover:bg-black hover:text-white hover:scale-105">
                Explorar más
                <span className="text-lg">→</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
