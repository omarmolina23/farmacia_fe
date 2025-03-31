import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from "../pages/login/Login";
import * as UserService from "../services/UserService";
import { toast } from 'react-hot-toast';
import { vi } from 'vitest';

vi.mock("../services/UserService", () => ({
  login: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockLogin = vi.fn();
vi.mock("../context/authContext", () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
  }),
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("muestra error si los campos están vacíos", async () => {
    render(<Login />);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("Por favor, complete todos los campos");
  });

  test("ejecuta login correctamente y navega en caso de éxito", async () => {
    const mockResponse = { name: "Test User", isAdmin: false, status: "active" };
    UserService.login.mockResolvedValueOnce(mockResponse);

    render(<Login />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(UserService.login).toHaveBeenCalledWith("test@example.com", "password");
      expect(mockLogin).toHaveBeenCalledWith({
        name: mockResponse.name,
        isAdmin: mockResponse.isAdmin,
        status: mockResponse.status,
      });
      expect(toast.success).toHaveBeenCalledWith("Inicio de sesión exitoso");
      expect(mockNavigate).toHaveBeenCalledWith("/employees/home");
    });
  });

  test("muestra error en caso de fallo del login", async () => {
    const errorMessage = "Credenciales inválidas";
    UserService.login.mockRejectedValueOnce(new Error(errorMessage));

    render(<Login />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});