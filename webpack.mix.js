let mix = require('laravel-mix');
var tailwindcss = require('tailwindcss');
var autoprefixer = require('autoprefixer');
let glob = require("glob-all");
let PurgecssPlugin = require("purgecss-webpack-plugin");

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 * https://github.com/FullHuman/purgecss-webpack-plugin
 */
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g);
  }
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.less('assets/less/app.less', 'public/css')
   .options({
     postCss: [
       tailwindcss('./tailwind.js'),
       autoprefixer(),
     ]
});

if (mix.inProduction()) {
    mix.webpackConfig({
        plugins: [
          new PurgecssPlugin({
            paths: glob.sync([path.join(__dirname, "public/*.html")]),
            extractors: [
              {
                extractor: TailwindExtractor,
                extensions: ["html", "js"]
              }
            ]
          })
        ]
    });
}