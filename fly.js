const readline = require("readline");
const rl = readline.createInterface({ "input": process.stdin, "output": process.stdout});
let cmd = require("./commands.json")

const dgram = require("dgram")

const PORT = 8889
const HOST = '192.168.10.1'
const drone = dgram.createSocket('udp4')    // talk to bot via udp packets
const video = dgram.createSocket('udp4')
video.bind(11111)
drone.bind(PORT)

drone.on('message', message => {
  console.log(`${message}`)
})

function handleError(err) {
  if (err) {
    console.log(err)
  }
}

// video.on('message', message => {
//   console.log(`${message} video on`)
// })
drone.send('command', 0, 7, PORT, HOST, handleError)    // send sdk activate command
drone.send('battery?', 0, 8, PORT, HOST, handleError)   // check battery level

// drone.send('takeoff', 0, 7, PORT, HOST, handleError)
// setTimeout(1000)
// drone.send('land', 0, 4, PORT, HOST, handleError)

rl.on('line', handleInput)
function handleInput(line) {
    line = line.split(" ")

    /*
    Declare any used variables here.
    Set at beginning to erase any past values.
    */
    var command = undefined;
    var commandName = undefined;
    var commandLen = 0;
    var args = [];
    var numArgs = 0;
    var argsLen = 0;
    var packetLen = 0;
    var sendCmd = undefined;

    /*
    Sets command to the object associated with it
    If not found, throws an error
    */
    command = cmd.control[line[0]] || cmd.set[line[0]] || cmd.read[line[0]]
    if (!command)
    {
        throw "Invalid command name error."
    }

    line.shift()                                // extract the args
    args = line                                 // set args
    if (args.length != command.args)            // quick check for correct arg amount
    {
        throw "Invalid number of arguments"
    }

    numArgs = command.args                      // set argument length
    commandName = command.name                  // some commands have different names so just to be sure

    for (let i = 0; i < numArgs; i++)
    {
        argsLen += args[i].length
    }

    commandLen = commandName.length             // num of chrs in command 
    packetLen = commandLen + argsLen + numArgs  // len cmd + len of each arg + # of spaces needed

    /*
    Most cases would allow for 'line' to be passed back by itself,
    but in cases when cmd name differs, it's best to do this
    */
  //  console.log(args)
    sendCmd = commandName
    for (let i = 0; i < args.length; i++)
    {
      sendCmd += ` ${args[i]}` // cmd name + args
    }

    console.log(sendCmd, 0, packetLen, PORT, HOST)  // useful for debugging

    /*
    At this point should be safe to send packet
    If not, then guess we'll find out
    */
    drone.send(sendCmd, 0, packetLen, PORT, HOST, handleError);
}
