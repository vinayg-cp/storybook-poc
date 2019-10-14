// module.exports = ({ config, mode }) => {
//     // Transpile Gatsby module because Gastby includes un-transpiled ES6 code.
//     config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
//     // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
//     config.module.rules[0].use[0].loader = require.resolve('babel-loader')
  
//     // The next two lines should always reflect the config in jest-preprocess.js until there is a way for Gatsby to expose an internal webpack.config
//     // use @babel/preset-react for JSX and env (instead of staged presets)
//     config.module.rules[0].use[0].options.presets = [
//       require.resolve('@babel/preset-react'),
//       require.resolve('@babel/preset-env'),
//     ]
//     // use @babel/plugin-proposal-class-properties for class arrow functions
//     config.module.rules[0].use[0].options.plugins = [
//       require.resolve('@babel/plugin-proposal-class-properties'),
//     ]
  
//     // https://github.com/gatsbyjs/gatsby/issues/10662:
//     // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
//     config.resolve.mainFields = ["browser", "module", "main"]
  
//     return config
// }

/* eslint-disable no-param-reassign */

const path = require('path')
const webpack = require('webpack')
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
	const isProduction = mode

	// Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
	config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

	// use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
	config.module.rules[0].use[0].loader = require.resolve('babel-loader')

	// use @babel/preset-react for JSX and env (instead of staged presets)
	config.module.rules[0].use[0].options.presets = [
		require.resolve('@babel/preset-react'),
		require.resolve('@babel/preset-env')
	]

	// use @babel/plugin-proposal-class-properties for class arrow functions
	config.module.rules[0].use[0].options.plugins = [
		require.resolve('@babel/plugin-proposal-class-properties'),
		require.resolve('babel-plugin-remove-graphql-queries')
	]

	config.module.rules = config.module.rules.filter(
		f => f.test.toString() !== '/\\.css$/'
	)

	config.module.rules.push(
		{
			test: /\.(ttf|woff|woff2|eot|svg)$/,
			use: 'file-loader?name=[name].[ext]',
			exclude: /\.inline.svg$/
		},
		{
			test: /\.(jpg|png|jpeg|jpg)$/,
			loader: 'file-loader',
			include: path.resolve(__dirname, '../static/')
		},
		{
			test: /\.css$/,
			exclude: /\.module\.css$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						importLoaders: 1,
						localIdentName: 'mod-[hash:base64:8]'
					}
				},
				'postcss-loader'
			],
			include: path.resolve(__dirname, '../')
		},
		{
			test: /\.story\.mdx$/,
			exclude: [/node_modules/],
			include: [
				path.resolve(__dirname, '../src'),
			],
			use: [
			  {
				loader: 'babel-loader',
				options: {
				  plugins: ['@babel/plugin-transform-react-jsx']
				}
			  },
			  {
				loader: '@mdx-js/loader',
				options: {
				  compilers: [createCompiler({})]
				}
			  }
			],
		  },
		{
			test: /\.module\.css$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						importLoaders: 1,
						modules: true,
						localIdentName: '[local]-[hash:base64:5]'
					}
				},
				'postcss-loader'
			],
			include: path.resolve(__dirname, '../src')
		}
	)

	config.plugins.push(
		new webpack.DefinePlugin({
			STORYBOOK: JSON.stringify(true),
			PRODUCTION: JSON.stringify(isProduction)
		})
	)

	config.resolve.alias['@'] = path.resolve(__dirname, '../src/')

	config.resolve.mainFields = ['browser', 'module', 'main']

	return config
}