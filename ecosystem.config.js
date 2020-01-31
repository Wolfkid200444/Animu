module.exports = {
  apps: [
    {
      name: 'animu',
      script: 'yarn',
      args: 'run prod',
      interpreter: '/bin/bash',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
