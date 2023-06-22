import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerID,
        total: entity.total(),
        items: entity.items.map(({ id, name, price, productID, quantity }) => ({
          id,
          name,
          price,
          order_id: entity.id,
          product_id: productID,
          quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderItemModel.destroy({ where: { order_id: entity.id } });

    entity.items.forEach(async ({ id, name, price, productID, quantity }) => {
      await OrderItemModel.create({
        id,
        name,
        price,
        order_id: entity.id,
        product_id: productID,
        quantity,
      });
    });

    await OrderModel.update(
      {
        customer_id: entity.customerID,
        total: entity.total(),
      },
      { where: { id: entity.id } }
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;

    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const arrayItems = orderModel.items.map(
      ({ id, product_id, name, price, quantity }) =>
        new OrderItem(id, product_id, name, price, quantity)
    );

    return new Order(id, orderModel.customer_id, arrayItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return orderModels.map(({ id, customer_id, items }) => {
      const arrayItems = items.map(
        ({ id, product_id, name, price, quantity }) =>
          new OrderItem(id, product_id, name, price, quantity)
      );

      return new Order(id, customer_id, arrayItems);
    });
  }
}
