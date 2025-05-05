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

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  useEffect(() => {
    fetchCategories();
  }, [filterStatus]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategoryAll();
      if (!Array.isArray(data)) return;

      const filtered = data
        .filter((cat) => cat.status === filterStatus)
        .slice(0, 8);

      const categoriesWithImage = await Promise.all(
        filtered.map(async (category) => {
          try {
            const products = await filterProduct({
              categories: [category.name],
            });

            const valid = products.filter(
              (p) =>
                p.status === "ACTIVE" &&
                p.images?.length > 0 &&
                p.category?.name === category.name
            );

            const randomProduct =
              valid[Math.floor(Math.random() * valid.length)];

            return {
              ...category,
              imageUrl: randomProduct
                ? randomProduct.images[0].url
                : "/img/un-photo.png",
            };
          } catch {
            return {
              ...category,
              imageUrl: "/img/un-photo.png",
            };
          }
        })
      );

      setCategories(categoriesWithImage);
    } catch {
      toast.error("Error al obtener categorías");
    } finally {
      setLoading(false);
    }
  };

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
            ? 
            Array.from({ length: 6 }).map((_, idx) => (
              <div
              key={idx}
              className="bg-white border border-black rounded-lg shadow-md p-4 flex flex-col justify-between items-center w-[240px] h-[240px] animate-pulse"
            >
              <Skeleton className="h-6 w-32 bg-neutral-200 rounded mb-4 animate-pulse" />
              <Skeleton className="h-24 w-24 bg-neutral-200 rounded-full mb-4 animate-pulse" />
              <Skeleton className="h-5 w-20 bg-neutral-200 rounded animate-pulse" />
            </div>
            ))
            : categories.length === 0
              ? <p className="text-white text-center">No hay categorías disponibles</p>
              : categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/catalog?category=${encodeURIComponent(
                    category.name
                  ).replace(/%20/g, "+")}`}
                  className="block transform transition-transform duration-300 hover:scale-105"
                >
                  <CategoryCard
                    title={category.name}
                    imageUrl={category.imageUrl}
                  />
                </Link>
              ))}
        </div>

        {!loading && (
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
