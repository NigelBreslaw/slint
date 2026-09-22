// Copyright © SixtyFPS GmbH <info@slint.dev>
// SPDX-License-Identifier: GPL-3.0-only OR LicenseRef-Slint-Royalty-free-2.0 OR LicenseRef-Slint-Software-3.0

// Node.js module loader hook for .slint files.
// Enables `import { MainWindow } from "./main.slint"` in JavaScript and TypeScript.
//
// Register with: node --import slint-ui/register app.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

// Resolve the absolute path to slint-ui once, so generated modules
// can import it regardless of where the .slint file lives.
const require_ = createRequire(import.meta.url);
const slintUiPath = pathToFileURL(require_.resolve("slint-ui")).href;

/**
 * Resolve hook: intercept .slint specifiers and resolve them to file URLs.
 */
export function resolve(specifier, context, nextResolve) {
    if (specifier.endsWith(".slint")) {
        const resolved = new URL(specifier, context.parentURL);
        return { url: resolved.href, shortCircuit: true, format: "module" };
    }
    return nextResolve(specifier, context);
}

// Normalize kebab-case to snake_case, matching the JS runtime behavior.
function normalizeName(name) {
    return name.replace(/-/g, "_");
}

/**
 * Extract the names a .slint file exports.
 * Uses simple regex matching — no full parser needed.
 *
 * `filePath` is the file the source was read from, used to follow
 * `export * from "other.slint"`. `seen` guards against import cycles.
 */
function extractExportNames(source, filePath, seen = new Set()) {
    const names = new Set();
    seen.add(filePath);

    // A global is reached through a component instance, so it is not a module export.
    const declarationRe =
        /^\s*export\s+(?:component|struct|enum)\s+([A-Za-z_][A-Za-z0-9_-]*)/gm;
    for (const m of source.matchAll(declarationRe)) {
        names.add(normalizeName(m[1]));
    }

    // The name the module exports is the alias when there is one.
    const listRe = /^\s*export\s*\{([^}]*)\}/gm;
    for (const m of source.matchAll(listRe)) {
        for (const specifier of m[1].split(",")) {
            const parts = specifier.trim().split(/\s+as\s+/);
            const name = (parts[1] ?? parts[0]).trim();
            if (name) {
                names.add(normalizeName(name));
            }
        }
    }

    const starRe = /^\s*export\s*\*\s*from\s*"([^"]+)"/gm;
    for (const m of source.matchAll(starRe)) {
        const other = fileURLToPath(new URL(m[1], pathToFileURL(filePath)));
        if (seen.has(other)) {
            continue;
        }
        for (const name of extractExportNames(
            readFileSync(other, "utf-8"),
            other,
            seen,
        )) {
            names.add(name);
        }
    }

    return [...names];
}

/**
 * Load hook: generate a JS module that calls slint.loadFile() and
 * re-exports each component/struct/enum by name.
 */
export function load(url, context, nextLoad) {
    if (url.endsWith(".slint")) {
        const filePath = fileURLToPath(url);
        const source = readFileSync(filePath, "utf-8");
        const names = extractExportNames(source, filePath);

        const moduleSource = [
            `import { loadFile } from ${JSON.stringify(slintUiPath)};`,
            `const _m = loadFile(new URL(${JSON.stringify(url)}));`,
            ...names.map((n) => `export const ${n} = _m.${n};`),
        ].join("\n");

        return { format: "module", source: moduleSource, shortCircuit: true };
    }
    return nextLoad(url, context);
}
