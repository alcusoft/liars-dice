import { temp } from "./temp";

test("Sends greetings from client", () => {
  expect(temp()).toBe("Hello from client");
});
