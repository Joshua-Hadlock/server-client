// startup files
const net = require('net');
const fs = require('fs');
var names = 1;
const clients = [];
const adminPassword = 'haha';


// erase the old file or create a new file
fs.writeFile('./server.log', '', (err) => {
    if (err) {
        console.log('there was an error clearing the file')
    }
})

// creating the server
let server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.write('welcome to this server!!!\n')
    client.name = 'client' + names;
    names += 1;

    // write to the file
    fs.appendFile('./server.log', client.name + ' joined the server\n\n', (err) => {
        if (err) {
            console.log('there was an error while pushing stuff up to the file')
        }
    })
    // add client to list of clientss
    clients.push(client);

    // tell all other clients that someone joined
    clients.forEach((theClient) => {
        if (theClient.name != client.name) {
            theClient.write(`welcome to the server ${client.name}!\n`);
        }
        
    })

    // recieve data from clients
    client.on('data', package => {


        // tell all other clients that someone has quit
        if (package === 'quit\n') {

            // write to file
            fs.appendFile('./server.log', client.name + ' left the chat\n', (err) => {
                if (err) {
                    console.log('there was an error while pushing stuff up to the file')
                }
            })
            clients.forEach((theClient) => {
                if (theClient.name != client.name) {
                    theClient.write(`${client.name} left the chat\n`);
                }
                


            })

            // remove client from the list of clients
            var counter = 0;
                clients.forEach(theClient => {
                    if (theClient.name === client.name) {
                        clients.splice(counter, 1)
                    }
                    counter += 1;
                })
        } else {
            console.log(`${client.name}: ${package}\n`);

            // write to file
        fs.appendFile('./server.log',`${client.name}: ${package}\n`, (err) => {
            if (err) {
                console.log('there was an error while pushing stuff up to the file')
            }
        })



            var packageSpecialStuff = package.split(' ');


            // whipser function
            if (packageSpecialStuff[0] === '/w') {
                var isNameNotThere = true;
                if (packageSpecialStuff[2]) {
                    clients.forEach((theClient) => {
                    const newPackage = package.split(' ')
                    newPackage.splice(0,2);
                    const whisperedText = newPackage.join(' ')
                    if (theClient.name === packageSpecialStuff[1].replace('\n', '')) {
                        if (theClient.name === client.name) {
                            client.write(`you can't whisper to yourself\n`);
                        } else {
                            theClient.write(`${client.name} whispered: ${whisperedText}`)
                        
                        }
                        isNameNotThere = false;
                    }
                })
                
                if (isNameNotThere) {
                    client.write(`there is nobody named ${packageSpecialStuff[1].replace('\n' , '')} in the server\n`)
                }
                } else {
                    client.write('invalid number of inputs\n')
                }
                


                    // change username
            } else if (packageSpecialStuff[0] === '/username') {
                var isNamable = true;
                if (client.name === packageSpecialStuff[1].replace('\n', '')) {
                    client.write('You are already named ' + client.name + '\n');
                    isNamable = false;
                } else {
                    clients.forEach((theClient) => {
                        if (theClient.name === packageSpecialStuff[1].replace('\n', '')) {
                            client.write('someone is already named ' + packageSpecialStuff[1])
                            isNamable = false;
                        }
                    })
                }
                if (isNamable) {
                    clients.forEach((theClient) => {
                        if (theClient.name != client.name) {
                            theClient.write(`${client.name} changed their name to ${packageSpecialStuff[1]}`)
                        }
                    })
                    client.name = packageSpecialStuff[1].replace('\n', '')
                }


                // kicking function
            } else if (packageSpecialStuff[0] === '/kick') {
                var kickedPersonNotFound = true;
                if (packageSpecialStuff[2]) {
                    if (packageSpecialStuff[1].replace('\n', '') === client.name) {
                        client.write(`you can't kick yourself\n`)
                    } else {
                        if (packageSpecialStuff[2].replace('\n', '') === adminPassword) {
                    clients.forEach((theClient) => {
                        if (packageSpecialStuff[1].replace('\n', '') === theClient.name) {
                            theClient.write('you were kicked by ' + client.name)
                            kickedPersonNotFound = false;


                            var counter = 0;
                            clients.forEach(theClient => {
                            if (theClient.name === packageSpecialStuff[1].replace('\n', '')) {
                                clients.splice(counter, 1)
                            }
                            counter += 1;
                            })

                            clients.forEach((theClient2) => {
                                theClient2.write(theClient.name + ' was kicked by ' + client.name +'\n')
                            })
                        }
                    })
                    if (kickedPersonNotFound) {
                        client.write('client ' + packageSpecialStuff[1].replace('\n', '') + ' was not found \n');
                    }
                } else {
                    client.write('incorrect password\n')
                    }
                }
                } else {
                    client.write('you must put a password in\n')
                }
                
                    //list of clients
            } else if (packageSpecialStuff[0].replace('\n', '') === '/clientlist') {
                var listOfClients = '';
                clients.forEach(theClient => {
                    listOfClients += theClient.name + '\n';
                })
                client.write(listOfClients);

                // writing to everyone else what a client said
            } else {
               clients.forEach((theClient) => {
            if (theClient.name != client.name) {
                theClient.write(`${client.name}: ${package}`);
            }
            
        }) 
            }
            
        }



        
    })


    // port being listened on
}).listen(3001);

console.log('listening on port 3001');