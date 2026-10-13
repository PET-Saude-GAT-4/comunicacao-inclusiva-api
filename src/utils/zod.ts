import type { $ZodError, $ZodIssue } from "zod/v4/core";

function isNumericOrigin(origin: string): boolean {
  return origin === "number" || origin === "int" || origin === "bigint";
}

function buildMessageFromIssue(issue: $ZodIssue): string {
  switch (issue.code) {
    case "invalid_type": {
      const regex = /expected\s+([^,]+),\s+received\s+(.+)$/;
      const match = issue.message.match(regex);

      if (match) {
        if (match[2] === "undefined")
          return `'${issue.path.join(".")}' is required`;

        return `'${issue.path.join(".")}' must be ${match[1]}`;
      }

      return `'${issue.path.join(".")}' is of an invalid type`;
    }

    case "too_small": {
      // A numeric bound may be fractional, so an exclusive one is stated as is
      // rather than turned into the next allowed value.
      if (isNumericOrigin(issue.origin))
        return issue.inclusive
          ? `'${issue.path.join(".")}' must be at least ${issue.minimum}`
          : `'${issue.path.join(".")}' must be greater than ${issue.minimum}`;

      const min = issue.inclusive
        ? Number(issue.minimum)
        : Number(issue.minimum) + 1;

      return `'${issue.path.join(".")}' must have at least ${min} character${min === 1 ? "" : "s"}`;
    }

    case "too_big": {
      if (isNumericOrigin(issue.origin))
        return issue.inclusive
          ? `'${issue.path.join(".")}' must be at most ${issue.maximum}`
          : `'${issue.path.join(".")}' must be less than ${issue.maximum}`;

      const max = issue.inclusive
        ? Number(issue.maximum)
        : Number(issue.maximum) - 1;

      return `'${issue.path.join(".")}' must have at most ${max} character${max === 1 ? "" : "s"}`;
    }

    case "unrecognized_keys":
      return `Unrecognized key: ${issue.keys}`;

    default:
      return issue.message;
  }
}

export function formatZodError(error: $ZodError): string[] {
  const messages: string[] = [];

  for (const issue of error.issues) {
    messages.push(buildMessageFromIssue(issue));
  }

  return messages;
}
