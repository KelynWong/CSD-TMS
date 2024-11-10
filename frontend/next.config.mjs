/** @type {import('next').NextConfig} */
const nextConfig = {
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: '/api/matches',
	// 			destination: `${process.env.NEXT_PUBLIC_MATCH_API_URL}`,
	// 		},
	// 		{
	// 			source: '/api/matches/:path*',
	// 			destination: `${process.env.NEXT_PUBLIC_MATCH_API_URL}/:path*`,
	// 		},
	// 		{
	// 			source: '/api/matchmaking',
	// 			destination: `${process.env.NEXT_PUBLIC_MATCHMAKING_API_URL}`,
	// 		},
	// 		{
	// 			source: '/api/matchmaking/:path*',
	// 			destination: `${process.env.NEXT_PUBLIC_MATCHMAKING_API_URL}/:path*`,
	// 		},
	// 		{
	// 			source: '/api/tournaments',
	// 			destination: `${process.env.NEXT_PUBLIC_TOURNAMENT_API_URL}`,
	// 		},
	// 		{
	// 			source: '/api/tournaments/:path*',
	// 			destination: `${process.env.NEXT_PUBLIC_TOURNAMENT_API_URL}/:path*`,
	// 		},
	// 		{
	// 			source: '/api/users',
	// 			destination: `${process.env.NEXT_PUBLIC_USER_API_URL}`,
	// 		},
	// 		{
	// 			source: '/api/users/:path*',
	// 			destination: `${process.env.NEXT_PUBLIC_USER_API_URL}/:path*`,
	// 		},
	// 	];
	// },
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
