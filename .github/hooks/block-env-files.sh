#!/bin/bash
# Deny any tool call that targets .env or .env.local files.
# Receives tool invocation JSON on stdin; outputs a PreToolUse deny decision.

input=$(cat)

# Match the exact filename .env or .env.local at the end of a JSON string value.
# Pattern: a literal dot, "env", then optionally ".local", then a closing quote.
# This avoids false positives on .env.example, .env.production, etc.
if echo "$input" | grep -qE '\.env(\.local)?"'; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":".env and .env.local files are off-limits for all agents"}}\n'
  exit 0
fi
