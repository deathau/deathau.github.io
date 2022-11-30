module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("formatDate", function(value) { 
    try{
      const date = new Date(value)
      if(date) return date.toISOString().replace('T', ' ').slice(0, -5)
      else throw 'Unrecognized data format'
    }
    catch(e) {
      console.log(`Could not convert "${value}"`, e)
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
      console.log(`Could not convert "${value}"`, e)
      return value;
    }
  });

  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_content/notes/*.md").reverse();
  });

  eleventyConfig.addPassthroughCopy({"img":"assets/img"});
  eleventyConfig.addPassthroughCopy({"js":"assets/js"});
  eleventyConfig.addPassthroughCopy("css");

  // Return your Object options:
  return {
    dir: {
      input: "_content",
      output: "pub"
    },
    templateFormats: ["md","html"]
  }
};