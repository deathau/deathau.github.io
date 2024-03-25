const EleventyFetch = require("@11ty/eleventy-fetch")
module.exports = async function() {
  let url = "https://monrepos.casa/api/v1/accounts/3/statuses?limit=20"

  // needs basic auth, but for public posts, that doesn't need to actually be valid details?
  const username = ''
  const password = ''

  const headers = { 'Authorization', 'Basic ' + Buffer.from(username + ':' + password, 'utf-8').toString('base64')) }

  let response = await EleventyFetch(url, {
    fetchOptions: {
      method: 'GET',
      headers: headers
    },
    duration: "1d", // save for 1 day
    type: "json"    // we’ll parse JSON for you
  })

  const data = response

  while(response.length > 0) {
    let lastId = data[data.length - 1].id
    response = await EleventyFetch(url + '&max_id=' + lastId, {
      fetchOptions: {
        method: 'GET',
        headers: headers
      },
      duration: "1d", // save for 1 day
      type: "json"    // we’ll parse JSON for you
    })
    data.push(...response)
  }

  return data.filter(post => post.visibility === 'public').map(post => {
    post.myid = new Date(post.created_at).getTime().toString(36)
    return post
  });
}