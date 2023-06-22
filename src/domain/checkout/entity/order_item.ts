export default class OrderItem {
  private _id: string;
  private _productID: string;
  private _name: string;
  private _price: number;
  private _quantity: number;

  constructor(
    id: string,
    productID: string,
    name: string,
    price: number,
    quantity: number
  ) {
    this._id = id;
    this._productID = productID;
    this._name = name;
    this._price = price;
    this._quantity = quantity;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get productID(): string {
    return this._productID;
  }

  validate() {
    if (this._quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
  }

  public get quantity(): number {
    return this._quantity;
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }
}
