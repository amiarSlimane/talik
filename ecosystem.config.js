module.exports = {
  apps : [
    
    {
      "name": "main-service",
      "script": "./main-service/server.js",
      "env_production": {
        "NODE_ENV": "production"
      },
      "env_production": {
        "NODE_ENV": "production"
      },
      "env_development": {
         "NODE_ENV": "development"
      }
    },
    {
      "name": "registry-service",
      "script": "./registry-service/bin/run",
      "env_production": {
        "NODE_ENV": "production"
      },
      "env_development": {
         "NODE_ENV": "development"
      }
    },
    {
      "name": "comments-service",
      "script": "./comments-service/bin/run",
      "env": {
        "NODE_ENV": "production"
      },
      "env_development": {
         "NODE_ENV": "development"
      }
    },
    {
      "name": "users-service",
      "script": "./users-service/bin/run",
      "env_production": {
        "NODE_ENV": "production"
      },
      "env_development": {
         "NODE_ENV": "development"
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
      'post-deploy' : 'node install.js && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
