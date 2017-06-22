var Cassandra = require("express-cassandra");
var sleep = require("sleep");
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

function connection() {
  models.connect(function(err) {
    if (err) {
      console.log("waiting");
      sleep.sleep(2);
      connection();
      return;
    }

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
        key: [["id", "country_name", "service"]]
      },
      function(err, UserModel) {
        if (err) {
          console.log("waiting");
          sleep.sleep(2);
          connection();
          return;
        }
      }
    );
  });
}
connection();
module.exports = models;
