import { temp } from "./temp";

test("Sends greetings from common", () => {
  expect(temp()).toBe("Hello from common");
});
