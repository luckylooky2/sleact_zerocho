import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration, web } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
// dotenv는 Webpack 라이브러리의 일종으로, .env 파일을 통해 process.env 환경변수를 로드하는 zero-dependency 모듈
// https://abangpa1ace.tistory.com/272
// https://webpack.kr/plugins/environment-plugin/
// 1. 설치 : npm i --save dotenv
// 2. import 및 기본 설정(path, encoding 등...)
import dotenv from 'dotenv';
// webpack 사용할 떄, 개발 or 배포 환경에서 각 파일의 용량을 볼 수 있음
// - webpack이 여러 개 파일을 하나의 .js 로 압축 => 용량 문제가 발생할 수 있음
// - 특히, build 하고 나서 용량을 확인하는 것이 중요!
// e.g. 개발 환경 : 1.5MB(app.js)은 속도에 지장이 있을 수 있음
// - 배포 환경 : 500 / 300KB 이하로 유지하는 것이 좋음
// - /dist + index.html을 웹 서버에 업로드!
// - CI/CD : git push => npm run build => 파일 업로드 후 서버 재시작(SSR 등 서버에서 특별히 작업을 해주지 않아도 되기 떄문에 간단)
// 해결
// - 1. code splitting : app.js에서 제외
// - 2. tree-shaking : 너무 큰 파일에서 작은 부분들을 털어내는 작업
// - e.g.
// - 특히, 이미지/폰트 파일은 webpack이 자동으로 최적화(용량 줄이기) 작업을 하지 않기 때문에 반드시 확인!
// - 경우에 따라 react 내부 파일(.html/.css/.js 커봐야 1MB)보다 오히려 이 부분(크면 100MB까지)에서 더 큰 절감을 할 수 있음
// - react-mentions tree-shaking으로 검색
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

dotenv.config({ path: `./.env` });

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env development
// - webpack 명령어를 실행할 때, process.env를 설정할 수 있음!
// - 명령어가 길어지는 것에 대비하여 스크립트 실행 관리 라이브러리 => better-npm-run, npm-run-all(명령어 동시 실행)
// - dotenv를 이용하여 바꿀 수 있나? 한 번 해보자
const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'sleact',
  // 배포 환경(npm run build) 일때는, 'production'이 되어야 함
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['IE 10'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
            production: {
              plugins: ['@emotion'],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    // 3. DefinePlugin or EnvironmentPlugin으로 적용
    // - .env 파일의 변수들이 추가됐지만 이를 React 환경에서 사용할 수 없음
    // - node runtime에만 사용가능한 이 변수들을, JS context에서 사용하기 위해 빌드 타임에 선언을 해주는 단계가 필요
    // - DefinePlugin or EnvironmentPlugin에서 설정한 아래 문자열 값을 전역 변수 형태로 선언하여 사용
    // - cf> 이는, Webpack의 빌드타임에서만 활용되며, 브라우저 런타임에서는 사용할 수 없다!
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? 'development' : 'production',
      REACT_APP_API_URL: false,
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, // react router
    port: 3090,
    devMiddleware: { publicPath: '/dist/' },
    static: { directory: path.resolve(__dirname) },
  },
};

// 개발 환경에서는
// const isDevelopment = process.env.NODE_ENV !== 'production'; true 였기 때문에
// 아래 코드만 실행되었음!
if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  // 서버를 따로 띄움 => localhost:8888
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
if (!isDevelopment && config.plugins) {
  // 서버를 따로 띄울 수 없기 때문에 .html 로 결과물을 출력
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
  // 이 플러그인으로 최적화되는 옛날 플러그인들이 있기 때문에
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
}

export default config;
