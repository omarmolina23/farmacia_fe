import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import UserList from "../pages/user/UserList";
import { getUserAll, searchUser } from "../services/UserService";
import { vi } from "vitest";
import React from "react";

// Mock del servicio de usuarios
vi.mock("../services/UserService", () => ({
  getUserAll: vi.fn(),
  searchUser: vi.fn(),
}));

// Mock del contexto de autenticaciÃ³n
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    signOut: vi.fn(), // Mock de signOut para evitar errores
  }),
}));

describe("UserList Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders UserList correctly", async () => {
    getUserAll.mockResolvedValue([
      {
        id: 1,
        name: "Juan Perez",
        phone: "123456789",
        email: "juan@example.com",
        birthdate: "1990-01-01",
        status: "ACTIVE",
      },
    ]);

    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => expect(getUserAll).toHaveBeenCalled());

    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("juan@example.com")).toBeInTheDocument();
  });

  test("handles user search", async () => {
    searchUser.mockResolvedValue([
      {
        id: 2,
        name: "Maria Lopez",
        phone: "987654321",
        email: "maria@example.com",
        birthdate: "1995-05-05",
        status: "ACTIVE",
      },
    ]);

    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar un usuario");
    fireEvent.change(searchInput, { target: { value: "Maria" } });

    await waitFor(() => expect(searchUser).toHaveBeenCalledWith("Maria"));

    expect(screen.getByText("Maria Lopez")).toBeInTheDocument();
    expect(screen.getByText("maria@example.com")).toBeInTheDocument();
  });

  test("displays error toast on fetch failure", async () => {
    getUserAll.mockRejectedValue(new Error("Error al obtener usuarios"));
    vi.spyOn(toast, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Error al obtener usuarios"));
  });
});