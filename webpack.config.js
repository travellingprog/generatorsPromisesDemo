var path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: __dirname + '/build/',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				loader: 'babel'
			},
			{
				test: /\.hbs$/,
				include: path.resolve(__dirname, 'src'),
				loader: 'handlebars-loader'
			}
		]
	}
};