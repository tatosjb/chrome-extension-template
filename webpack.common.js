import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default {
  mode: 'production',
  entry: {
    background: './src/scripts/background.js',
    popup: './src/scripts/popup.js',
    contentscript: './src/scripts/contentscript.js',
    options: './src/scripts/options.js'
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(path.resolve(), 'build')
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src',
          globOptions: {
            ignore: ['*.js']
          }
        }
      ]
    })
  ]
}
