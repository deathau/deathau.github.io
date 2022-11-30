const SUBSCRIBE_LINK_REL = 'http://ostatus.org/schema/1.0/subscribe'
function follow(username, handle) {
  if(!handle){
    handle = prompt("Please enter your fediverse / mastodon handle (e.g. '@user@domain.social')", "@")
  }
  
  if(handle) {
    const input = handle
    handle = handle.trim().replace(/^@/,'')
    const split = handle.split('@')
    if(split.length == 2) {
      const resource = `acct:${handle}`
      const domain = split[1]
      
      // look up remote user via webfinger
      const url = `https://${domain}/.well-known/webfinger?resource=${resource}`
      fetch(url, {headers: {
        'Content-Type': 'application/activity+json'
      }}).then(async result => {
        const json = await result.json()
        const subscribe = json.links.find(link => link.rel && link.rel == SUBSCRIBE_LINK_REL)
        let template = subscribe.template
        window.open(template.replace("{uri}", username), '_blank').focus()
      })
      .catch(e => {
        console.error(e)
        throw `Sorry, we couldn't find a subscribe uri for ${input}.\n\nTry searching for "${username}" on ${domain} (or in your fediverse client of choice)`
      })
      
    }
    else {
      throw 'Please enter your fediverse address in @user@domain.social format'
    }
  }
}