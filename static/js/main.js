$(document).ready(function () {
    'use strict';

    // Set up the connection
    var field, socket, output;
    socket = io.connect(window.location.href);

    // Get a reference to the input
    field = $('textarea#message');

    // Get a reference to the output
    output = $('div.conversation');

    // Handle message submit
    $('a#submitbutton').on('click', function () {
        // Create the message
        var msg;
        msg = field.val();
        socket.emit('send', { message: msg });
        field.val('');
    });

    // Handle incoming messages
    socket.on('message', function (data) {
        // Insert the message
        output.append('<p>Anonymous Coward : ' + data + '</p>');
    });
});
