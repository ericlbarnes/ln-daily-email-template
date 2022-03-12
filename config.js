/*
|-------------------------------------------------------------------------------
| Development config               https://maizzle.com/docs/environments/#local
|-------------------------------------------------------------------------------
|
| The exported object contains the default Maizzle settings for development.
| This is used when you run `maizzle build` or `maizzle serve` and it has
| the fastest build time, since most transformations are disabled.
|
*/

const Parser = require('rss-parser')

module.exports = {
  feed: {
    url: 'https://feed.laravel-news.com'
  },
  build: {
    templates: {
      source: 'src/templates',
      destination: {
        path: 'build_local',
      },
      assets: {
        source: 'src/images',
        destination: 'images',
      },
    },
  },
  events: {
    async beforeCreate(config) {
      // create a new Parser instance
      const parser = new Parser({
        customFields: {
          feed: ['subtitle'],
          item: ['summary'],
        }
      })

      // fetch and parse the feed
      const feed = await parser.parseURL(config.feed.url)

      // store the feed data in our config
      config.feed = {
        ...config.feed,
        title: feed.title,
        description: feed.description,
        feedUrl: feed.feedUrl,
        posts: feed.items,
        image: {
          url: feed.image.url,
          title: feed.image.title,
        },
      }
    },
  },
  getFirstImageURL(string) {
    const regex = /<img\s+src="([^"]*)"[^>]*>/
    const found = string.match(regex)

    if (found) {
      return found[1]
    }

    return false
  },
}
