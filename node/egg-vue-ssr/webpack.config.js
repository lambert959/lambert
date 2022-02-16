module.exports = {
  plugins: [
    { imagemini: false },
    {
      copy: [{
        from: 'app/web/asset/js/jsencrypt.min.js',
        to: 'asset/js/jsencrypt.min.js'
      }]
    }
  ]
}
