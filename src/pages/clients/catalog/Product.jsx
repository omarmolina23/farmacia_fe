import React from "react";
import ClientLayout from "../../../modules/clients/layouts/ClientLayout";
import { useState } from "react";
import { searchProductByNameOrId } from "../../../services/ProductService";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../../../components/ImageCarousel";
import { parseCurrency } from "../../../lib/utils";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  async function getProduct() {
    const products = await searchProductByNameOrId(id);
    setProduct(products[0]);
  }

  useEffect(() => {
    getProduct();
  }, [id]);

  if (!product) return;

  console.log(product);

  return (
    <ClientLayout title="Client Home">
      <section className="bg-[#C0DAE5]">
        <div className="max-w-6xl mx-auto p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="mb-8 mx-12">
              <ImageSlider
                images={
                  product.images.length > 0
                    ? product.images
                    : [{ url: "/img/default-med.png" }]
                }
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <strong className="text-xl font-normal">
                {parseCurrency(product.price)}
              </strong>
              {product.status === "ACTIVE" ? (
                <strong className="py-1 px-2 rounded-full bg-green-600 text-white font-normal">
                  Disponible
                </strong>
              ) : (
                <strong className="py-1 px-2 rounded-full bg-red-600 text-white font-normal">
                  Agotado
                </strong>
              )}
              <p>{product.description}</p>
            </div>
          </div>
          <div className="my-5 h-[1px] bg-black"></div>

          <div className="w-11/12 mx-auto">
            <h2 className="font-bold text-2xl mt-4 mb-2">Ficha técnica</h2>
            <article className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl bg-white">
              {product.concentration && (
                <dl>
                  <dt className="font-bold">CONCENTRACIÓN:</dt>
                  <dd>{product.concentration}</dd>
                </dl>
              )}

              {product.activeIngredientation && (
                <dl>
                  <dt className="font-bold">PRINCIPIO ACTIVO:</dt>
                  <dd>{product.activeIngredient}</dd>
                </dl>
              )}

              {product.weight && (
                <dl>
                  <dt className="font-bold">PESO:</dt>
                  <dd>{product.weight}</dd>
                </dl>
              )}

              {product.volume && (
                <dl>
                  <dt className="font-bold">VOLUMEN:</dt>
                  <dd>{product.volume}</dd>
                </dl>
              )}

              {product.ProductTag.length > 0 && (
                <dl className="sm:col-span-2">
                  <dt className="font-bold">ETIQUETAS:</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-4">
                      {product.ProductTag.map((productTag) => {
                        return (
                          <li className="px-2 py-1 bg-[#253473] text-white rounded-full text-sm">
                            {productTag.tag.name}
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </dl>
              )}
            </article>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}
