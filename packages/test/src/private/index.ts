import Body from "#Body";
import Case from "#Case";
import tests from "#tests";

export default {
  case(name: string, body: Body) {
    tests.push(new Case(name, body));
  }
};
