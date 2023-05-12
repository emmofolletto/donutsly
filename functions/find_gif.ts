import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import gifs from "../assets/gifs.json" assert { type: "json" };

/**
 * Functions are reusable building blocks of automation that accept inputs,
 * perform calculations, and provide outputs. Functions can be used as steps in
 * a workflow or independently.
 * Learn more: https://api.slack.com/automation/functions/custom
 */
export const FindGIFFunction = DefineFunction({
  callback_id: "find_gif",
  title: "Find a GIF",
  description: "Search for a GIF that matches the vibe",
  source_file: "functions/find_gif.ts", // The file with the exported function handler
  input_parameters: {
    properties: {
      vibe: {
        type: Schema.types.string,
        description: "The energy for the GIF to match",
      },
    },
    required: [],
  },
  output_parameters: {
    properties: {
      URL: {
        type: Schema.types.string,
        description: "GIF URL",
      },
      alt_text: {
        type: Schema.types.string,
        description: "Description of the GIF",
      },
    },
    required: ["URL"],
  },
});

const getEnergy = (vibe: string): string => {
  if (vibe === "#putmembersfirst") return "appreciation";
  if (vibe === "#cultivatecompassion") return "celebration";
  if (vibe === "#seekoutdiverseperspectives") return "thankful";
  if (vibe === "#bringoutourbest") return "amazed";
  if (vibe === "#actwithintegrity") return "excited";
  if (vibe === "#becourageouslycurious") return "egg"; // easter eggs
  return "donut";
};

interface GIF {
  URL: string;
  alt_text?: string;
  tags: string[];
}

const matchVibe = (vibe: string): GIF => {
  const energy = getEnergy(vibe);
  const matches = gifs.filter((g: GIF) => g.tags.includes(energy));
  const randomGIF = Math.floor(Math.random() * matches.length);
  return matches[randomGIF];
};

/**
 * The default export for a custom function accepts a function definition
 * and a function handler that contains the custom logic for the function.
 */
export default SlackFunction(FindGIFFunction, ({ inputs }) => {
  const { vibe } = inputs;
  const gif = matchVibe(vibe ?? "");
  return { outputs: gif };
});
