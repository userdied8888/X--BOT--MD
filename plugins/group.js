const {delay} = require('baileys-duplicated');
const {Sparky, isPublic} = require('../lib');
const {getString} = require('./pluginsCore');
const lang = getString('group');


Sparky({
	name: 'tag',
	fromMe: isPublic,
	desc: lang.TAG_DESC,
	category: 'group',
}, async ({
	m,
	client,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!args) return await m.reply(lang.TAG_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	const groupMetadata = await client.groupMetadata(m.jid);
	const jids = groupMetadata.participants.map(p => p.id);
	const content = typeof args === 'string' ? {
		text: args ? args : m.quoted.text,
		mentions: jids
	} : args;
	const options = {
		contextInfo: {
			mentionedJid: jids
		}
	};
	return typeof args === 'string' ? await client.sendMessage(m.jid, content, {
		quoted: m
	}) : await m.forwardMessage(m.jid, content, options);
});


Sparky({
	name: "tagall",
	fromMe: isPublic,
	desc: lang.TAGALL_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
		const {
			participants
		} = await client.groupMetadata(m.jid).catch(() => ({
			participants: []
		}));
		if (!participants.length) return await m.reply(lang.ERROR_METADATA);
		const msg = participants.map((p, i) => `${i + 1}. @${p.id.split('@')[0]}`).join("\n");
		const jids = participants.map(p => p.id);
		return await m.sendMsg(m.jid, msg, {
			mentions: jids,
			quoted: m
		});
});


Sparky({
	name: "add",
	fromMe: isPublic,
	desc: lang.ADD_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!args) return await m.reply(lang.ADD_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
	await client.groupParticipantsUpdate(m.jid, [jid], 'add');
	return await m.sendMsg(m.jid, lang.ADDED.replace("{}", `@${jid.split("@")[0]}`), {
		mentions: [jid],
		quoted: m
	});
});


Sparky({
	name: "kick",
	fromMe: isPublic,
	desc: lang.KICK_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!args) return await m.reply(lang.KICK_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
	await client.groupParticipantsUpdate(m.jid, [jid], 'remove');
	return await m.sendMsg(m.jid, lang.KICKED.replace("{}", `@${jid.split("@")[0]}`), {
		mentions: [jid],
		quoted: m
	});
});


Sparky({
	name: "promote",
	fromMe: isPublic,
	desc: lang.PROMOTE_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!args) return await m.reply(lang.PROMOTE_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
	if(await m.isAdmin(jid)) return await m.reply(lang.ALREADY_PROMOTED);
	await client.groupParticipantsUpdate(m.jid, [jid], 'promote');
	return await m.sendMsg(m.jid, lang.PROMOTED.replace("{}", `@${jid.split("@")[0]}`), {
		mentions: [jid],
		quoted: m
	});
});


Sparky({
	name: "demote",
	fromMe: isPublic,
	desc: lang.DEMOTE_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!args) return await m.reply(lang.DEMOTE_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
	if(!await m.isAdmin(jid)) return await m.reply(lang.ALREADY_DEMOTED);
	await client.groupParticipantsUpdate(m.jid, [jid], 'demote');
	return await m.sendMsg(m.jid, lang.DEMOTED.replace("{}", `@${jid.split("@")[0]}`), {
		mentions: [jid],
		quoted: m
	});
});


Sparky({
	name: "mute",
	fromMe: isPublic,
	desc: lang.MUTE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'announcement');
	return await m.sendMsg(m.jid, lang.MUTED);
});


Sparky({
	name: "unmute",
	fromMe: isPublic,
	desc: lang.UNMUTE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'not_announcement');
	return await m.sendMsg(m.jid, lang.UNMUTED);
});


Sparky({
	name: "glock",
	fromMe: isPublic,
	desc: lang.GLOCK_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'locked');
	return await m.sendMsg(m.jid, lang.GLOCKED);
});


Sparky({
	name: "gunlock",
	fromMe: isPublic,
	desc: lang.GUNLOCK_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'unlocked');
	return await m.sendMsg(m.jid, lang.GUNLOCKED);
});


Sparky({
	name: "invite",
	fromMe: isPublic,
	desc: lang.INVITE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	return await m.reply(lang.INVITE.replace("{}", `https://chat.whatsapp.com/${await client.groupInviteCode(m.jid)}`));
});


Sparky({
	name: "revoke",
	fromMe: isPublic,
	desc: lang.REVOKE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupRevokeInvite(m.jid)
	return await m.reply(lang.REVOKED);
});


