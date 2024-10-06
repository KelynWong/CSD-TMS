/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		disableStaticImages: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.clerk.dev",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "www.gravatar.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
				pathname: "**",
			},
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.(png|jpe?g|gif|svg)$/i,
			type: "asset/resource",
		});
		return config;
	},
};

export default nextConfig;
