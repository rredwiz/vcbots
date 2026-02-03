import 'libsodium-wrappers';
import { Client, GatewayIntentBits } from "discord.js";
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} from "@discordjs/voice";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const TOKEN = process.env.DISCORD_BOT_TOKEN;

client.on("clientReady", async () => {
    console.log("discord bot is logged in");
});

async function doWei(interaction) {
    await interaction.deferReply();
    await interaction.editReply(buildWeiStringMessage());
}

function getWeiPunctuation() {
    let punctuation = "";
    let punctuationFloat = Math.random();

    if (punctuationFloat > 0.66) punctuation = "!";
    else if (punctuationFloat > 0.33) punctuation = "?";

    return punctuation;
}

function buildWeiStringPing() {
    const numOfI = Math.floor(Math.random() * 10 + 1);
    const numOfE = Math.floor(Math.random() * 10 + 1);

    return "w" + "e".repeat(numOfE) + "i".repeat(numOfI) + "?";
}

function buildWeiStringMessage() {
    const numOfI = Math.floor(Math.random() * 10 + 1);
    const numOfE = Math.floor(Math.random() * 10 + 1);
    const punctuation = getWeiPunctuation();

    return "w" + "e".repeat(numOfE) + "i".repeat(numOfI) + punctuation;
}

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const channel = message.channel;

    if (message.mentions.has(client.user)) {
        await message.reply(buildWeiStringPing());
    } else if (message.content.toLowerCase().includes("wei")) {
        await channel.send(buildWeiStringMessage());
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === "wei") await doWei(interaction);
    if (commandName === "joincall") {
        const resource = createAudioResource("./audio/wei3.MP3");
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply("join a voice call dumbass");
        }

        await interaction.deferReply();

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        player.play(resource);
        connection.subscribe(player);
        player.play(resource);

        interaction.editReply("playing sound");

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
    }
});

client.login(TOKEN);
