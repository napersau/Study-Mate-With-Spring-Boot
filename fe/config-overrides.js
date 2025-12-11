module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": false,
    "https": false,
    "zlib": false,
    "stream": false,
    "util": false,
    "url": false,
    "assert": false,
    "http2": false,
    "crypto": false,
  };
  return config;
};
