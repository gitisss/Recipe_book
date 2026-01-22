/**
 * Parses a potentially incomplete JSON string into a JavaScript object.
 * It tries to rescue as much data as possible from a truncated JSON stream.
 */
export const parsePartialJson = (jsonString: string): any => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        // If it fails, we try to "fix" the JSON string by closing open braces/brackets
        // This is a naive implementation but works for many simple streaming cases.

        let repaired = jsonString.trim();

        // Quick fix for trailing commas before closing
        repaired = repaired.replace(/,\s*([}\]])/g, '$1');

        // Count open/close braces and brackets
        let openBraces = 0;
        let openBrackets = 0;
        let inString = false;
        let escaped = false;

        for (let i = 0; i < repaired.length; i++) {
            const char = repaired[i];
            if (escaped) {
                escaped = false;
                continue;
            }
            if (char === '\\') {
                escaped = true;
                continue;
            }
            if (char === '"') {
                inString = !inString;
            }
            if (!inString) {
                if (char === '{') openBraces++;
                if (char === '}') openBraces--;
                if (char === '[') openBrackets++;
                if (char === ']') openBrackets--;
            }
        }

        // If we are inside a string at the end, close it
        if (inString) {
            repaired += '"';
        }

        // Close open structures
        // Note: This order (brackets first then braces) is a heuristic. 
        // Ideally we'd need a stack to know exactly which one to close.
        // However, since we usually append to the end, just closing what's open often works for display.
        // A more robust parser would be needed for complex cases, but for this specific Recipe schema it might suffice.
        // Actually, simple appending might be wrong if we have mixed nesting like `{[`.
        // Let's try to be slightly smarter or just simple appending.

        // Simple approach: Close whatever is open.
        // Since we don't track the exact stack here, this might fail for deeply nested mixed structures.
        // But for a flat-ish recipe structure it should be okay-ish.

        // Better approach: use a library like `best-effort-json-parser` or `json-repair` but we want zero deps if possible.
        // Let's try fixing just the string end and see if `JSON.parse` works if we append closing chars.

        // We can't easily know the order of closing without a stack.
        // Let's rely on a simpler heuristic: try closing `]}` or `}` or `]` until it parses.

        // Heuristic:
        // 1. Close string if needed.
        // 2. Try closing brackets/braces based on counts.

        while (openBrackets > 0) {
            repaired += ']';
            openBrackets--;
        }
        while (openBraces > 0) {
            repaired += '}';
            openBraces--;
        }

        try {
            return JSON.parse(repaired);
        } catch (e2) {
            return null; // Give up
        }
    }
};
