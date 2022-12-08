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

  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_content/notes/*.md").reverse();
  });

  eleventyConfig.addCollection("feed", function(collectionApi) {
    return collectionApi.getAllSorted().reverse().filter(item => {
      let showInFeed = false;
      //if(!item.data.published) return false
      if(item.filePathStem.startsWith('/notes/')){
        if(item.data['like-of']) item.data.postType = "like"
        else if(item.data['in-reply-to']) item.data.postType = "reply"
        else if(item.data['repost-of']) item.data.postType = "boost"
        else if(item.data['read-of']) item.data.postType = "read"
        else if(item.data['watch-of']) item.data.postType = "watch"
        else item.data.postType = "note";
        showInFeed = true;
      }
      else if(item.filePathStem.startsWith('/articles/')){
        item.data.postType = "article";
        showInFeed = true;
      }
      else if (item.filePathStem.startsWith('/bookmarks/')){
        item.data.postType = "bookmark";
        showInFeed = true;
      }
      else if (item.filePathStem.startsWith('/likes/')){
        item.data.postType = "like";
        showInFeed = true;
      }
      else if (item.filePathStem.startsWith('/rsvp/')){
        item.data.postType = "rsvp";
        showInFeed = true;
      }
      else if (item.filePathStem.startsWith('/watched/')){
        item.data.postType = "watched";
        showInFeed = true;
      }

      // if(showInFeed) {
      //   item.data.author = 
      // }

      return showInFeed;
    });
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

  // Return your Object options:
  return {
    dir: {
      input: "_content",
      output: "pub"
    },
    htmlTemplateEngine: "njk",
    templateFormats: ["md","html"]
  }
};