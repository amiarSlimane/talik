## Usage
To run the services you can use pm2 or docker.

pm2 for on development environment 
```
pm2-dev start ecosystem.config.json
```

pm2 for on production environment 
```
pm2 start ecosystem.config.json
```

deploy using pm2 (need to setup ssh key for the production server to deploy using ssh)
```
 pm2 deploy ecosystem.config.js production
```

```
docker-compose up -d
```