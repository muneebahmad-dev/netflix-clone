const withTM = require('next-transpile-modules')([
  '@stripe/firestore-stripe-payments',
])

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: [
      'image.tmdb.org',
      'netflix-clone-muneeb.s3.ap-southeast-1.amazonaws.com',
    ],
  },
})
