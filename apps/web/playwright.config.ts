import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    cwd: __dirname,
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
  testDir: "tests",
};

export default config;

