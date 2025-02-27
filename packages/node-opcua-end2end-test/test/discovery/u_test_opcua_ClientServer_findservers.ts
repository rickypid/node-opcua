import async from "async";
import { OPCUAClient }from "node-opcua";
import { build_server_with_temperature_device }from "../../test_helpers/build_server_with_temperature_device";
// eslint-disable-next-line import/order
const describe = require("node-opcua-leak-detector").describeWithLeakDetector;

const port = 2005;

export function t(test: any) {
    describe("DISCO6 - testing OPCUA-Service Discovery Endpoint", function () {
        let server, endpointUrl;

        before(async () => {
            server = await build_server_with_temperature_device({ port });
            endpointUrl = server.getEndpointUrl();
        });
        after(async () => {
            await server.shutdown();
        });

        function make_on_connected_client(functor, done) {
            let connected = false;
            const client = OPCUAClient.create({});
            const tasks = [
                function (callback) {
                    client.connect(endpointUrl, (err) => {
                        connected = true;
                        callback(err);
                    });
                },

                function (callback) {
                    try {
                        functor(client, callback);
                    } catch (err) {
                        callback(err);
                    }
                },

                function (callback) {
                    client.disconnect((err) => {
                        connected = false;
                        callback(err);
                    });
                }
            ];
            async.series(tasks, (err1) => {
                if (connected) {
                    client.disconnect((err) => {
                        connected = false;
                        if (err) {
                            console.log(err);
                        }
                        done(err1);
                    });
                } else {
                    done(err1);
                }
            });
        }

        it("DISCO6-A - should answer a FindServers Request - without filters", (done) => {
            // Every  Server  shall provide a  Discovery Endpoint  that supports this  Service;   however, the  Server
            // shall only return a single record that describes itself.  Gateway Servers  shall return a record for each
            // Server  that they provide access to plus (optionally) a record that allows the  Gateway Server  to be
            // accessed as an ordinary OPC UA  Server.
            make_on_connected_client((client, callback) => {
                client.findServers((err, servers) => {
                    if (!err) {
                        servers.length.should.eql(1);
                    }
                    callback(err);
                });
            }, done);
        });

        it("DISCO6-B - should answer a FindServers Request - with filters", (done) => {
            make_on_connected_client((client, callback) => {
                const filters = {};
                client.findServers(filters, (err, servers) => {
                    servers.length.should.eql(1);
                    callback(err);
                });
            }, done);
        });

        it("DISCO6-C - should answer FindServers Request and apply serverUris filter", (done) => {
            make_on_connected_client((client, callback) => {
                const filters = {
                    serverUris: ["invalid server uri"]
                };

                client.findServers(filters, function (err, servers) {
                    servers.length.should.eql(0);
                    callback(err);
                });
            }, done);
        });

        it("DISCO6-D - should answer FindServers Request and apply endpointUri filter", (done) => {
            make_on_connected_client((client, callback) => {
                const filters = {
                    serverUris: ["invalid server uri"]
                };

                client.findServers(filters, (err, servers) => {
                    servers.length.should.eql(0);
                    callback(err);
                });
            }, done);
        });
    });
};
