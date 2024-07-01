const BaseError = class extends Error {
  route: string;

  constructor(message: string, route: string) {
    super(message);
    this.route = route;
  }
}

const DoubleRoute = class extends BaseError {
  constructor(route: string) {
    super("double route", route);
  }
};

const OptionalRoute = class extends BaseError {
  constructor(route: string) {
    super("optional routes must be leaves", route);
  }
};

const RestRoute = class extends BaseError {
  constructor(route: string) {
    super("rest routes must be leaves", route);
  }
};

export { DoubleRoute, OptionalRoute, RestRoute };