Sparky({
	name: "gname",
	fromMe: isPublic,
	desc: lang.GNAME_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if(!args) return await m.reply(lang.GNAME_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupUpdateSubject(m.jid, args)
	return await m.sendMsg(m.jid, lang.GNAME_SUCCESS.replace("{}", args));
});


Sparky({
	name: "gdesc",
	fromMe: isPublic,
	desc: lang.GDESC_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if(!args) return await m.reply(lang.GDESC_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupUpdateDescription(m.jid, args)
	return await m.sendMsg(m.jid, lang.GDESC_SUCCESS.replace("{}", args));
});


Sparky({
	name: "joinrequests",
	fromMe: isPublic,
	desc: lang.JOINREQUESTS_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	const allJoinRequests = await client.groupRequestParticipantsList(m.jid);
	if(allJoinRequests.length === 0) {
	return await m.reply(lang.JOINREQUESTS_NULL);
	}
	if(args) {
	switch(args.toLowerCase()) {
	case 'approve all': {
	await m.sendMsg(m.jid, lang.JOINREQUESTS_APPROVING.replace("{}", allJoinRequests.length));
	for(let i of allJoinRequests) {
	await client.groupRequestParticipantsUpdate(m.jid, [i.jid], "approve");
	await delay(900);
	}
	break;
	}
	case 'reject all': {
	await m.sendMsg(m.jid, lang.JOINREQUESTS_REJECTING.replace("{}", allJoinRequests.length));
	for(let i of allJoinRequests) {
	await client.groupRequestParticipantsUpdate(m.jid, [i.jid], "reject");
	await delay(900);
	}
	break;
	}
	default: {
	return await m.reply(lang.JOINREQUESTS_INVAILD_PARAMS);
	}
	}
	return;
	}
	const formattedList = allJoinRequests
    .map((item, index) => {
	    const requestVia = item.request_method === "linked_group_join" ? "community_" : item.request_method === "invite_link" ? "invite link_" : `added by @${item.requestor?.split("@")[0]}_`;
	    return `_${index + 1}. @${item.jid.split("@")[0]}_\n_• Request via: ${requestVia}\n_• Requested time: ${new Date(parseInt(item.request_time) * 1000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}_`})
    .join('\n\n');
	const jids = allJoinRequests.map(i => i.jid);
	return await m.sendMsg(m.jid,lang.JOINREQUESTS_FOUND.replace("{}", formattedList), { mentions: jids });
});


Sparky({
	name: "leave",
	fromMe: true,
	desc: lang.LEAVE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	await m.sendMsg(m.jid, lang.LEAVE_MSG);
	return await client.groupLeave(m.jid);
});


Sparky({
	name: "removegpp",
	fromMe: true,
	desc: lang.REMOVEGPP_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.removeProfilePicture(m.jid);
	return await m.sendMsg(m.jid, lang.REMOVEGPP_SUCCESS);
});


Sparky({
	name: "gpp",
	fromMe: true,
	desc: lang.GPP_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
    args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	if (!m.sudo && !await m.isAdmin(m.sender)) {
		return await m.reply(lang.NOT_GROUP_ADMIN);
	}
	if(!args) return await m.reply(lang.GPP_ALERT);
	if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	if(m.quoted && !m.quoted.message.imageMessage) return await m.reply(lang.GPP_NOTIMAGE);
	try {
	await client.updateProfilePicture(m.jid, m.quoted ? await m.quoted.download() : { url: args });
	return await m.sendMsg(m.jid, lang.GPP_SUCCESS);
	} catch {
	return await m.reply(lang.GPP_FAILED);
	}
});

const { Sparky, isPublic } = require("../lib");

Sparky(
    {
        name: "doc",
        fromMe: isPublic,
        desc: "Convert replied media to document",
        category: "group"
    },
    async ({ client, m, args }) => {
        try {
            // Use args or fallback
            args = args || m.quoted;

            // Ensure user replied to media
            if (!m.quoted || !m.quoted.downloadMediaMessage) {
                return await m.reply("❌ Reply to a media message first!");
            }

            await m.react("🗿"); // loading

            // Determine filename
            let fileName = args && typeof args === "string" ? args : "file";

            // Detect extension from type
            let ext = "bin";
            const type = m.quoted.type;
            if (type === "imageMessage") ext = "jpg";
            else if (type === "videoMessage") ext = "mp4";
            else if (type === "audioMessage") ext = "mp3";
            else if (type === "stickerMessage") ext = "webp";

            // Append extension if missing
            if (!fileName.includes(".")) fileName += `.${ext}`;

            // Sanitize filename
            fileName = fileName.replace(/[<>:"\/\\|?*]/g, "_");

            // Download media
            const media = await m.quoted.downloadMediaMessage();

            // Send as document
            await client.sendMessage(
                m.jid,
                { document: media, fileName, mimetype: m.quoted.mimetype || undefined },
                { quoted: m }
            );

            await m.react("✅"); // success
        } catch (e) {
            console.error(e);
            await m.reply("❌ Failed to convert media to document.");
            await m.react("❌");
        }
    }
);
