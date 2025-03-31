import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { signUp } from "../services/UserService";
import UserRegister from "../pages/user/UserRegister";
import { useAuth } from "../context/AuthContext";
import { vi } from "vitest";

// Mock de signUp
vi.mock("../services/UserService", () => ({
  signUp: vi.fn(),
}));

vi.spyOn(toast, "error").mockImplementation(() => {});
vi.spyOn(toast, "success").mockImplementation(() => {});

// Mock de useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    signOut: vi.fn(),
  }),
}));

// Mock de useNavigate para probar cancel
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("UserRegister Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNavigate.mockReset();
  });

  test("renders UserRegister correctly", () => {
    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Verifica que se rendericen los elementos principales
    expect(screen.getByText("Registrar usuario")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByText("Agregar")).toBeInTheDocument();
  });

  test("validates form and shows errors when required fields are empty", async () => {
    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled(); // Múltiples errores de validación
    });
  });

  test("displays phone validation error for invalid phone", async () => {
    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Completa los campos válidos salvo el teléfono
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "juan@example.com" },
    });
    // Teléfono inválido (no cumple +57 y 10 dígitos)
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Administrador" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "El teléfono debe tener el formato +57 seguido de 10 dígitos.",
        expect.any(Object)
      );
    });
  });

  test("displays email mismatch error", async () => {
    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Campos válidos salvo que los correos no coinciden
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Ana Gómez" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "diferente@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "1990-05-05" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Vendedor" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Los correos electrónicos no coinciden.",
        expect.any(Object)
      );
    });
  });

  test("displays birthdate validation error for underage user", async () => {
    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Completa campos válidos salvo fecha de nacimiento (menor de 18 años)
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Pedro López" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "pedro@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "pedro@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    // Fecha de nacimiento reciente para ser menor de 18
    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 16);
    const recentDateString = recentDate.toISOString().split("T")[0];
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: recentDateString },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Administrador" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Debe ser mayor o igual a 18 años.",
        expect.any(Object)
      );
    });
  });

  test("handles successful user registration", async () => {
    signUp.mockResolvedValue({ message: "Usuario registrado exitosamente" });

    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Administrador" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Usuario registrado exitosamente",
        expect.any(Object)
      );
    });
  });

  // Pruebas para cubrir los bloques catch en handleSubmit

  test("handles registration error with status 400 and errors array", async () => {
    signUp.mockRejectedValue({
      response: {
        status: 400,
        data: { errors: [{ message: "Error 1" }, { message: "Error 2" }] },
      },
    });

    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Completa campos válidos
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Laura Ruiz" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "laura@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "laura@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "1990-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Vendedor" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Error 1", expect.any(Object));
      expect(toast.error).toHaveBeenCalledWith("Error 2", expect.any(Object));
    });
  });

  test("handles registration error with status 400 without errors array", async () => {
    signUp.mockRejectedValue({
      response: {
        status: 400,
        data: { message: "Datos inválidos" },
      },
    });

    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Campos válidos
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "María Díaz" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "1992-02-02" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Administrador" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Error: Datos inválidos",
        expect.any(Object)
      );
    });
  });

  test("handles registration error with status 409", async () => {
    signUp.mockRejectedValue({
      response: {
        status: 409,
        data: {},
      },
    });

    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Campos válidos
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Carlos Mendoza" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "carlos@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "carlos@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "1985-03-03" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Vendedor" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Ya existe un usuario con este correo o teléfono.",
        expect.any(Object)
      );
    });
  });

  test("handles registration error with status 500", async () => {
    signUp.mockRejectedValue({
      response: {
        status: 500,
        data: {},
      },
    });

    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Campos válidos
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Elena Torres" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "elena@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "elena@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "1980-04-04" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Administrador" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Error en el servidor, inténtelo más tarde.",
        expect.any(Object)
      );
    });
  });

  test("handles registration error with default error response", async () => {
    signUp.mockRejectedValue({
      response: {
        status: 404,
        data: {},
      },
    });

    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Campos válidos
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Miguel Salinas" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "miguel@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "miguel@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "1988-05-05" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Vendedor" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Ocurrió un error inesperado.",
        expect.any(Object)
      );
    });
  });

  test("handles registration error when no response is available", async () => {
    signUp.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Campos válidos
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Sofía García" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "sofia@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirme correo electrónico"), {
      target: { value: "sofia@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+571234567890" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "1995-06-06" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Administrador" },
    });

    fireEvent.click(screen.getByText("Agregar"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "No se pudo conectar con el servidor.",
        expect.any(Object)
      );
    });
  });

  test("handles cancel action correctly", () => {
    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>
    );

    // Simula el clic en el botón "Cancelar" que se espera exista en el UserForm
    fireEvent.click(screen.getByText("Cancelar"));

    // Se espera que se reinicie el formulario y se navegue a /admin/user/list
    expect(mockedNavigate).toHaveBeenCalledWith("/admin/user/list");
  });
});
