import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import UserUpdate from "../pages/user/UserUpdate";
import { updateUser, searchUser } from "../services/UserService";
import { toast } from "react-toastify";
import React from "react";

// Mock de los servicios
vi.mock("../services/UserService", () => ({
  updateUser: vi.fn(),
  searchUser: vi.fn(),
}));

// Mock de toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("UserUpdate Component", () => {
  const mockUser = {
    id: 1,
    name: "Test User",
    phone: "+571234567890",
    email: "test@example.com",
    birthdate: "1990-01-01T00:00:00.000Z",
    isAdmin: true,
    isEmployee: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Configuramos el mock para searchUser para que retorne el usuario
    searchUser.mockResolvedValue([mockUser]);
  });

  test("updates state when input values change", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/user/update/1"]}>
        <Routes>
          <Route path="/admin/user/update/:id" element={<UserUpdate />} />
        </Routes>
      </MemoryRouter>
    );

    // Esperamos que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Obtenemos el input del nombre mediante su valor precargado y lo modificamos
    const nameInput = screen.getByDisplayValue("Test User");
    fireEvent.change(nameInput, { target: { value: "Updated User" } });
    expect(nameInput.value).toBe("Updated User");
  });

  test("calls updateUser and shows success toast on successful submit", async () => {
    updateUser.mockResolvedValueOnce({ message: "Usuario actualizado" });

    render(
      <MemoryRouter initialEntries={["/admin/user/update/1"]}>
        <Routes>
          <Route path="/admin/user/update/:id" element={<UserUpdate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Seleccionamos el formulario (se asume que UserForm renderiza un <form>)
    const form = document.querySelector("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          id: 1,
          name: "Test User",
          phone: "+571234567890",
          email: "test@example.com",
          birthdate: "1990-01-01",
          isAdmin: true,
          isEmployee: false,
        })
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Usuario actualizado exitosamente",
        expect.any(Object)
      );
    });
  });

  test("shows validation errors if form data is invalid", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/user/update/1"]}>
        <Routes>
          <Route path="/admin/user/update/:id" element={<UserUpdate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Borramos el nombre para provocar error de validaciÃ³n
    const nameInput = screen.getByDisplayValue("Test User");
    fireEvent.change(nameInput, { target: { value: "" } });

    const form = document.querySelector("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test("shows API error message on update failure", async () => {
    // Simulamos que updateUser rechaza sin response para activar el else en handleServerError
    updateUser.mockRejectedValueOnce(new Error("Error en el servidor"));

    render(
      <MemoryRouter initialEntries={["/admin/user/update/1"]}>
        <Routes>
          <Route path="/admin/user/update/:id" element={<UserUpdate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    const form = document.querySelector("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      // Si updateUser rechaza sin response, se muestra "No se pudo conectar con el servidor."
      expect(toast.error).toHaveBeenCalledWith(
        "No se pudo conectar con el servidor.",
        expect.any(Object)
      );
    });
  });
});