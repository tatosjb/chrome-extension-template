const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    background: './src/scripts/background.js',
    popup: './src/scripts/popup.js',
    contentscript: './src/scripts/contentscript.js',
    options: './src/scripts/options.js'
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src',
          globOptions: {
            ignore: [ '*.js' ]
          }
        }
      ]
    })
  ]
}
