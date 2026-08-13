#!/bin/bash

set -u

SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "============================================================="
echo "AI Learning Module — macOS Launcher"
echo "============================================================="

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js 20 or newer is required."
  echo "Install it from https://nodejs.org/ and run this file again."
  read -r -p "Press Return to close..."
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "[ERROR] Found Node.js $(node --version); version 20 or newer is required."
  read -r -p "Press Return to close..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  if ! command -v npm >/dev/null 2>&1; then
    echo "[ERROR] npm is required for the first-time setup."
    read -r -p "Press Return to close..."
    exit 1
  fi
  echo "[INFO] First run: installing local reader dependencies..."
  npm install --no-audit --no-fund || {
    echo "[ERROR] Dependency installation failed. Check the network and try again."
    read -r -p "Press Return to close..."
    exit 1
  }
fi

PORT="${PORT:-4173}"
export PORT

cleanup() {
  if [ -n "${SERVER_PID:-}" ]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

echo "[INFO] Starting reader at http://127.0.0.1:${PORT}"
node server.js &
SERVER_PID=$!

for _ in {1..40}; do
  if curl --silent --fail "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    open "http://127.0.0.1:${PORT}"
    wait "$SERVER_PID"
    exit $?
  fi
  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    wait "$SERVER_PID"
    exit $?
  fi
  sleep 0.25
done

echo "[ERROR] Reader did not become ready in time."
exit 1
