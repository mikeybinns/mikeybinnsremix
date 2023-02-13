module.exports = {
	map: {
		inline: false,
	},
	plugins: [
		require("postcss-preset-env")({
			stage: 2,
			features: {
				"nesting-rules": true,
				"custom-media-queries": true,
			},
		}),
	],
};
