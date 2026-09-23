const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index.tsx',
    mode: isDev ? 'development' : 'production',
    devServer: {
      port: 5007,
      host: 'localhost',
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      modules: ['node_modules', path.resolve(__dirname, '../shared/src')],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@template/shared': path.resolve(__dirname, '../shared/src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
              transpileOnly: true,
            },
          },
          exclude: /node_modules[\\\/](?!@template)/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'initialDataEntryMFE',
        filename: 'remoteEntry.js',
        exposes: {
          './Module': './src/Module.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.3.1',
            strictVersion: false,
            eager: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.3.1',
            strictVersion: false,
            eager: false,
          },
          'react/jsx-runtime': {
            singleton: true,
            requiredVersion: '^18.3.1',
            strictVersion: false,
            eager: false,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: false,
            strictVersion: false,
            eager: false,
          },
          '@tanstack/react-query': {
            singleton: true,
            requiredVersion: false,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
    ],
  };
};
