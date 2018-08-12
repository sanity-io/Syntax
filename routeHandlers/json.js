/* eslint-disable camelcase */

const sanityClient = require('@sanity/client')
const blocksToHtml = require('@sanity/block-content-to-html')
const blocksToMarkdown = require('@sanity/block-content-to-markdown')
const client = sanityClient({
  projectId: 'zx5z31i3',
  dataset: 'production',
  useCdn: true
})
const query = require('./podcastQuery')
const serializers = {}
const rootUrl = 'https://syntax.fm'
function parsePodcast({
    title,
    subtitle,
    site_url: home_page_url,
    description,
    copyright,
    language,
    itunesOwner: {
        itunesName = '',
        itunesEmail = ''
    } = {},
    itunesImage: icon,
    itunesCategories: {
      primary = '',
      secondary = '',
      tertiary = ''
    } = {}
  }) {
    return {
        "version": "https://jsonfeed.org/version/1",
        ...(title && {title: subtitle ? `${title} ${subtitle}`: title}),
        ...(home_page_url && {home_page_url}),
        ...(home_page_url && {feed_url: `${home_page_url}/feed`}),
        ...(description && {description}),
        ...(icon && {icon}),
        ...(copyright && {copyright}),
        ...(language && {language}),
        categories: [
            primary ? primary : '',
            secondary ? secondary : '',
            tertiary ? tertiary : ''
        ].filter(notFalse => notFalse),
    }
}
function parseEpisode({
    guid,
    title,
    slug,
    description,
    pubDate,
    itunesImageHref,
    enclosureUrl,
    enclosureType,
    enclosureLength,
    enclosureSize,
    itunesEpisodeType,
    itunesExplicit,
    itunesDuration,
    itunesSummary,
  }) {
    return {
        ...(guid && {id: guid}),
        ...(title && {title}),
        ...(slug && {url: `${rootUrl}/${slug}`}),
        ...(description && {content_html: blocksToHtml({ blocks: description })}),
        ...(description && {content_text: blocksToMarkdown(description)}),
        ...(pubDate && {date_published: new Date(pubDate).toISOString()}),
        ...(itunesSummary && {summary: itunesSummary}),
        attachments: [
            enclosureUrl ? {
                url: enclosureUrl,
                duration_in_seconds: enclosureLength,
                mime_type: enclosureType,
                size_in_bytes: enclosureSize
            } : '',
        ].filter(notFalse => notFalse),
    }
}

function rssHandler (req, res) {
  return client
    .fetch(query)
    .then((data) => {
        const feed = parsePodcast(data)
        const { episodes = [] } = data
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify({...feed, items: episodes.map(parseEpisode) }))
    })
    .catch(() => res.sendStatus(500))
}

module.exports = rssHandler
