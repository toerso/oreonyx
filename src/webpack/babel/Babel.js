class Babel {
    react() {
        return {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }
        };
    }

    typescript() {
        return {
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                },
                'ts-loader' // Handles type checking and emits JS
            ]
        }
    }
}

module.exports = Babel;