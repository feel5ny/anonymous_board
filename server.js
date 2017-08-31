const express = require('express')
const uuidv4 = require('uuid/v4')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const newPosts = [
  {
    id: uuidv4(),
    title: 'sample post'
  }
]

app.set('view engine', 'ejs')	
app.use('/static', express.static('public'))

// 관리자 설정
app.use(basicAuth({
  users: {'admin': 'admin'},
  challenge: true,
  realm : 'Imb4T3st4pp'
}))

// 익명게시판 목록 페이지
app.get('/', (req, res) => {
  res.render('index.ejs', {newPosts})
})

// 새글 추가 endpoint
app.post('/new', urlencodedParser, (req, res) => {
  const title = req.body.title
  // validation
  if (title) {
    const newpost = {
      id: uuidv4(),
      title
    }
    todos.push(newpost)
    // res.render('index.ejs', {todos}) // 이렇게 하면 안 됩니다!
    // res.redirect(301, '/') // 이렇게 해도 안 됩니다!
    res.redirect('/') // res.redirect는 302 상태코드로 응답합니다.
  } else {
    res.status(400)
    res.send('400 Bad Request')
  }
})

// 글 삭제 endpoint
app.post('/newpost/:id/delete', (req,res)=> {
  const postIndex = newPosts.findIndex(t => t.id === req.params.id)
  if (postIndex !== -1) {
    newPosts.splice(postIndex, 1)
    res.redirect('/')
  } else {
    res.status(400)
    res.send('400 Bad Reqeust')
  }
})

app.listen(3000, () => {
  console.log('listening');
})

