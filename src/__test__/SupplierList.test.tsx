import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SuppliersList from "../pages/supplier/SupplierList";
import { getSupplierAll, searchSupplier } from "../services/SupplierService";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";

// Mock de useAuth para evitar el error de signOut undefined
vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({
        signOut: vi.fn(),
        user: { id: 1, name: "Admin", role: "admin" }
    })
}));

vi.mock("../services/SupplierService", () => ({
    getSupplierAll: vi.fn(),
    searchSupplier: vi.fn()
}));

describe("SuppliersList Component", () => {
    it("renders the component and fetches suppliers", async () => {
        getSupplierAll.mockResolvedValue([{ id: 1, name: "Proveedor 1", phone: "123456789", email: "prov1@example.com", status: "ACTIVE" }]);

        render(
            <MemoryRouter>
                <ToastContainer />
                <SuppliersList />
            </MemoryRouter>
        );

        await waitFor(() => expect(getSupplierAll).toHaveBeenCalled());

        expect(screen.getByText("Proveedor 1")).toBeInTheDocument();
    });

    it("handles search input", async () => {
        searchSupplier.mockResolvedValue([{ id: 2, name: "Proveedor 2", phone: "987654321", email: "prov2@example.com", status: "ACTIVE" }]);

        render(
            <MemoryRouter>
                <ToastContainer />
                <SuppliersList />
            </MemoryRouter>
        );

        const searchInput = screen.getByPlaceholderText("Buscar un proveedor");
        fireEvent.change(searchInput, { target: { value: "Proveedor 2" } });

        await waitFor(() => expect(searchSupplier).toHaveBeenCalledWith("Proveedor 2"));

        expect(screen.getByText("Proveedor 2")).toBeInTheDocument();
    });
});
