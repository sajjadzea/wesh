# Troubleshooting

### Running E2E Tests in CI
- Use Electron headless by default:
  ```bash
  npm run e2e
  ```
- Need Chrome?
  ```bash
  npm run e2e:chrome
  ```
- If Xvfb errors persist, ensure `scripts/install-chrome.sh` ran or install Xvfb manually:
  ```bash
  sudo apt-get install -y xvfb
  ```
