import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import SupplierUpdate from "../pages/supplier/SupplierUpdate";
import { updateSupplier } from "../services/SupplierService";
import { toast } from "react-toastify";
import React from "react";

// Mock de updateSupplier
vi.mock("../services/SupplierService", () => ({
  updateSupplier: vi.fn(),
}));

// Mock de toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SupplierUpdate Component", () => {
  beforeEach(() => {
    // Configuramos los datos precargados en localStorage
    localStorage.setItem(
      "supplierData",
      JSON.stringify({ id: 1, name: "Proveedor Test", phone: "+571234567890", email: "test@example.com" })
    );
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders the form with preloaded data", () => {
    render(
      <MemoryRouter>
        <SupplierUpdate />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue("Proveedor Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+571234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  test("updates state when input values change", () => {
    render(
      <MemoryRouter>
        <SupplierUpdate />
      </MemoryRouter>
    );
    // Buscamos el input por su placeholder
    const nameInput = screen.getByPlaceholderText("Escriba el nombre del nuevo proveedor");
    fireEvent.change(nameInput, { target: { value: "Nuevo Nombre" } });
    expect(nameInput.value).toBe("Nuevo Nombre");
  });

  test("calls updateSupplier and shows success toast on successful submit", async () => {
    updateSupplier.mockResolvedValueOnce({ message: "Proveedor actualizado" });
    
    const { container } = render(
      <MemoryRouter>
        <SupplierUpdate />
      </MemoryRouter>
    );
    
    // Seleccionamos el formulario (SupplierForm debe renderizar un elemento <form>)
    const form = container.querySelector("form");
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(updateSupplier).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          id: 1,
          name: "Proveedor Test",
          phone: "+571234567890",
          email: "test@example.com",
        })
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Proveedor actualizado exitosamente",
        expect.any(Object)
      );
    });
  });

  test("shows validation errors if form is incomplete", async () => {
    const { container } = render(
      <MemoryRouter>
        <SupplierUpdate />
      </MemoryRouter>
    );
    
    // Simulamos borrar el nombre para provocar error de validaciÃ³n
    const nameInput = screen.getByPlaceholderText("Escriba el nombre del nuevo proveedor");
    fireEvent.change(nameInput, { target: { value: "" } });
    
    const form = container.querySelector("form");
    fireEvent.submit(form!);
    
    await waitFor(() => {
      // Se espera que se muestren mensajes de error mediante toast.error
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test("shows API error message on request failure", async () => {
    updateSupplier.mockRejectedValueOnce(new Error("Error del servidor"));
    
    const { container } = render(
      <MemoryRouter>
        <SupplierUpdate />
      </MemoryRouter>
    );
    
    const form = container.querySelector("form");
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error del servidor");
    });
  });
});
