console.log("postcss")
module.exports = {
  "plugins": [
    require('tailwindcss')('./tailwind.js'),
    require('autoprefixer')()
  ]
}