import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FindGIFFunction } from "../functions/find_gif.ts";

/**
 * A workflow is a set of steps that are executed in order. Each step in a
 * workflow is a function – either a built-in or custom function.
 * Learn more: https://api.slack.com/automation/workflows
 */
const GiveKudosWorkflow = DefineWorkflow({
  callback_id: "give_kudos_workflow",
  title: "Give kudos",
  description: "Acknowledge the impact someone had on you",
  input_parameters: {
    properties: {
      /**
       * This workflow users interactivity to collect input from the user.
       * Learn more: https://api.slack.com/automation/forms#add-interactivity
       */
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

/**
 * Collecting input from users can be done with the built-in OpenForm function
 * as the first step.
 * Learn more: https://api.slack.com/automation/functions#open-a-form
 */
const kudo = GiveKudosWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Give someone kudos",
    interactivity: GiveKudosWorkflow.inputs.interactivity,
    submit_label: "Give recognition",
    description: "It's not bonus.ly, it's donuts-ly",
    fields: {
      elements: [{
        name: "doer_of_good_deeds",
        title: "Recipient",
        description: "and you can do this over and over again? no cap.",
        type: Schema.slack.types.user_id,
      }, {
        name: "kudo_channel",
        title: "Where should this message be shared?",
        type: Schema.slack.types.channel_id,
      }, {
        name: "kudo_message",
        title: "What would you like to say?",
        type: Schema.types.string,
        long: true,
      }, {
        name: "kudo_vibe",
        title: "#Hashtag",
        description: 'What Company Value does this kudo "vibe" with?',
        type: Schema.types.string,
        enum: [
          "#putmembersfirst",
          "#cultivatecompassion",
          "#seekoutdiverseperspectives",
          "#bringoutourbest",
          "#actwithintegrity",
          "#becourageouslycurious",
        ],
      }],
      required: ["doer_of_good_deeds", "kudo_channel", "kudo_message"],
    },
  },
);

/**
 * A custom function can be added as a workflow step to modify input data,
 * collect additional data for the response, and return information for use in
 * later steps.
 * Learn more: https://api.slack.com/automation/functions/custom
 */
const gif = GiveKudosWorkflow.addStep(FindGIFFunction, {
  vibe: kudo.outputs.fields.kudo_vibe,
});

/**
 * Messages can be sent into a channel with the built-in SendMessage function.
 * Learn more: https://api.slack.com/automation/functions#catalog
 */
GiveKudosWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: kudo.outputs.fields.kudo_channel,
  message:
    `*<@${kudo.outputs.fields.doer_of_good_deeds}>* Someone thinks you've been awesome :doughnut:\n` +
    `> ${kudo.outputs.fields.kudo_message} ${kudo.outputs.fields.kudo_vibe}\n` +
    `${gif.outputs.URL}`,
});

export { GiveKudosWorkflow };
