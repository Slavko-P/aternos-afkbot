function getLogDate() {
	var d = new Date();
	var dateString = "[" + ("0" + d.getDate()).slice(-2) + "-" 
					+ ("0"+(d.getMonth()+1)).slice(-2) + "-" 
					+ d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) 
					+ ":" + ("0" + d.getMinutes()).slice(-2) 
					+ ":" + ("0" + d.getSeconds()).slice(-2) + "]";
	return dateString;
}

require('log-timestamp')(function() { 
 return getLogDate() + ' %s' });

/*
function updateLine(message){
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
	process.stdout.write(message);
}
*/

function printPing(bot) {
	console.log("Ping: " + bot.player.ping);
}

const mineflayer = require('mineflayer')
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let data = JSON.parse(rawdata);
var lasttime = -1;
var moving = 0;
var connected = 0;
var actions = ['forward', 'back', 'left', 'right']
var lastaction;
var pi = 3.14159;
var moveinterval = 2; // 2 second movement interval
var maxrandom = 5; // 0-5 seconds added to movement interval (randomly)
var host = data["ip"];
var port = data["port"];
var username = data["name"]
var bot = mineflayer.createBot({
    host: host,
    port: port,
    username: username
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;

}
bot.on('login', function() {
    console.log("Logged In")
});
bot.on('time', function() {
    if (connected < 1) {
        return;
    }
    if (lasttime < 0) {
        lasttime = bot.time.age;
    } else {
        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval * 20 + randomadd;
        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction, false);
                moving = 0;
                lasttime = bot.time.age;
            } else {
                var yaw = Math.random() * pi - (0.5 * pi);
                var pitch = Math.random() * pi - (0.5 * pi);
                bot.look(yaw, pitch, false);
                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction, true);
                moving = 1;
                lasttime = bot.time.age;
                bot.activateItem();
				// pint check
				printPing(bot);
            }
        }
    }
});

bot.on('spawn', function() {
    connected = 1;
});

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)
