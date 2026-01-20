try {
    const { getDefaultConfig } = require("expo/metro-config");
    console.log("Loaded expo/metro-config");
    const { withNativeWind } = require("nativewind/metro");
    console.log("Loaded nativewind/metro");
    const config = getDefaultConfig(__dirname);
    console.log("Loaded default config");
    const finalConfig = withNativeWind(config, { input: "./global.css" });
    console.log("Successfully created config");
} catch (e) {
    console.error("Error details:", e.message);
    console.error("Stack:", e.stack);
}
