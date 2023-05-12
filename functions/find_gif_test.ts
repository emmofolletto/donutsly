import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertArrayIncludes } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import FindGIF from "./find_gif.ts";

/**
 * The actual outputs of a function can be compared to expected outputs for a
 * collection of given inputs.
 */
const { createContext } = SlackFunctionTester("find_gif");

Deno.test("Find a GIF with the appreciation tag", async () => {
  const inputs = { vibe: "#putmembersfirst" };
  const expectedGIFs = [
    "https://media2.giphy.com/media/ZfK4cXKJTTay1Ava29/giphy.gif",
    "https://media2.giphy.com/media/3ohs7NuHL3gjbe2uGI/giphy-downsized.gif",
    "https://media1.giphy.com/media/NEvPzZ8bd1V4Y/giphy-downsized.gif",
  ];

  const { outputs } = await FindGIF(createContext({ inputs }));
  assertArrayIncludes(expectedGIFs, [outputs?.URL]);
});

Deno.test("Ensure donut or surprise gifs are returned if no vibe is selected", async () => {
  const inputs = { vibe: "" };
  const expectedGIFs = [
    "https://media0.giphy.com/media/1BRXy8cUS1jyw/giphy.gif",
    "https://media0.giphy.com/media/l2QDPStBfVQjHXSOk/giphy-downsized/giphy.gif",
  ];

  const { outputs } = await FindGIF(createContext({ inputs }));
  assertArrayIncludes(expectedGIFs, [outputs?.URL]);
});
