import { TagIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ name, img, tags, price, url }) {
  return (
    <div className="bg-white p-5 rounded-lg border-2 border-black w-fit">
      <div
        className={`grid grid-cols-[auto_1fr] w-64 gap-4 items-center ${
          tags.length === 0 ? "text-white" : ""
        }`}
      >
        <TagIcon />
        <div className="flex items-center gap-2 flex-nowrap overflow-auto">
          {tags.map((tag, i) => {
            return (
              <span
                key={i}
                className="bg-[#D0F25E] py-1 px-2 rounded-full text-sm text-nowrap"
              >
                {tag.tag.name}
              </span>
            );
          })}
        </div>
      </div>

      <img
        className="size-48 object-contain my-4 mx-auto"
        src={img || "/img/default-med.png"}
      />
      <div className="w-64">
        <h2 className="font-bold text-2xl">{name}</h2>
        <div className="flex items-center justify-between mt-2">
          <span>
            {parseInt(price).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </span>
          <Link
            to={url}
            className="inline-flex items-center justify-center gap-2 text-sm"
          >
            Ver más <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
