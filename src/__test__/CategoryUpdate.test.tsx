import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import CategoryUpdate from "../pages/category/CategoryUpdate";
import { updateCategory } from "../services/CategoryService";
import { toast } from "react-toastify";
import React from "react";

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de updateCategory
vi.mock("../services/CategoryService", () => ({
  updateCategory: vi.fn(),
}));

// Mock de toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CategoryUpdate Component", () => {
  const mockCategory = {
    id: "1",
    name: "Categoría Test",
    status: "ACTIVE",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("categoryData", JSON.stringify(mockCategory));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders the form with preloaded data", async () => {
    render(
      <MemoryRouter>
        <CategoryUpdate />
      </MemoryRouter>
    );

    // Verificamos que se muestren los valores precargados
    await waitFor(() => {
      expect(screen.getByDisplayValue("Categoría Test")).toBeInTheDocument();
    });
  });

  test("shows validation error when name is empty", async () => {
    render(
      <MemoryRouter>
        <CategoryUpdate />
      </MemoryRouter>
    );

    // Esperamos que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue("Categoría Test")).toBeInTheDocument();
    });

    // Borramos el nombre para provocar error de validación
    const nameInput = screen.getByDisplayValue("Categoría Test");
    fireEvent.change(nameInput, { target: { value: "" } });
    
    const submitButton = screen.getByText("Guardar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "El nombre de la categoría es obligatorio.",
        expect.any(Object)
      );
    });
  });

  test("calls updateCategory and navigates on successful submission", async () => {
    updateCategory.mockResolvedValueOnce({ message: "Categoría actualizada exitosamente" });
    
    render(
      <MemoryRouter>
        <CategoryUpdate />
      </MemoryRouter>
    );

    // Esperamos que se carguen los datos precargados
    await waitFor(() => {
      expect(screen.getByDisplayValue("Categoría Test")).toBeInTheDocument();
    });

    // Enviamos el formulario
    const form = document.querySelector("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith("1", mockCategory);
      expect(toast.success).toHaveBeenCalledWith(
        "Categoría actualizada exitosamente",
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/admin/category/list");
      // Se debe eliminar el item de localStorage
      expect(localStorage.getItem("categoryData")).toBeNull();
    });
  });

  test("navigates to category list when Cancel button is clicked", async () => {
    render(
      <MemoryRouter>
        <CategoryUpdate />
      </MemoryRouter>
    );

    // Se espera que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue("Categoría Test")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/category/list");
      expect(localStorage.getItem("categoryData")).toBeNull();
    });
  });
});