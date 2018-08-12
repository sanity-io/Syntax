/* eslint-disable camelcase */
const RSS = require('rss')
const sanityClient = require('@sanity/client')
const blocksToHtml = require('@sanity/block-content-to-html')
const client = sanityClient({
  projectId: 'zx5z31i3',
  dataset: 'production',
  useCdn: true
})
const query = require('../routeHandlers/podcastQuery')
const serializers = {}

function parsePodcast({
    _id,
    title,
    subtitle,
    site_url,
    description,
    copyright,
    language,
    itunesSubtitle,
    itunesAuthor,
    itunesSummary,
    itunesOwner: {
        itunesName = '',
        itunesEmail = ''
    } = {},
    itunesImage,
    itunesCategories: {
      primary = '',
      secondary = '',
      tertiary = ''
    } = {}
  }) {
    return {
        ...(_id && {guid: _id}),
        ...(title && {title: subtitle ? `${title} ${subtitle}`: title}),
        ...(site_url && {site_url}),
        ...(description && {description}),
        ...(itunesImage && {image_url: itunesImage}),
        ...(copyright && {copyright}),
        ...(language && {language}),
         categories: [primary, secondary && secondary, tertiary && tertiary],
        custom_namespaces: {
          itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd'
        },
        custom_elements: [
            itunesSubtitle ? { 'itunes:subtitle': itunesSubtitle } : '',
            itunesAuthor ? { 'itunes:author': itunesAuthor } : '',
            itunesSummary ? { 'itunes:summary': itunesSummary } : '',
            (itunesName && itunesEmail) ? {
                'itunes:owner': [
                  { 'itunes:name': itunesName },
                  { 'itunes:email': itunesEmail }
                ]
              } : '',
            itunesImage ? {
            'itunes:image': {
                _attr: {
                href: itunesImage
                }
            }
            } : '',
            primary ? {
                'itunes:category': [
                    {
                    _attr: {
                      text: primary
                    }
            }] } : '',
            secondary ? {
                'itunes:category': [
                  {
                    _attr: {
                      text: secondary
                    }
                  }
                ]
              }
              : '',
            tertiary
              ? {
                'itunes:category': [
                  {
                    _attr: {
                      text: tertiary
                    }
                  }
                ]
              }
              : ''
        ].filter(notFalse => notFalse)
    }
}
function parseEpisode({
    guid,
    title,
    description,
    pubDate,
    itunesImageHref,
    enclosureUrl,
    enclosureType,
    enclosureLength,
    itunesEpisodeType,
    itunesExplicit,
    itunesDuration,
    itunesSummary
  }) {
    return {
        ...(title && {title}),
        ...(guid && {guid}),
        ...(description && {description: blocksToHtml({ blocks: description })}),
        ...(pubDate && {pubDate: new Date(pubDate).toUTCString()}),
        custom_elements: [
            enclosureUrl ? {
                enclosure: [
                {
                    _attr: {
                    url: enclosureUrl,
                    length: enclosureLength,
                    type: enclosureType
                    }
                }
                ]
            } : '',
            itunesSummary ? { 'itunes:summary': itunesSummary } : '',
            itunesEpisodeType ? { 'itunes:episodeType': itunesEpisodeType } : '',
            itunesDuration ? { 'itunes:duration': itunesDuration } : '',
            {'itunes:explicit': itunesExplicit ? 'yes' : 'no' },
            itunesImageHref ?  {
                'itunes:image': [
                    {
                        _attr: {
                        href: itunesImageHref
                        }
                    }
                ]
            } : ''
        ].filter(notFalse => notFalse)
    }
}

function rssHandler (event, context, callback) {
  return client
    .fetch(query)
    .then((data) => {
        const feed = new RSS(parsePodcast(data))
        const { episodes = [] } = data
        episodes.forEach(episode => feed.item(parseEpisode(episode)))
        callback(null,
            {
                statusCode: 200,
                body: feed.xml(),
                headers: {
                    "Content-type": "text/xml"
                }
            })
    })
    .catch(() => callback(null, { statusCode: 500 }))
}


exports.handler = rssHandler