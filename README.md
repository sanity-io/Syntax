# Syntax Alt. Sanity.io Mod 🎙

This is an alternative version of the [syntax.fm](https://syntax.fm) frontend that uses [sanity.io](https://sanity.io) as a backend. You can find the Sanity Studio in [this repo](https://github.com/sanity-io/syntax-studio). And get the data in your own project by running [this migration CLI](https://github.com/sanity-io/podcast-to-sanity). The studio will work well with other podcasts too.

We added a [listener](https://www.sanity.io/docs/client-libraries/js-client#listening-to-queries) so that the page updates live when something new is published. If you configure the [@sanity/client](https://www.sanity.io/docs/client-libraries/js-client) with a token with read permissions you can preview changes live before publishing them.

⚠️ Note: We kept the original feed links on the page to keep anyone from picking the wrong one.

![Live updates from the Studio](https://raw.githubusercontent.com/sanity-io/Syntax/master/syntax-in-sanity.gif)

You can run this project locally. We have added [CORS settings](https://www.sanity.io/docs/cors) for localhost:3000 ([check out the episode on CORS](https://syntax.fm/show/063/hasty-treat-json-jsonp-and-cors)) .

## Express.js 🚀
If you run this site with the configured express-server (e.g. on [now](https://zeit.co/now) or [heroku](https://heroku.com)) it will also serve RSS and [JSON](https://jsonfeed.org/) podcast feeds on `/feed/rss` and `/feed/json`.

## Netlify ✨

This repo is also configured to run on Netlify and uses [Netlify Lambdas](https://www.netlify.com/docs/functions/) to produce the RSS and JSON feeds behind `/.netlify/functions/rss` and `/.netlify/functions/json`.

Visit site on Netlify: [syntax-in-sanity.netlify.com](https://syntax-in-sanity.netlify.com/)

# Original description

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

