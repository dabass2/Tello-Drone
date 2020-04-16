const readline = require("readline");
const rl = readline.createInterface({ "input": process.stdin, "output": process.stdout});
let cmd = require("./commands.json")

const dgram = require("dgram")

const PORT = 8889
const HOST = '192.168.10.1'
const drone = dgram.createSocket('udp4')
drone.bind(PORT)

drone.on('message', message => {
  console.log(`${message}`)
})

function handleError(err) {
  if (err) {
    console.log('ERROR')
    console.log(err)
  }
}

drone.send('command', 0, 7, PORT, HOST, handleError)
drone.send('battery?', 0, 8, PORT, HOST, handleError)

// drone.send('takeoff', 0, 7, PORT, HOST, handleError)
// setTimeout(1000)
// drone.send('land', 0, 4, PORT, HOST, handleError)

rl.on('line', handleInput)
function handleInput(line) {
    console.log(line.split(" "))
    line = line.split(" ")
    if (line.length > 1)
    {

    }

    switch (line) {
        case "exit":
            return;
        case "takeoff":
            console.log("Detected takeoff command.");
            drone.send('takeoff', 0, 7, PORT, HOST, handleError);
            break;
        case "land":
            console.log("Detected land command.");
            drone.send('land', 0, 4, PORT, HOST, handleError);
            break;
        case "battery":
            let batt = drone.send('battery?', 0, 8, PORT, HOST, handleError);
            console.log(batt);
        case "flip":
            drone.send(`flip ${line[1]}`, 0, 6, PORT, HOST, handleError);
        default:
            break;
    }
}
