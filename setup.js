const fs = require('fs')
const path = require('path')
const readline = require('readline')
const chalk = require('chalk')

const ASCII_ART = `

▄███████▄     ▄████████  ▄█           ███     ███    █▄  ▀████    ▐████▀         ▄████████    ▄████████     ███     ███    █▄     ▄███████▄ 
██▀     ▄██   ███    ███ ███       ▀█████████▄ ███    ███   ███▌   ████▀         ███    ███   ███    ███ ▀█████████▄ ███    ███   ███    ███ 
      ▄███▀   ███    █▀  ███          ▀███▀▀██ ███    ███    ███  ▐███           ███    █▀    ███    █▀     ▀███▀▀██ ███    ███   ███    ███ 
 ▀█▀▄███▀▄▄  ▄███▄▄▄     ███           ███   ▀ ███    ███    ▀███▄███▀           ███         ▄███▄▄▄         ███   ▀ ███    ███   ███    ███ 
  ▄███▀   ▀ ▀▀███▀▀▀     ███           ███     ███    ███    ████▀██▄          ▀███████████ ▀▀███▀▀▀         ███     ███    ███ ▀█████████▀  
▄███▀         ███    █▄  ███           ███     ███    ███   ▐███  ▀███                  ███   ███    █▄      ███     ███    ███   ███        
███▄     ▄█   ███    ███ ███▌    ▄     ███     ███    ███  ▄███     ███▄          ▄█    ███   ███    ███     ███     ███    ███   ███        
 ▀████████▀   ██████████ █████▄▄██    ▄████▀   ████████▀  ████       ███▄       ▄████████▀    ██████████    ▄████▀   ████████▀   ▄████▀      
                         ▀                                                                                                                   
`

async function createConfigFile() {
    console.clear()
    console.log(chalk.cyan(ASCII_ART))
    console.log(
        chalk.yellow(
            '🚀 Welcome to the Zeltux Discord Bot Configuration Setup! 🚀\n'
        )
    )

    const configExamplePath = path.join(__dirname, 'config.json.example')
    const configPath = path.join(__dirname, 'config.json')

    if (fs.existsSync(configPath)) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })

        const overwrite = await new Promise((resolve) => {
            rl.question(
                chalk.red(
                    '⚠️  config.json already exists. Do you want to overwrite it? (y/N): '
                ),
                (answer) => {
                    rl.close()
                    resolve(answer.toLowerCase() === 'y')
                }
            )
        })

        if (!overwrite) {
            console.log(chalk.yellow('🛑 Configuration setup cancelled.'))
            process.exit(0)
        }
    }

    const configExample = JSON.parse(fs.readFileSync(configExamplePath, 'utf8'))
    const configToWrite = { ...configExample }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const fields = [
        { key: 'token', prompt: 'Discord Bot Token', type: 'text' },
        { key: 'clientId', prompt: 'Discord Client ID', type: 'text' },
        { key: 'weatherApi', prompt: 'Weather API Key', type: 'text' },
        { key: 'MongoDBURI', prompt: 'MongoDB Connection URI', type: 'text' },
        { key: 'logsChannelId', prompt: 'Logs Channel ID', type: 'text' },
        { key: 'lavalink.host', prompt: 'Lavalink Host', type: 'text' },
        { key: 'lavalink.port', prompt: 'Lavalink Port', type: 'number' },
        { key: 'lavalink.name', prompt: 'Lavalink Name', type: 'text' },
        { key: 'lavalink.password', prompt: 'Lavalink Password', type: 'text' },
    ]

    for (const field of fields) {
        await new Promise((resolve) => {
            const askQuestion = () => {
                rl.question(
                    chalk.green(`🔑 Enter ${field.prompt}: `),
                    (answer) => {
                        if (field.type === 'optional' && !answer) {
                            console.log(
                                chalk.yellow(`⏩ Skipping ${field.prompt}`)
                            )
                            resolve()
                            return
                        }

                        if (answer.trim() === '' && field.type !== 'optional') {
                            console.log(
                                chalk.red(
                                    '❌ This field cannot be empty. Please try again.'
                                )
                            )
                            askQuestion()
                            return
                        }

                        configToWrite[field.key] =
                            field.type === 'number'
                                ? parseInt(answer.trim(), 10)
                                : answer.trim()
                        resolve()
                    }
                )
            }
            askQuestion()
        })
    }

    fs.writeFileSync(configPath, JSON.stringify(configToWrite, null, 4), 'utf8')

    rl.close()

    console.log(chalk.green('\n✅ Configuration file created successfully!'))
    console.log(
        chalk.blue(
            '🤖 Your Zeltux Discord Bot is now ready to be configured.\n'
        )
    )
}

createConfigFile().catch((error) => {
    console.error(chalk.red('❌ An error occurred during setup:'), error)
})
