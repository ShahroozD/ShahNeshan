const path = require('path');

module.exports = [
  // CommonJS + UMD Build
  {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'markdownParser.cjs.js',
      library: 'markdownParser',
      libraryTarget: 'umd', // UMD for CommonJS, AMD, and browser
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    mode: 'production'
  },

  // ES Module Build
  {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'markdownParser.esm.js',
      library: {
        type: 'module'
      }
    },
    experiments: {
      outputModule: true // Enable ESM output
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    mode: 'production'
  }
];
