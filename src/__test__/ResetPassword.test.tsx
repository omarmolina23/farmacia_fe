import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ResetPassword from "../pages/login/ResetPassword";
import { setPassword as setPasswordService } from "../services/UserService";
import { toast } from "react-toastify";
import React from "react";

// Mock de setPassword
vi.mock("../services/UserService", () => ({
  setPassword: vi.fn(),
}));

// Mock de toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de useNavigate y useSearchParams de react-router-dom
const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams();
mockSearchParams.set("token", "test-token");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams],
  };
});

describe("ResetPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the reset password form", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    // Verifica que se muestre el título y al menos dos campos de contraseña (por el placeholder)
    expect(screen.getByText(/Restablecer contraseña/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Introduzca su contraseña aquí").length).toBeGreaterThanOrEqual(2);
  });

  test("shows error when fields are empty", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole("button", { name: /Aceptar/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Por favor, complete todos los campos");
    });
  });

  test("shows error when passwords do not match", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    const passwordFields = screen.getAllByPlaceholderText("Introduzca su contraseña aquí");
    // Se llenan con valores diferentes
    fireEvent.change(passwordFields[0], { target: { value: "password123" } });
    fireEvent.change(passwordFields[1], { target: { value: "password456" } });
    const submitButton = screen.getByRole("button", { name: /Aceptar/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Las contraseña no coinciden");
    });
  });

  test("calls setPasswordService and navigates on successful submission", async () => {
    setPasswordService.mockResolvedValueOnce({ message: "Success" });
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    const passwordFields = screen.getAllByPlaceholderText("Introduzca su contraseña aquí");
    // Se llenan ambos campos con el mismo valor
    fireEvent.change(passwordFields[0], { target: { value: "newpassword" } });
    fireEvent.change(passwordFields[1], { target: { value: "newpassword" } });
    const submitButton = screen.getByRole("button", { name: /Aceptar/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      // Verifica que se llame al servicio con el token extraído de la URL y la contraseña
      expect(setPasswordService).toHaveBeenCalledWith("test-token", "newpassword");
      expect(toast.success).toHaveBeenCalledWith("Contraseña cambiada exitosamente");
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  test("shows error when setPasswordService fails", async () => {
    setPasswordService.mockRejectedValueOnce(new Error("Error resetting password"));
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    const passwordFields = screen.getAllByPlaceholderText("Introduzca su contraseña aquí");
    fireEvent.change(passwordFields[0], { target: { value: "newpassword" } });
    fireEvent.change(passwordFields[1], { target: { value: "newpassword" } });
    const submitButton = screen.getByRole("button", { name: /Aceptar/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error resetting password");
    });
  });
});