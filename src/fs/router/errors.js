const DoubleRoute = class extends Error {
  constructor(route) {
    super("double route");
    this.route = route;
  }
};

const OptionalRoute = class extends Error {
  constructor(route) {
    super("optional routes must be leaves");
    this.route = route;
  }
};

const RestRoute = class extends Error {
  constructor(route) {
    super("rest routes must be leaves");
    this.route = route;
  }
};

export { DoubleRoute, OptionalRoute, RestRoute };
