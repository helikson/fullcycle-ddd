// PERSISTENCIA

class CustomerV1 {
  _id: string;
  _name: string;
  _address: string;

  constructor(id: string, name: string, address: string) {
    this._id = id;
    this._name = name;
    this._address = address;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get address(): string {
    return this._address;
  }

  public set id(id: string) {
    this._id = id;
  }

  public set name(name: string) {
    this._name = name;
  }

  public set address(address: string) {
    this._address = address;
  }
}
