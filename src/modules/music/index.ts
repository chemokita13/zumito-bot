import { DisTube } from "distube";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { Module, ZumitoFramework } from "zumito-framework";

export class MusicModule extends Module {

    distube: DisTube;

    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath, framework);
        this.distube = new DisTube(framework.client, {
            searchSongs: 5,
            searchCooldown: 30,
            leaveOnEmpty: true,
            leaveOnFinish: false,
            leaveOnStop: true,
            plugins: [
                new YtDlpPlugin()
            ]
        });
        this.initializeDistube();
    }

    initializeDistube() {
        this.distube.on('searchResult', this.searchResultsEvent.bind(this));
        this.distube.on('searchCancel', message =>
            message.channel.send('Searching canceled'),
        )
        .on('searchInvalidAnswer', message =>
            message.channel.send('Invalid number of result.'),
        )
        .on('searchNoResult', message =>
            message.channel.send('No result found!'),
        )
        .on('searchDone', () => {})
        .on('error', (channel, e) => {
            if (channel) channel.send(`An error encountered: ${e.toString().slice(0, 1974)}`)
            else console.error(e)
        });
    }

    searchResultsEvent(message: any, result: any) {
        let i = 0;
        message.channel.send(
            `**Choose an option from below**\n${result
                .map((song: any) =>
                        `**${++i}**. ${song.name} - \`${
                            song.formattedDuration
                        }\``,
                )
                .join(
                    '\n',
                )}\n*Enter anything else or wait 30 seconds to cancel*`,
        );
    }
}