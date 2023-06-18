import OrderItem from "./order_item";

export default class Order {
  private _id: string;
  private _customerID: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerID: string, items: OrderItem[]) {
    this._id = id;
    this._customerID = customerID;
    this._items = items;
    this._total = this.total();

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerID(): string {
    return this._customerID;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("ID is required");
    }

    if (this._customerID.length === 0) {
      throw new Error("CustomerID is required");
    }

    if (this._items.length === 0) {
      throw new Error("Item quantity must be greater than 0");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }
  }

  addItems(items: OrderItem[]) {
    if (!items || items.length === 0) {
      return;
    }

    this._items = [...this._items, ...items];
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
  }
}
