import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when ID is empty", () => {
    expect(() => {
      let customer = new Customer("", "Testes");
    }).toThrowError("ID is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("1", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("1", "Testes");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Testes");
    customer.address = new Address("Street 1", 123, "123123-123", "City");

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Testes");
    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Testes");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});
