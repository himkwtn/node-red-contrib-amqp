const amqp = require("amqplib/callback_api");
module.exports = function (RED) {
  class AmqpIn {
    constructor(config) {
      RED.nodes.createNode(this, config);
      const node = this;
      const { queue, hostname, port } = config;
      amqp.connect({ hostname, port }, function (err, conn) {
        conn.createChannel(function (err, ch) {
          ch.assertQueue(queue);
          ch.consume(queue, function (msg) {
            if (msg !== null) {
              ch.ack(msg);
              node.send({ payload: msg.content.toString() });
            }
          });
          node.on("close", function (done) {
            ch.close(done);
          });
        });
      });
    }
  }

  RED.nodes.registerType("amqp-in", AmqpIn);
};
