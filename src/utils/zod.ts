import type { $ZodError, $ZodIssue } from "zod/v4/core";

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
      const min = issue.inclusive
        ? BigInt(issue.minimum)
        : BigInt(issue.minimum) + BigInt(1);

      return `'${issue.path.join(".")}' must have at least ${min} character${min == BigInt(1) ? "" : "s"}`;
    }

    case "too_big": {
      const max = issue.inclusive
        ? BigInt(issue.maximum)
        : BigInt(issue.maximum) + BigInt(1);

      return `'${issue.path.join(".")}' must have at most ${max} character${max == BigInt(1) ? "" : "s"}`;
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
