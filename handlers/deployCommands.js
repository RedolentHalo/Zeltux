const { REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')
const { clientId, token } = require('../config.json')

module.exports = async () => {
    const commands = []

    const commandsPath = path.join(__dirname, '../commands')
    fs.readdirSync(commandsPath).forEach((category) => {
        const categoryPath = path.join(commandsPath, category)
        const commandFiles = fs
            .readdirSync(categoryPath)
            .filter((file) => file.endsWith('.js'))

        for (const file of commandFiles) {
            const command = require(path.join(categoryPath, file))
            commands.push(command.data.toJSON())
        }
    })

    const rest = new REST({ version: '10' }).setToken(token)

    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(Routes.applicationCommands(clientId), { body: commands })

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}
