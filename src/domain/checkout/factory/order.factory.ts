import Order from "../entity/order";
import OrderItem from "../entity/order_item";

interface OrderFactoryProps {
    id: string;
    customerID: string;
    items: {
        id: string;
        name: string;
        productID: string;
        quantity: number;
        price: number;
    }[]
}

export default class OrderFactory {
    static create(props: OrderFactoryProps): Order {
        const items = props.items.map(item => new OrderItem(item.id, item.name, item.productID, item.quantity, item.price))

        return new Order(props.id, props.customerID, items);
    }
}