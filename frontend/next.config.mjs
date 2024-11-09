/** @type {import('next').NextConfig} */
const nextConfig = {
	// async headers() {
    //     return [
    //         {
    //             // matching all API routes
    //             source: "/:path*",
    //             headers: [
    //                 { key: "Access-Control-Allow-Credentials", value: "true" },
    //                 { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
    //                 { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
    //                 { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
    //             ]
    //         }
    //     ]
    // },
	async rewrites() {
		return [
			{
				source: '/api/matches/:path*',
				destination: 'https://csdapi.azure-api.net/matches/:path*',
			},
			{
				source: '/api/matchmaking/:path*',
				destination: 'https://csdapi.azure-api.net/matchmaking/:path*',
			},
			{
				source: '/api/tournaments/:path*',
				destination: 'https://csdapi.azure-api.net/tournaments/:path*',
			},
			{
				source: '/api/users/:path*',
				destination: 'https://csdapi.azure-api.net/users/:path*',
			},
		];
	},
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
	eslint: {
		ignoreDuringBuilds: true,
	},
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
