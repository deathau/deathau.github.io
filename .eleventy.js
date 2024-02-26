const pluginRss = require("@11ty/eleventy-plugin-rss")
const EleventyFetch = require("@11ty/eleventy-fetch")
const { EleventyRenderPlugin } = require("@11ty/eleventy")
const markdownIt = require('markdown-it')
const yaml = require("js-yaml")

const markdownItOptions = {
  html: true,
  breaks: false,
  linkify: true
}

module.exports = function(eleventyConfig) {

  // Filter source file names using a glob
  eleventyConfig.addCollection("portfolio", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_content/portfolio/**").filter(function(item) {
      return !item.data.draft
    })
  });

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
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  const markdownLib = markdownIt(markdownItOptions)
    .use(require('markdown-it-bracketed-spans'))
    .use(require('markdown-it-attrs'))
  eleventyConfig.setLibrary('md', markdownLib)

  eleventyConfig.addDataExtension("yaml", (contents, file) => {
    const json = yaml.load(contents)
    Object.keys(json).forEach(x => json[x] = markdownLib.render(json[x]))

    const fs = require("fs")
    json.modified = fs.statSync(file).mtime
    return json
  });

  eleventyConfig.addDataExtension("md", (contents, file) => {
    const md = contents
    const fs = require("fs")
    
    return {
      modified: fs.statSync(file).mtime,
      content: markdownLib.render(md),
      inputPath: file,
      templateSyntax: "md"
    }
  });

  // Return your Object options:
  return {
    dir: {
      input: "_content",
      output: "pub"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["md","html","njk"]
  }
};
