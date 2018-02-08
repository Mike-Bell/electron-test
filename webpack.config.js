/* eslint-env node*/
const path = require('path');
const appPath = path.resolve(__dirname, 'app');

module.exports = env => {
   const fullConfig = {
      entry: {
         bundle: './app/game.js'
      },
      module: {
         loaders: [
            {
               test: /\.jsx?/,
               include: appPath,
               loader: 'babel-loader',
               query: {
                  presets: ['es2015']
               }
            }
         ]
      },
      output: {
         path: __dirname,
         filename: '[name].js'
      }
   };

   return fullConfig;
};