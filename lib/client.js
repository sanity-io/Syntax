const sanityClient =  require('@sanity/client')

module.exports = sanityClient({
    projectId: 'zx5z31i3',
    dataset: 'production',
    withCredentials: true,
    useCdn: false, // normally we would set this as true, but we want quick updates
    //token: '' // set a token with read permissions if you want to preview drafts
  })
