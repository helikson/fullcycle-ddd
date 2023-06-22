import { Sequelize } from "sequelize-typescript";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: {
        force: true,
      },
    });

    sequelize.addModels([
      OrderModel,
      OrderItemModel,
      CustomerModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "zipcode 1", "city 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      2
    );

    const order = new Order("o1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },
      ],
    });
  });

  it("shoud update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "zipcode 1", "city 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      2
    );

    const order = new Order("o1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderItem2 = new OrderItem(
      "oi2",
      product.id,
      product.name,
      product.price,
      5
    );

    order.addItems([orderItem2]);

    orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [orderItem, orderItem2].map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
        order_id: order.id,
        product_id: product.id,
      })),
    });
  });

  it("shoud find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "zipcode 1", "city 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      2
    );

    const orderItem2 = new OrderItem(
      "oi2",
      product.id,
      product.name,
      product.price,
      5
    );

    const order = new Order("o1", customer.id, [orderItem, orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find("o1");

    expect(foundOrder).toStrictEqual(order);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("123123");
    }).rejects.toThrow("Order not found");
  });

  it("shoud find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "zipcode 1", "city 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      2
    );

    const orderItem2 = new OrderItem(
      "oi2",
      product.id,
      product.name,
      product.price,
      5
    );

    const order1 = new Order("o1", customer.id, [orderItem]);
    const order2 = new Order("o2", customer.id, [orderItem2]);

    const orderRepository = new OrderRepository();

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});
