const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: false,
    retries: { runMode: 2, openMode: 0 },
    setupNodeEvents(on, config) {
      if (process.env.CYPRESS_DEBUG === 'true') {
        on('before:browser:launch', (browser = {}, launchOptions) => {
          console.log('Launching browser', browser.name);
        });
      }
    }
  }
});
// Troubleshoot: increase defaultCommandTimeout if tests hang
