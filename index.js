const { Client, GatewayIntentBits } = require('discord.js')
const dotenv = require("dotenv");
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

/* Required to load Environment */
dotenv.config();
/* Required to load Environment */

console.log(
    chalk.red(
        '███████████████████████████████████████████████████████████████████████████████████████████████████'
    ) +
        '\n' +
        chalk.green(
            '█░░░░░░░░░░░░░░░░░░█░░░░░░░░░░░░░░█░░░░░░█████████░░░░░░░░░░░░░░█░░░░░░██░░░░░░█░░░░░░░░██░░░░░░░░█'
        ) +
        '\n' +
        chalk.yellow(
            '█░░▄▀▄▀▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀░░█████████░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀░░██░░▄▀░░█░░▄▀▄▀░░██░░▄▀▄▀░░█'
        ) +
        '\n' +
        chalk.blue(
            '█░░░░░░░░░░░░▄▀▄▀░░█░░▄▀░░░░░░░░░░█░░▄▀░░█████████░░░░░░▄▀░░░░░░█░░▄▀░░██░░▄▀░░█░░░░▄▀░░██░░▄▀░░░░█'
        ) +
        '\n' +
        chalk.magenta(
            '█████████░░░░▄▀░░░░█░░▄▀░░█████████░░▄▀░░█████████████░░▄▀░░█████░░▄▀░░██░░▄▀░░███░░▄▀▄▀░░▄▀▄▀░░███'
        ) +
        '\n' +
        chalk.cyan(
            '███████░░░░▄▀░░░░███░░▄▀░░░░░░░░░░█░░▄▀░░█████████████░░▄▀░░█████░░▄▀░░██░░▄▀░░███░░░░▄▀▄▀▄▀░░░░███'
        ) +
        '\n' +
        chalk.red(
            '█████░░░░▄▀░░░░█████░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀░░█████████████░░▄▀░░█████░░▄▀░░██░░▄▀░░█████░░▄▀▄▀▄▀░░█████'
        ) +
        '\n' +
        chalk.green(
            '███░░░░▄▀░░░░███████░░▄▀░░░░░░░░░░█░░▄▀░░█████████████░░▄▀░░█████░░▄▀░░██░░▄▀░░███░░░░▄▀▄▀▄▀░░░░███'
        ) +
        '\n' +
        chalk.yellow(
            '█░░░░▄▀░░░░█████████░░▄▀░░█████████░░▄▀░░█████████████░░▄▀░░█████░░▄▀░░██░░▄▀░░███░░▄▀▄▀░░▄▀▄▀░░███'
        ) +
        '\n' +
        chalk.blue(
            '█░░▄▀▄▀░░░░░░░░░░░░█░░▄▀░░░░░░░░░░█░░▄▀░░░░░░░░░░█████░░▄▀░░█████░░▄▀░░░░░░▄▀░░█░░░░▄▀░░██░░▄▀░░░░█'
        ) +
        '\n' +
        chalk.magenta(
            '█░░▄▀▄▀▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█████░░▄▀░░█████░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀░░██░░▄▀▄▀░░█'
        ) +
        '\n' +
        chalk.cyan(
            '█░░░░░░░░░░░░░░░░░░█░░░░░░░░░░░░░░█░░░░░░░░░░░░░░█████░░░░░░█████░░░░░░░░░░░░░░█░░░░░░░░██░░░░░░░░█'
        ) +
        '\n' +
        chalk.red(
            '███████████████████████████████████████████████████████████████████████████████████████████████████'
        )
)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})

global.styles = {
    successColor: chalk.bold.green,
    warningColor: chalk.bold.yellow,
    infoColor: chalk.bold.blue,
    commandColor: chalk.bold.cyan,
    userColor: chalk.bold.magenta,
    errorColor: chalk.red,
}

const handlerFiles = fs
    .readdirSync(path.join(__dirname, 'handlers'))
    .filter((file) => file.endsWith('.js'))
for (const file of handlerFiles) {
    const handler = require(`./handlers/${file}`)
    if (typeof handler === 'function') {
        handler(client)
    }
}
console.log(
    global.styles.successColor(`✅ Succesfully loaded ${(handlerFiles.length + 1)} handlers`)
)

client.login(process.env.Token)
