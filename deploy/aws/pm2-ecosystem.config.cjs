module.exports = {
  apps: [
    {
      name: 'checkresumeai-backend',
      script: 'dist/server.js',
      cwd: __dirname + '/../../backend',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '400M',
      error_file: '/var/log/checkresumeai-error.log',
      out_file: '/var/log/checkresumeai-out.log',
      time: true,
    },
  ],
};
