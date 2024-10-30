# Zeltux

An open-source Discord bot designed to enhance community interaction with a variety of engaging and useful features.

## Features

-   Fun commands
-   Moderation tools
-   Utility functions
-   And much more!

## Commands

🗂️ **Commands in ℹ️ Info**

-   `/botinfo`
-   `/help`
-   `/ping`
-   `/roleinfo`
-   `/serverinfo`
-   `/userinfo`
-   `/level`
-   `/leaderboard`

🗂️ **Commands in 🎈 Fun**

-   `/8ball`
-   `/catfact`
-   `/coinflip`
-   `/dadjoke`
-   `/dogfact`
-   `/joke`
-   `/meme`
-   `/pp`
-   `/randomnumber`
-   `/trivia`

🗂️ **Commands in 🔨 Moderation**

-   `/ban`
-   `/clear`
-   `/kick`
-   `/lock`
-   `/nick`
-   `/timeout`
-   `/unban`
-   `/unlock`
-   `/untimeout`
-   `/warn`
-   `/warnings`

🗂️ **Commands in 🪛 Utility**

-   `/calculator`
-   `/define`
-   `/todo`
-   `/translate`
-   `/weather`

🗂️ **Commands in 🪛 Admin**

-   `/giveaway`
-   `/leveladmin`

## Quick Setup

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/RedolentHalo/Zeltux.git
    cd Zeltux
    ```

2. **Install Dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:

    ```bash
    npm install
    ```

3. **Create Configuration files:**
   In the root of the project, copy the example configuration files:

    ```bash
    cp config.json.example config.json
    cp .env.example .env
    ```

4. **Fill in Your Configuration:**
   Open the `config.json` file and fill in the following fields:

    ```json
    {
        "clientId": "YOUR_CLIENT_ID",
        "weatherApi": "YOUR_WEATHER_API_KEY",
        "MongoDBURI": "YOUR_MONGODB_CONNECTION_STRING"
    }
    ```
   
   Open the `.env` file and fill in the following fields (Required):
   
    ```env
    Token=PLACE YOUR TOKEN HERE
    ```


5. **Run the Bot:**
    ```bash
    npm run start
    ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## Code of Conduct

We strive to maintain a friendly, inclusive, and respectful community. Please follow these guidelines:

-   **Be Respectful:** Treat others with respect. Disagreements are okay, but be civil.
-   **Be Inclusive:** We welcome all contributions and encourage participation from everyone.
-   **Be Supportive:** Help others when they have questions, and be open to feedback.

If you experience or witness unacceptable behavior, please report it to the maintainers of this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
