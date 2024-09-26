/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		disableStaticImages: true,
		domains: ["images.clerk.dev", "www.gravatar.com", "img.clerk.com"],
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
