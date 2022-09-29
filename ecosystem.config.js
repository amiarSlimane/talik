module.exports = {
  apps : [
    
    {
      "name": "main-service",
      "script": "./main-service/server.js",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "registry-service",
      "script": "./registry-service/bin/run",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "comments-service",
      "script": "./comments-service/bin/run",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "users-service",
      "script": "./users-service/bin/run",
      "env": {
        "NODE_ENV": "production"
      }
    }
],

  deploy : {
    production : {
      user : 'slimane',
      host : 'talik.io',
      ref  : 'origin/main',
      repo : 'https://github.com/amiarSlimane/talik.git',
      path : '/home/slimane/talik/api',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
