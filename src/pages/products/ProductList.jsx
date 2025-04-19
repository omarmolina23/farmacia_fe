import { useEffect, useState } from "react";
import ProductLayout from "../../modules/admin/product/layout/ProductLayout";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import ProductTable from "../../modules/admin/product/components/ProductTable";
import {
  getProductAll,
  searchProductByName,
  searchProductByNameOrId,
} from "../../services/ProductService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import FilterStatus from "../../components/FilterStatus";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoverColumn, setHoverColumn] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  const rowsOptions = [10, 15, 20, 25, 30, 50];
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [filterStatus]);

  const fetchProducts = () => {
    getProductAll()
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(
            data.filter((product) => product.status === filterStatus)
          );
        } else {
        }
      })
      .catch((error) => {
        toast.error("Error al obtener proveedores");
      });
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchProducts();
      return;
    }

    try {
      const results = await searchProductByName(query);
      setProducts(results);
    } catch (error) {
      toast.error("Error en la búsqueda de proveedores");
    }
  };

  const handleProductRegister = () => {
    navigate("/admin/product/register");
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key].toLowerCase();
      const valueB = b[sortConfig.key].toLowerCase();
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <ProductLayout title="Productos">
      <div className="w-full bg-white p-3 flex flex-col md:flex-row justify-between items-center gap-3 border-none">
        <SearchBar
          placeholder="Buscar un producto"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-auto"
        />
        <Button
          title="Registrar producto"
          color="bg-[#8B83BA]"
          onClick={handleProductRegister}
          className="w-full md:w-auto"
        />
      </div>

      <FilterStatus
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="w-full overflow-x-auto">
        <table className="text-sm w-full min-w-[600px]">
          <thead className="p-5 bg-[#95A09D] text-left">
            <tr className="h-9">
              <th className="pl-5">Nº</th>
              <th
                onMouseEnter={() => setHoverColumn("name")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("name")}
                className="cursor-pointer pl-2"
              >
                <div className="flex items-center gap-2">
                  Nombre
                  {(hoverColumn === "name" || sortConfig.key === "name") &&
                    (sortConfig.key === "name" &&
                    sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
              <th
                onMouseEnter={() => setHoverColumn("category")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("categoryId")}
                className="cursor-pointer pl-2"
              >
                <div className="flex items-center gap-2">
                  Categoría
                  {(hoverColumn === "category" ||
                    sortConfig.key === "category") &&
                    (sortConfig.key === "categoryId" &&
                    sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
              <th
                onMouseEnter={() => setHoverColumn("price")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("price")}
                className="cursor-pointer pl-2"
              >
                <div className="flex items-center gap-2">
                  Precio
                  {(hoverColumn === "price" ||
                    sortConfig.key === "price") &&
                    (sortConfig.key === "price" &&
                    sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
              <th className="pl-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, index) => (
              <ProductTable
                key={product.id}
                id={product.id}
                index={(currentPage - 1) * rowsPerPage + index}
                name={product.name}
                description={product.description}
                category={product.category.name}
                price={product.price}
                status={product.status}
                concentration={product.concentration}
                activeIngredient={product.activeIngredient}
                weight={product.weight}
                volume={product.volume}
                images={product.images}
                tags={product.ProductTag}
                refreshList={fetchProducts}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={sortedProducts.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        rowsOptions={rowsOptions}
      />
    </ProductLayout>
  );
};

export default ProductList;
