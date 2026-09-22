/**
 * PM2 process map for the Silifton marketing site.
 *
 * Only the Next.js frontend runs here now. The API that serves its content
 * (and the admin UI for editing it) lives in the silifton-crm repo:
 *   crmapi.silifton.com → silifton-crm-api (PM2)   ·   crm.silifton.com → Website section
 *
 * Run from the repo root:
 *   pm2 start  deploy/ecosystem.config.js           # first time
 *   pm2 reload deploy/ecosystem.config.js           # zero-downtime restart
 *   pm2 save                                         # persist for boot
 */
module.exports = {
  apps: [
    {
      name: "silifton-frontend",
      cwd: "./frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 7000",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: "7000",
      },
      out_file: "/var/log/silifton/frontend.out.log",
      error_file: "/var/log/silifton/frontend.err.log",
      merge_logs: true,
      time: true,
    },
  ],
};
