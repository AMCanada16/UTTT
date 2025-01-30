import { input, output } from "../../../src/functions/ai/data"

test("Check that the input and the out put have the same length", () => {
  expect(input.length).toEqual(output.length)
})