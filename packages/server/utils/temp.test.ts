import { temp } from "./temp";

test("Sends greetings from server", () => {
  expect(temp()).toBe("Hello from server");
});
