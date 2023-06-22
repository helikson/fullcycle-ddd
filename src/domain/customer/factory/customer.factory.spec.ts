import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer Factory unit test", () => {
    it("should create a customer", () => {
        const customer = CustomerFactory.create("Testes");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Testes");
        expect(customer.address).toBeUndefined();
        expect(customer.constructor.name).toBe("Customer")
    });

    it("should create a customer with address", () => {
        const address = new Address("Rua Teste", 123, "123123-123", "City");
        const customer = CustomerFactory.createWithAddress("Testes", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Testes");
        expect(customer.address).toBe(address);
        expect(customer.constructor.name).toBe("Customer")
    });
});