import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import CategoryRegister from "../pages/category/CategoryRegister";
import { createCategory } from "../services/CategoryService";
import { toast } from "react-toastify";
import React from "react";

// Mock de servicios
vi.mock("../services/CategoryService", () => ({
  createCategory: vi.fn(),
}));

// Mock de toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de useNavigate de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CategoryRegister Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the form fields correctly", () => {
    render(
      <MemoryRouter>
        <CategoryRegister />
      </MemoryRouter>
    );
    // Verifica que se muestre el input con el placeholder esperado.
    expect(
      screen.getByPlaceholderText("Escriba el nombre de la nueva categoría")
    ).toBeInTheDocument();
  });

  test("shows validation error when name is empty", async () => {
    render(
      <MemoryRouter>
        <CategoryRegister />
      </MemoryRouter>
    );
    // El input se mantiene vacío para provocar la validación.
    const submitButton = screen.getByText("Guardar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "El nombre de la categoría es obligatorio.",
        expect.any(Object)
      );
    });
  });

  test("calls createCategory and shows success toast on successful submission", async () => {
    createCategory.mockResolvedValue({ message: "Categoría creada exitosamente" });
    
    render(
      <MemoryRouter>
        <CategoryRegister />
      </MemoryRouter>
    );
    
    // Simulamos escribir un nombre válido en el input.
    const input = screen.getByPlaceholderText("Escriba el nombre de la nueva categoría");
    fireEvent.change(input, { target: { value: "Nueva Categoría" } });
    
    // Se hace clic en el botón "Guardar" para enviar el formulario.
    const submitButton = screen.getByText("Guardar");
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({ name: "Nueva Categoría", status: "ACTIVE" });
      expect(toast.success).toHaveBeenCalledWith(
        "Categoría creada exitosamente",
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/admin/category/list");
    });
  });

  test("navigates back when Cancelar is clicked", async () => {
    render(
      <MemoryRouter>
        <CategoryRegister />
      </MemoryRouter>
    );
    
    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/category/list");
    });
  });
});