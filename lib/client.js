import sanityClient from '@sanity/client'

export default sanityClient({
    projectId: 'zx5z31i3',
    dataset: 'production',
    useCdn: false, // normally we would set this as true, but we want quick updates
    //token: '' // set a token with read permissions if you want to preview drafts
  })
