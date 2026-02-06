/* 
    TODO complete the deploy commands
    Usage: node deploy-commands.js botname
*/

import {
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });

// TODO
// const botname = process.argv[2];

const clientId = process.env.MOMOI_CLIENT_ID;
const guildId = process.env.DISCORD_BOT_GUILD_ID;
const token = process.env.MOMOI_TOKEN;

// commands go here
const commands = [
    new SlashCommandBuilder()
        .setName("momoi")
        .setDescription("那个."),
    new SlashCommandBuilder()
        .setName("momoijoin")
        .setDescription("那个!!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), // use applicationCommands(clientId) for global
            { body: commands }
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
