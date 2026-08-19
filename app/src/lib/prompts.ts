export type PromptTemplate = {
  id: string;
  label: string;
  prompt: string;
  description: string;
};

export const promptTemplates: PromptTemplate[] = [
  {
    id: "decision",
    label: "Make a decision",
    prompt: "Help me compare these options and recommend one: ",
    description: "Clarify tradeoffs without overthinking.",
  },
  {
    id: "plan",
    label: "Shape a plan",
    prompt: "Turn this idea into a Now, Next, and Later plan: ",
    description: "Move from rough idea to first steps.",
  },
  {
    id: "risk",
    label: "Find the risk",
    prompt: "What is the riskiest assumption in this idea, and how can I test it quickly? ",
    description: "Find what needs learning first.",
  },
  {
    id: "rewrite",
    label: "Make it clearer",
    prompt: "Rewrite this so it is concise, specific, and easy to act on: ",
    description: "Turn fuzzy language into momentum.",
  },
];
