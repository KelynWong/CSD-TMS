package com.tms.matchmaking;

import org.springframework.stereotype.Component;

@Component
public class PairingStrategyFactory {
    private PairingStrategyFactory() {}
    public static PairingStrategy getPairingStrategy(String strategyName) {
        return switch (strategyName.toLowerCase()) {
            case "strongweak" -> new StrongWeakPairing();
            case "strongstrong" -> new StrongStrongPairing();
            default -> throw new IllegalArgumentException("Unknown pairing strategy: " + strategyName);
        };
    }
}