const express = require('express')
const basicAuth = require('express-basic-auth')
const app = express()

app.set('view engine', 'ejs')	
app.use('/static', express.static('public'))

app.use(basicAuth({
  users: {'admin': 'admin'},
  challenge: true,
  realm : 'Imb4T3st4pp'
}))
app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(3000, () => {
  console.log('listening');
})

