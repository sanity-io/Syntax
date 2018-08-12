module.exports = `*[_type == "podcast" && slug.current == "syntax"][0]{
    title,
    subtitle,
    "site_url": itunes.url,
    "feed_url": "https://syntax.fm/feed",
    language,
    copyright,
    language,
    "itunesSubtitle": subtitle,
    "itunesAuthor": itunes.author,
    "itunesSummary": itunes.summary,
    description,
    "itunesOwner": {
      "itunesName": itunes.owner.name,
      "itunesEmail": itunes.owner.email
    },
    "itunesType": itunes.type,
    "itunesImage": coverArt.asset->url,
    "slug": slug.current,
    "itunesCategories": {
      "primary": itunes.categories.firstCategory,
      "secondary": itunes.categories.secondaryCategory,
      "tertiary": itunes.categories.tertiaryCategory
    },
    "episodes": *[references(^._id) && _type == "episode"]{
      title,
      description,
      "slug": slug.current,
      "guid": _id,
      "pubDate": schedule.publish,
      "enclosureUrl": file.asset->url,
      "enclosureLength": file.asset->size,
      "enclosureType": file.asset->mimeType,
      "enclosureSize": file.asset->size,
      "itunesEpisodeType": itunes.type,
      "itunesDuration": duration,
      "itunesExplicit": explicit,
      "itunesImageHref": coverArt.asset->url,
      "itunesSummary": summary
    }
}`