const Jimp = require("jimp");

async function generateProfilePicture(buffer) {
	const jimp = await Jimp.read(buffer);

	const min = Math.min(jimp.getWidth(), jimp.getHeight());
	const x = (jimp.getWidth() - min) / 2;
	const y = (jimp.getHeight() - min) / 2;

	const cropped = jimp.crop(x, y, min, min);

	const fullImage = cropped
		.clone()
		.resize(720, 720, Jimp.RESIZE_BEZIER)
		.quality(100);

	const previewImage = cropped
		.clone()
		.resize(96, 96, Jimp.RESIZE_BEZIER)
		.quality(100);

	return {
		img: await fullImage.getBufferAsync(Jimp.MIME_JPEG),
		preview: await previewImage.getBufferAsync(Jimp.MIME_JPEG)
	};
}

async function updatefullpp(jid, imag, client) {
	const { query } = client;
	const { img } = await generateProfilePicture(imag);

	await query({
		tag: "iq",
		attrs: {
			to: "@s.whatsapp.net",
			type: "set",
			xmlns: "w:profile:picture"
		},
		content: [{
			tag: "picture",
			attrs: {
				type: "image"
			},
			content: img
		}]
	});
}

module.exports = { updatefullpp };
