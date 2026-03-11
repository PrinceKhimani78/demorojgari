module.exports = {
  apps: [
    {
      name: "rojgari-next",
      cwd: "/home/demo.rojgariindia.com/current",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3011",
      env: {
        NODE_ENV: "production",
        PORT: 3011
      },
      max_memory_restart: "300M"
    }
  ]
};
