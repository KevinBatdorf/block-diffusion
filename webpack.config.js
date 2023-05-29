const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    plugins: [...defaultConfig.plugins],
    entry: {
        index: './src/index.tsx',
        global: './src/global.tsx',
    },
};
