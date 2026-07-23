/**
 * Pure autocomplete helpers for the terminal (Tab / Ctrl+I).
 */

export type AutocompleteResult = {
  /** Full input to place in the field when a unique completion exists */
  completion?: string;
  /** Multiple matches to show as hints */
  hints: string[];
};

function splitInput(inputVal: string): string[] {
  // Preserve trailing empty token when input ends with space
  if (inputVal.endsWith(" ")) {
    const parts = inputVal.trimEnd().split(/\s+/);
    return [...parts, ""];
  }
  return inputVal.trim().length === 0 ? [] : inputVal.trim().split(/\s+/);
}

/**
 * Prefix-match autocomplete against top-level commands and theme args.
 */
export function autocomplete(
  inputVal: string,
  commandNames: string[],
  themeNames: string[],
): AutocompleteResult {
  if (!inputVal) return { hints: [] };

  const parts = splitInput(inputVal);
  if (parts.length === 0) return { hints: [] };

  const cmd = parts[0];

  // themes …
  if (cmd === "themes" || "themes".startsWith(cmd)) {
    // "themes" or "them" → complete to themes
    if (parts.length === 1 && !inputVal.endsWith(" ")) {
      if (cmd === "themes") {
        /* fall through to command complete */
      } else {
        const matches = commandNames.filter((c) => c.startsWith(cmd));
        if (matches.length === 1) return { completion: matches[0], hints: [] };
        return { hints: matches };
      }
    }

    // "themes " → "themes set "
    if (cmd === "themes" && parts.length === 2 && parts[1] === "") {
      return { completion: "themes set ", hints: [] };
    }

    // "themes s" / "themes se" → "themes set"
    if (cmd === "themes" && parts.length === 2 && parts[1] !== "") {
      if ("set".startsWith(parts[1])) {
        return { completion: "themes set", hints: [] };
      }
    }

    // "themes set " → list themes
    if (cmd === "themes" && parts.length === 3 && parts[1] === "set" && parts[2] === "") {
      return { hints: [...themeNames] };
    }

    // "themes set d" → complete theme name
    if (cmd === "themes" && parts.length >= 3 && parts[1] === "set") {
      const prefix = parts[2] ?? "";
      const matches = themeNames.filter((t) => t.startsWith(prefix));
      if (matches.length === 1) {
        return { completion: `themes set ${matches[0]}`, hints: [] };
      }
      return { hints: matches };
    }
  }

  // projects / socials go
  if (cmd === "projects" || cmd === "socials") {
    if (parts.length === 2 && parts[1] === "") {
      return { completion: `${cmd} go `, hints: [] };
    }
    if (parts.length === 2 && parts[1] !== "" && "go".startsWith(parts[1])) {
      return { completion: `${cmd} go`, hints: [] };
    }
  }

  // top-level command prefix (single token, no trailing space)
  if (parts.length === 1 && !inputVal.endsWith(" ")) {
    const matches = commandNames.filter((c) => c.startsWith(parts[0]));
    if (matches.length === 1) {
      return { completion: matches[0], hints: [] };
    }
    return { hints: matches };
  }

  return { hints: [] };
}
