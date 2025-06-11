#!/usr/bin/env bash
set -e
echo "🚀 Installing Google Chrome…"
sudo apt-get update
sudo apt-get install -y wget gnupg2
wget -qO- https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -

echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

echo "✅ Chrome installed."
