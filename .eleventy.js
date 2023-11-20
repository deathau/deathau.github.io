const pluginRss = require("@11ty/eleventy-plugin-rss");
const EleventyFetch = require("@11ty/eleventy-fetch");
const { mf2 } = require("microformats-parser");

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("formatDate", function(value) { 
    try{
      const date = new Date(value)
      if(date) return date.toISOString().replace('T', ' ').slice(0, -5)
      else throw 'Unrecognized data format'
    }
    catch(e) {
      console.error(`Could not convert "${value}"`, e)
      return value;
    }
  });

  eleventyConfig.addFilter("dateISOString", function(value) { 
    try{
      const date = new Date(value)
      if(date) return date.toISOString()
      else throw 'Unrecognized data format'
    }
    catch(e) {
      console.error(`Could not convert "${value}"`, e)
      return value;
    }
  });

  eleventyConfig.addFilter("concat", function(value, other) { 
    return value + '' + other
  });

  eleventyConfig.addNunjucksAsyncFilter("await", function(promise) { 
    return promise.then(res => callback(null, res)).catch(err => callback(err))
  });

  eleventyConfig.addNunjucksShortcode("getVar", function(varString) {
    return this.ctx[varString];
  });

  eleventyConfig.addShortcode('renderlayoutblock', function(name) {
    return (this.page.layoutblock || {})[name] || '';
  });

  eleventyConfig.addPairedShortcode('layoutblock', function(content, name) {
      if (!this.page.layoutblock) this.page.layoutblock = {};
      this.page.layoutblock[name] = content;
      return '';
  });

  eleventyConfig.addPassthroughCopy({"img":"assets/img"});
  eleventyConfig.addPassthroughCopy({"js":"assets/js"});
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy({"did.json":".well-known/did.json"});

  eleventyConfig.addPlugin(pluginRss);

  // Return your Object options:
  return {
    dir: {
      input: "_content",
      output: "pub"
    },
    htmlTemplateEngine: "njk",
    templateFormats: ["md","html","njk"]
  }
};
