const amqp = require("amqplib/callback_api");
module.exports = function (RED) {
  class AmqpOut {
    constructor(config) {
      RED.nodes.createNode(this, config);
      const node = this;
      const { queue, hostname, port } = config;
      amqp.connect({ hostname, port }, function (err, conn) {
        conn.createChannel(function (err, ch) {
          node.on("input", function (msg, send, done) {
            if (err) {
              if (done) {
                done(err);
              } else {
                node.error(err, msg);
              }
            }
            ch.assertQueue(queue);
            ch.sendToQueue(queue, Buffer.from(String(msg.payload)));
            if (done) {
              done();
            }
            node.on("close", function (done) {
              ch.close(done);
            });
          });
        });
      });
    }
  }

  RED.nodes.registerType("amqp-out", AmqpOut);
};
