/*jslint node: true */
/*global describe: false, before: false, after: false, it: false */
"use strict";

// Declare the variables used
var expect = require('chai').expect,
    request = require('request'),
    server = require('../index'),
    redis = require('redis'),
    io = require('socket.io-client'),
    client;
client = redis.createClient();

// Server tasks
describe('server', function () {

    // Beforehand, start the server
    before(function (done) {
        console.log('Starting the server');
        done();
    });

    // Afterwards, stop the server and empty the database
    after(function (done) {
        console.log('Stopping the server');
        client.flushdb();
        done();
    });

    // Test the index route
    describe('Test the index route', function () {
        it('should return a page with the title Babblr', function (done) {
            request.get({ url: 'http://localhost:5000/' }, function (error, response, body) {
                expect(body).to.include('Babblr');
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                done();
            });
        });
    });

    // Test sending a message
    describe('Test sending a message', function () {
        it("should return 'Message received'", function (done) {
            // Connect to server
            var socket = io.connect('http://localhost:5000', {
                'reconnection delay' : 0,
                'reopen delay' : 0,
                'force new connection' : true
            });

            // Handle the message being received
            socket.on('message', function (data) {
                expect(data).to.include('Message received');

                client.lrange('chat:messages', 0, -1, function (err, messages) {
                    // Check message has been persisted
                    var message_list = [];
                    messages.forEach(function (message, i) {
                        message_list.push(message);
                    });
                    expect(message_list[0]).to.include('Message received');

                    // Finish up
                    socket.disconnect();
                    done();
                });
            });

            // Send the message
            socket.emit('send', { message: 'Message received' });
        });
    });
});
