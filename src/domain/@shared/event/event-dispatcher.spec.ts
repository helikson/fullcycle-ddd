import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import CustomerAddressChangedEvent from "../../customer/event/address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import AddressChangedEvent from "../../customer/event/address-changed.event";

describe("Domain Event tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    })

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({ name: "Product 1", description: "Product description", price: 10 });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should customer is created", () => {
        const customer = new Customer("1", "Testes");

        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        const customerCreatedEvent = new CustomerCreatedEvent({ id: customer.id, name: customer.name });

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        eventDispatcher.notify(customerCreatedEvent);

        const events = eventDispatcher.getEventHandlers["CustomerCreatedEvent"];
        expect(events).toBeDefined();
        expect(events.length).toBe(2);
        expect(events[0]).toMatchObject(eventHandler1);
        expect(events[1]).toMatchObject(eventHandler2);
        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should customer address is changed", () => {
        const customer = new Customer("1", "Testes");
        customer.address = new Address("Street 1", 123, "123123-123", "City");
        customer.changeAddress(new Address("Street 2", 456, "456456-456", "City 2"));

        const addressChangedEvent = new AddressChangedEvent({ id: customer.id, nome: customer.name, endereco: customer.address.toString() });

        const eventHandler = new EnviaConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("AddressChangedEvent", eventHandler);
        eventDispatcher.notify(addressChangedEvent);

        const events = eventDispatcher.getEventHandlers["AddressChangedEvent"];
        expect(events).toBeDefined();
        expect(events.length).toBe(1);
        expect(events[0]).toMatchObject(eventHandler);
        expect(spyEventHandler).toHaveBeenCalled();
    });
})