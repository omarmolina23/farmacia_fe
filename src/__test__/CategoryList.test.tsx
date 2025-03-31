import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import CategoryList from "../pages/category/CategoryList"; // Ajusta la ruta según tu proyecto
import { getCategoryAll, searchCategory } from "../services/CategoryService";
import { toast } from "react-toastify";
import React from "react";

// Mock de useNavigate antes de importar el componente
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mocks de los servicios
vi.mock("../services/CategoryService", () => ({
  getCategoryAll: vi.fn(),
  searchCategory: vi.fn(),
}));

// Mock de toast
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("CategoryList Component", () => {
  // Datos de prueba: se definen tres categorías, de las cuales solo dos están activas.
  const mockCategories = [
    { id: 1, name: "Category 1", status: "ACTIVE" },
    { id: 2, name: "Category 2", status: "ACTIVE" },
    { id: 3, name: "Category 3", status: "INACTIVE" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Para la carga inicial, se retorna todas las categorías
    getCategoryAll.mockResolvedValue(mockCategories);
  });

  test("renders category list with only ACTIVE categories", async () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    // Esperamos que se llame al servicio para obtener categorías
    await waitFor(() => {
      expect(getCategoryAll).toHaveBeenCalled();
    });

    // Se muestran solo las categorías con status ACTIVE (Category 1 y Category 2)
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
    // La categoría inactiva no debe aparecer
    expect(screen.queryByText("Category 3")).not.toBeInTheDocument();
  });

  test("handles search input and updates category list", async () => {
    // Simulamos que la búsqueda retorna solo la categoría 1
    const searchResults = [{ id: 1, name: "Category 1", status: "ACTIVE" }];
    searchCategory.mockResolvedValue(searchResults);

    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    // Buscamos el input de búsqueda por su placeholder
    const searchInput = screen.getByPlaceholderText("Buscar categoría");
    fireEvent.change(searchInput, { target: { value: "Category 1" } });

    await waitFor(() => {
      expect(searchCategory).toHaveBeenCalledWith("Category 1");
    });

    // Solo debe renderizarse la categoría 1
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.queryByText("Category 2")).not.toBeInTheDocument();
  });

  test("navigates to category register page when 'Crear categoría' button is clicked", async () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    const createButton = screen.getByText("Crear categoría");
    fireEvent.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/category/register");
  });
});
