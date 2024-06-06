const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/geodemo',
    createProxyMiddleware({
      target: 'https://kvrewjpbq9.execute-api.us-east-1.amazonaws.com',
      changeOrigin: true,
    })
  );
};

