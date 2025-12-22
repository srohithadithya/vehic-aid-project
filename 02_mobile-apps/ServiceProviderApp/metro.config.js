const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // CRITICAL FIX: Add the assets to the resolver block
  resolver: {
    // This tells Metro to look for assets here when bundling the JS code
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'otf'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs'],
  },
  
  // Define the folders where assets are located
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },

  // This is the location where your images and fonts live
  // You might need to merge this path array with existing ones if your template is complex
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'otf', 'json'], // Added .json for Lottie
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    assetPlugins: ['expo-asset/tools/uri-is-local-test'], // Standard plugin for asset resolution
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);