var Cassandra = require("express-cassandra");
console.log(process.env.DATABASE4_HOST);
var models = Cassandra.createClient({
  clientOptions: {
    contactPoints: [process.env.DATABASE4_HOST],
    protocolOptions: { port: process.env.DATABASE4_PORT },
    keyspace: process.env.DATABASE4_KEYSPACE,
    queryOptions: { consistency: Cassandra.consistencies.one }
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: "SimpleStrategy",
      replication_factor: 1
    },
    migration: "alter",
    createKeyspace: true
  }
});

models.connect(function(err) {
  if (err) throw err;

  var MyModel = models.loadSchema(
    "Data",
    {
      fields: {
        id: "text",
        ip: "text",
        country_code: "text",
        country_name: "text",
        city: "text",
        latitude: "text",
        longitude: "text",
        service: "text"
      },
      key: ["id"]
    },
    function(err, UserModel) {
        
    }
  );
});
module.exports = models;
