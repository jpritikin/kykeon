#!/usr/bin/env npx tsx
// Prints a change in the number of members and the count of testimonials
// pending evaluation, and nothing otherwise.
// Usage: tsx member-report.ts [--force]
//   --force  print the current counts even if nothing changed
// Env vars: CLOUDFLARE_ACCOUNT_ID, D1_KYKEON_ID, D1_API_TOKEN

import * as fs from "fs";
import * as path from "path";

const STATE_FILE = `${process.env.HOME}/.cache/kykeon/member-count`;
const COUNTS_SQL =
    "SELECT (SELECT COUNT(*) FROM subscribers) AS members, " +
    "(SELECT COUNT(*) FROM testimonials WHERE approved = 0) AS pending";

interface Counts {
    members: number;
    pending: number;
}

async function queryCounts(): Promise<Counts> {
    const { CLOUDFLARE_ACCOUNT_ID, D1_KYKEON_ID, D1_API_TOKEN } = process.env;
    if (!CLOUDFLARE_ACCOUNT_ID || !D1_KYKEON_ID || !D1_API_TOKEN) {
        throw new Error("Missing credentials: CLOUDFLARE_ACCOUNT_ID, D1_KYKEON_ID, D1_API_TOKEN");
    }
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_KYKEON_ID}/query`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${D1_API_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify({ sql: COUNTS_SQL }),
        }
    );
    const body = await response.json();
    if (!response.ok || !body.success) {
        throw new Error(`D1 query failed (${response.status}): ${JSON.stringify(body.errors)}`);
    }
    return body.result[0].results[0];
}

function readPreviousMembers(): number | null {
    try {
        return Number(fs.readFileSync(STATE_FILE, "utf-8"));
    } catch {
        return null;
    }
}

async function main() {
    const force = process.argv.includes("--force");
    const { members, pending } = await queryCounts();
    const previous = readPreviousMembers() ?? members;

    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(STATE_FILE, String(members));

    if (members !== previous || force) {
        const delta = members - previous;
        console.log(`Members: ${previous} -> ${members} (${delta >= 0 ? "+" : ""}${delta})`);
    }
    if (pending > 0) console.log(`Testimonials pending evaluation: ${pending}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
