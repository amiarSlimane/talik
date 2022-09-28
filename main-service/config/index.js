module.exports = {
  development: {
    sitename: 'Talik [Development]',
    serviceRegistryUrl: "http://localhost:7001",
    serviceVersion: "1.x.x",
  },
  production: {
    sitename: 'Talik',
    serviceRegistryUrl: `http://${process.env.MODE == 'docker' ? 'registry_service' : 'localhost'}:7001`,
    serviceVersion: "1.x.x",
  },
};
