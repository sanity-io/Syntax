# Syntax Alt. Sanity.io Mod

This is an alternative version of the [syntax.fm](https://syntax.fm) frontend that uses [sanity.io](https://sanity.io) as a backend. You can find the Sanity Studio in [this repo](https://github.com/sanity-io/syntax-studio). And get the data in your own project by running [this migration CLI](https://github.com/sanity-io/podcast-to-sanity). The studio will work well with other podcasts too.

![Live updates from the Studio](https://raw.githubusercontent.com/sanity-io/Syntax/master/syntax-in-sanity.gif)

You can probably run this project locally. We have added CORS settings for localhost:3000.

## Original description

A tasty treats podcast for Web Developers.

This is the site that runs [Syntax.fm](https://syntax.fm) — go there to listen to it!

This site is built on React and Next.js

## Requirements
- Node 8.1.2 or higher

## Development

First you `npm install`

Then you `npm run dev` and visit `http://localhost:6969`.

Then you do some work.

When you are ready for prime time, you can just submit a PR to this repo and it will be deployed once it's accepted.

If you want to build your own version, just run `npm run build` and then I'd recommend deploying with `now`.

