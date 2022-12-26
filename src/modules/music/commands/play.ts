import { GuildBasedChannel, GuildMember, TextBasedChannel } from "discord.js";
import { DisTube } from "distube";
import { Command, CommandArgDefinition, CommandParameters, SelectMenuParameters } from "zumito-framework";
import { MusicModule } from "../index.js";

export class Play extends Command {

    args: CommandArgDefinition[] = [
        {
            name: 'song',
            type: 'string',
            optional: false,
        }
    ];

    async execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): Promise<void> {
        const voiceChannel = message?.member?.voice?.channel || (interaction?.member as GuildMember)?.voice?.channel;
        if (voiceChannel) {
            const distube: DisTube = (framework.modules.get('music') as MusicModule).distube;
            distube.play(voiceChannel, args.get('song'), {
                message,
                textChannel: (message?.channel || interaction?.channel!) as GuildBasedChannel & TextBasedChannel,
                member: (message?.member || interaction?.member) as GuildMember,
            });
        } else {
            message!.channel.send({
                content: "Debes estar en un canal de voz para usar este comando"
            });
        }
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}
}

