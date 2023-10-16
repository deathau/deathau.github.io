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

  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_content/notes/*.md").reverse();
  });

  async function getAuthor(author) {
    if(!author) author = {
      "display_name": "death.au",
      "url": "https://death.id.au", // this is the domain your webfinger is on
      "avatar": "/assets/img/avatar-tt.svg" // avatar to use by default
    }

    if(!author.url) author.url = author.uri
    let authorURL = new URL(author.url)

    if(!author.display_name) author.display_name = author.name || author.preferredUsername || author.username
    if(!author.handle) author.handle = `@${author.display_name}@${authorURL.hostname}`
    if(!author.avatar) author.avatar = author.photo || author.image || author.img
    if(!author.canonical_uri) author.canonical_uri = author.url

    try {
      // options for the cached fetch request
      const options = {
        duration: "1d", // 1 day
        type: "json", // also supports "text" or "buffer"
        fetchOptions: {
          headers: {
              'Content-Type': 'application/activity+json'
          }
        }
      }

      // get the webfinger
      handle = author.handle.startsWith('@') ? author.handle.substring(1) : author.handle;
      let webfinger = await EleventyFetch(`${authorURL.origin}/.well-known/webfinger?resource=acct:${handle}`, options);

      // get the canonical uri as well
      let canonical_uri = webfinger?.links?.find(link => link.rel == "canonical_uri")
      if(canonical_uri) author.canonical_uri = canonical_uri.href

      // get the rel="self" link from the webfinger
      let self = webfinger?.links?.find(link => link.rel == "self");

      if(self) {
        // fetch the profile information  
        if(self.type) options.fetchOptions.headers['Content-Type'] = self.type;
        try{
          const json = await EleventyFetch(self.href, options);
          const isJson = typeof json === 'object' && !!json
          if(isJson){
            // apply the supplied author information to the result
            json.handle = author.handle
            json.avatar = author.avatar
            json.display_name = author.display_name || json.preferredUsername
            json.canonical_uri = author.canonical_uri || json.url[0]

            // this is now the author object
            author = json
          }
          else {
            // try parsing microformats
            const parsed = mf2(json, { baseUrl: new URL(self.href).origin })
            if(parsed?.items?.length && parsed.items[0].properties?.author?.length){
              // if we have an author object from here
              const parsedAuthor = Object.fromEntries(
                Object.entries(arsed.items[0].properties?.author[0])
                    // filter out empty entries
                    .filter(([key, value]) => (!Array.isArray(value) && !!value) || value.every(v => v))
                    // if entry is an array of length 1, collapse it to just key:value
                    .map(([key, value], index) => Array.isArray(value) && value.length == 1 ? [key, value[0]] : [key, value])
              )
              author = { ...element.author, ...parsedAuthor }
            }
          }
          
        }
        catch { }
        if(!author.canonical_uri) author.canonical_uri = self.href
      }
      else throw 'Could not find rel="self" link in webfinger'

      return author
    } 
    catch(e) {
      console.error("Failed to get webfinger info ", e);
      return author
    }
  }

  eleventyConfig.addCollection("feed", async function(collectionApi) {
    let feed = collectionApi.getAllSorted().reverse().filter(item => {
      let showInFeed = false;
      if(!item.data.published) return false
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

      return showInFeed;
    })

    return await Promise.all(feed.map(async item => {
      item.data.author = await getAuthor(item.data.author)
      return item;
    }))
  });

  eleventyConfig.addNunjucksAsyncFilter("getAuthorData", (author, callback) => {
    return getAuthor(author).then(author => callback(null, author)).catch(err => callback(err))
  })

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
