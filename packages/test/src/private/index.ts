import Body from "#Body";
import repository from "#repository";

export default {
  case(name: string, body: Body) {
    repository.put(name, body);
  }
};
