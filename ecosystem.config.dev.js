module.exports = {
  apps : [
    
    {
      "name": "main-service",
      "script": "./main-service/server.js",
      "watch": true,
      "ignore_watch": ["node_modules"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "registry-service",
      "script": "./registry-service/bin/run",
      "watch": true,
      "ignore_watch": ["node_modules"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "comments-service",
      "script": "./comments-service/bin/run",
      "watch": true,
      "ignore_watch": ["node_modules"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "users-service",
      "script": "./users-service/bin/run",
      "watch": true,
      "ignore_watch": ["node_modules"],
      "env": {
        "NODE_ENV": "development"
      }
    }
],

 
};
