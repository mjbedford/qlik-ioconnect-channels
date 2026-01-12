const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'qlik-ioconnect-channels.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'amd'
    }
  },
  externals: {
    'jquery': 'jquery',
    'qlik': 'qlik',
    'angular': 'angular',
    'underscore': 'underscore'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css']
  },
  optimization: {
    minimize: true
  }
};
