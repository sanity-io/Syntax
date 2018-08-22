const path = require('path');
const glob = require('glob');
const client = require('./lib/client')
const slug = require('speakingurl')
const query = `{
  "shows": *[_type == "episode" && (defined(file) || defined(fileUrl))]{
    ...,
    "url": coalesce(fileUrl, file.asset->url)
    }|order(schedule.publish desc),
  "podcast": *[_type == "podcast" && slug.current == $slug][0]{
    ...,
    "hosts": hosts[]->
  }|order(_publishedAt asc)
}`

const params = { slug: "syntax"}

async function getData() {
  const { shows = [], podcast } = await client.fetch(query, params)
  const showsNumber = shows.reduce((acc, curr, index) => ({
    ...acc,
    [`/show/0${shows.length - index}/${slug(curr.title)}`]: { page: '/', query: { build: true }}}), {})
  return { shows: showsNumber }
}

module.exports = {
  exportPathMap: async function (defaultPathMap) {
    const {shows} = await getData()
    return {
      ...shows,
      '/': { page: '/', query: { build: true } },
      '/sponsor': { page: 'sponsor', query: { build: true } }
    }
  },
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|styl)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      }
    ,
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader']
      }
    ,
      {
        test: /\.styl$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader',
          { loader: 'stylus-loader',
            options: {
              includePaths: ['styles', 'node_modules']
                .map((d) => path.join(__dirname, d))
                .map((g) => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    )
    return config
  }
}
