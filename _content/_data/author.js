const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  // set these default options
  let author = {
    "handle": "@death.au@death.id.au",
    "display_name": "death.au",
    "url": "https://death.id.au", // this is the domain your webfinger is on
    "avatar": "/assets/img/avatar-tt.svg" // avatar to use by default
  }

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
    let webfinger = await EleventyFetch(`${author.url}/.well-known/webfinger?resource=acct:${handle}`, options);

    // get the canonical uri as well
    let canonical_uri = webfinger?.links?.find(link => link.rel == "canonical_uri")
    if(canonical_uri) author.canonical_uri = canonical_uri.href

    // get the rel="self" link from the webfinger
    let self = webfinger?.links?.find(link => link.rel == "self");

    if(self) {
      // fetch the profile information  
      if(self.type) options.fetchOptions.headers['Content-Type'] = self.type;
      json = await EleventyFetch(self.href, options);

      // apply the supplied author information to the result
      json.handle = author.handle
      json.avatar = author.avatar
      json.display_name = author.display_name || json.preferredUsername
      json.canonical_uri = author.canonical_uri || json.url[0]

      // this is now the author object
      author = json
    }
    else throw 'Could not find rel="self" link in webfinger'

    return author
  } 
  catch(e) {
    console.error("Failed to get webfinger info ", e);
    return author
  }
};