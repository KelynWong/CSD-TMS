export {};

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			onboardingComplete?: boolean;
			Gender: string;
			Country: string;
		};
	}
}
