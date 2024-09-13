module.exports = ({ args }) => {
  const prompts = [];

  if (!args.name) {
    prompts.push({
      type: "input",
      name: "name",
      message: "What is the name of the component?",
    });
  } else {
    prompts.push({
      type: "input",
      name: "name",
      message: "What is the name of the component?",
      default: args.name,
    });
  }

  if (!args.routePath) {
    prompts.push({
      type: "input",
      name: "routePath",
      message: "Specify the route path:",
    });
  } else {
    prompts.push({
      type: "input",
      name: "routePath",
      message: "Specify the route path:",
      default: args.routePath,
    });
  }

  if (args.hasNested !== undefined) {
    prompts.push({
      type: "confirm",
      name: "hasNested",
      message: "Will this component have nested files?",
      default: args.hasNested === "true" || args.hasNested === true,
    });
  } else {
    prompts.push({
      type: "confirm",
      name: "hasNested",
      message: "Will this component have nested files?",
      default: false,
    });
  }

  return prompts;
};
