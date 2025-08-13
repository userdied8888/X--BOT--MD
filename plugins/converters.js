const {Sparky, isPublic,uploadMedia,handleMediaUpload} = require("../lib");
const {getString, appendMp3Data, addExifToWebP, getBuffer} = require('./pluginsCore');
const googleTTS = require('google-tts-api');
const config = require('../config.js');
const lang = getString('converters');


Sparky({
    name: "url",
    fromMe: true,
    desc: "",
    category: "converters",
  }, async ({ args, m }) => {
    if (!m.quoted) {
      return m.reply('Reply to an Image/Video/Audio');
    }
    try {
        await m.react('⏫');
      const mediaBuffer = await m.quoted.download();
      const mediaUrl = await handleMediaUpload(mediaBuffer);
      await m.react('✅');
      m.reply(mediaUrl);
    } catch (error) {
        await m.react('❌');
      m.reply('An error occurred while uploading the media.');
    }
  });

Sparky(
    {
        name: "👀👀",
        fromMe: true,
        category: "converters",
        desc: "Resends the view Once message"
    },
    async ({
        m, client 
    }) => {
        if (!m.quoted) {
            return m.reply("_Reply to ViewOnce Message !_");
        }
        try {
            m.react("⏫");
		let buff = await m.quoted.download();
		return await m.sendFile(buff);
        } catch (e) {
            return m.react("❌");
        } 
    });

Sparky({
		name: "sticker",
		fromMe: isPublic,
		category: "converters",
		desc: lang.STICKER_DESC
	},
	async ({
		m,
		args
	}) => {
		if (!m.quoted || !(m.quoted.message.imageMessage || m.quoted.message.videoMessage)) {
			return await m.reply(lang.STICKER_ALERT);
		}
		await m.react('⏫');
		await m.sendMsg(m.jid, await m.quoted.download(), {
			packName: args.split(';')[0] || config.STICKER_DATA.split(';')[0],
			authorName: args.split(';')[1] || config.STICKER_DATA.split(';')[1],
			quoted: m
		}, "sticker");
		return await m.react('✅');
	});


Sparky({
		name: "mp3",
		fromMe: isPublic,
		category: "converters",
		desc: lang.MP3_DESC
	},
	async ({
		m,
		args
	}) => {
		if (!m.quoted || !(m.quoted.message.audioMessage || m.quoted.message.videoMessage || (m.quoted.message.documentMessage && m.quoted.message.documentMessage.mimetype === 'video/mp4'))) {
			return await m.reply(lang.MP3_ALERT);
		}
		await m.react('⏫');
		await m.sendMsg(m.jid, await m.quoted.download(), { mimetype: "audio/mpeg", quoted: m }, 'audio')
		/*
		await m.sendMsg(m.jid, await appendMp3Data(await m.quoted.download(), args.split(";")[2] || config.AUDIO_DATA.split(";")[2], {
                        title: args.split(";")[0] || config.AUDIO_DATA.split(";")[0],
                        artist: args.split(";")[1] || config.AUDIO_DATA.split(";")[1]
                }), {
                        mimetype: 'audio/mpeg',
			quoted: m
		}, "audio");
  */
		return await m.react('✅');
	});


Sparky({
		name: "take",
		fromMe: isPublic,
		category: "converters",
		desc: lang.TAKE_DESC
	},
	async ({
		m,
		args,
		client
	}) => {
		if (!m.quoted || !(m.quoted.message.stickerMessage || m.quoted.message.audioMessage)) {
			return await m.reply(lang.TAKE_ALERT);
		}
		await m.react('⏫');
			var audiomsg = m.quoted.message.audioMessage;
    var stickermsg = m.quoted.message.stickerMessage;
    var q = await m.quoted.download();
    if (stickermsg) {
        if (args!=="") {
        var exif = {
            author: args.includes(";")?args.split(";")[1]:"",
            packname: args.includes(";")?args.split(";")[0]:args,
            categories: config.STICKER_DATA.split(";")[2] || "😂",
            android: "https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X--BOT--MD",
            ios: "https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X--BOT--MD"
        } }
        else {
            var exif = {
                author: config.STICKER_DATA.split(";")[1] || "",
                packname: config.STICKER_DATA.split(";")[0] || "",
                categories: config.STICKER_DATA.split(";")[2] || "😂",
                android: "https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X--BOT--MD",
                ios: "https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X--BOT--MD"
            }
        }
        return await client.sendMessage(m.jid,{sticker: fs.readFileSync(await addExifToWebP(q,exif))},{quoted:m})
    }
    if (!stickermsg && audiomsg) {
                let inf = args !== '' ? args : config.AUDIO_DATA
                var spl = inf.split(';')
                var image = spl[2] ? await getBuffer(spl[2]): await getBuffer(spl[3])
                var res = await appendMp3Data(q,spl[0],spl[1]?spl[1]:config.AUDIO_DATA.split(";")[1], 'ASWIN SPARKY', image)
                await client.sendMessage(m.jid, {
                    audio: res,
                    mimetype: 'audio/mp4',
                }, {
                    quoted: m,
                    ptt: false
                });
    }
		return await m.react('✅');
	});


Sparky({
		name: "photo",
		fromMe: isPublic,
		category: "converters",
		desc: lang.PHOTO_DESC
	},
	async ({
		m
	}) => {
		if (!m.quoted || !m.quoted.message.stickerMessage || m.quoted.message.stickerMessage.isAnimated) {
			return await m.reply(lang.PHOTO_ALERT);
		}
		await m.react('⏫');
		await m.sendMsg(m.jid, await m.quoted.download(), {
			quoted: m
		}, "image");
		return await m.react('✅');
	});

	Sparky(
		{
			name: "tts",
			fromMe: isPublic,
			category: "converters",
			desc: "text to speech"
		},
		async ({
			m, client, args
		}) => {
			if (!args) {
				m.reply('_Enter Query!_')
			} else {
				let [txt,
					lang] = args.split`:`
				const audio = googleTTS.getAudioUrl(`${txt}`, {
					lang: lang || "ml",
					slow: false,
					host: "https://translate.google.com",
				})
				client.sendMessage(m.jid, {
					audio: {
						url: audio,
					},
					mimetype: 'audio/mpeg',
					ptt: true,
					fileName: `${'tts'}.mp3`,
				}, {
					quoted: m,
				})
	
			}
		});


Sparky(
		{
			name: "say",
			fromMe: isPublic,
			category: "converters",
			desc: "text to speech"
		},
		async ({
			m, client, args
		}) => {
			if (!args) {
				m.reply('_Enter Query!_')
			} else {
				let [txt,
					lang] = args.split`:`
				const audio = googleTTS.getAudioUrl(`${txt}`, {
					lang: lang || "en",
					slow: false,
					host: "https://translate.google.com",
				})
				client.sendMessage(m.jid, {
					audio: {
						url: audio,
					},
					mimetype: 'audio/mpeg',
					ptt: true,
					fileName: `${'tts'}.mp3`,
				}, {
					quoted: m,
				})
	
			}
		});
