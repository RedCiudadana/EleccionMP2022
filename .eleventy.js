const htmlmin = require('html-minifier');
const dateFns = require('date-fns');
const { es } = require('date-fns/locale');
const { esLocale } = require('date-fns/locale/es');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(lazyImagesPlugin, {
    transformImgPath: (imgPath) => {
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        // Handle remote file
        return imgPath;
      } else {
        return `./public/${imgPath}`;
      }
    },
  });

  eleventyConfig.setEjsOptions({
    rmWhitespace: true,
    context: {
      dateFns,
      esLocale,
      es,
    },
  });

  eleventyConfig.setBrowserSyncConfig({
    files: './_site/assets/styles/main.css',
  });

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addCollection('postsHighlighted', (collectionApi) => {
    return collectionApi.getFilteredByTag('posts').filter((item) => {
      return item.data.highlight == true;
    });
  });

  eleventyConfig.addCollection('podcastsHighlighted', (collectionApi) => {
    return collectionApi.getFilteredByTag('Podcast').filter((item) => {
      return item.data.highlight == true;
    });
  });

  return {
    dir: { input: 'src', output: '_site', data: '_data' },
  };
};
