const net = require('net');

// creating the client
let client = net.createConnection({ port: 3001 }, () => {
    console.log('connected');
    client.setEncoding('utf8');

    // receiving data
    client.on('data', data => {
        // show message
        console.log(data)

        // kicked function
        const dataArray = data.split(' ')
        if (dataArray[2] === 'kicked') {
            client.end()
            process.exit();
        }
    })


    // allow for user actifivity
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        let chunk;
        // if you typed something, send it to server
        while ((chunk = process.stdin.read()) != null) {
            client.write(chunk)

            // if you quit, leave
            if (chunk.toString().trim() == "quit") {
                console.log('Goodbye, please join again!')
                client.end();
                process.exit();
            }
        }
        console.log('')
    })
});