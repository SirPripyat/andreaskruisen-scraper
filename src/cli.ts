export const parseArgs = (argv: string[]): Record<string, string> => {
  const args: Record<string, string> = {};

  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
  }

  return args;
};
