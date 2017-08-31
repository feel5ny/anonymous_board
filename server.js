const express = require('express')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4')
const basicAuth = require('express-basic-auth')

const app = express()
let id=1;
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const newPosts = [
  {
    id:id,
    // number: id,
    title: 'sample post',
    comments: 'sample',
    // newpost: [],
    date: '2017/08/09',
    profile : '익명'
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



// 익명게시판 viewDetail 페이지
app.get('/viewpost/:id', (req, res) => {
  const viewpost = newPosts.find(t => t.id === req.params.id)
  res.render('viewpost.ejs', {newPosts})
  // if (viewpost) {
  // } else {
  //   res.status(404)
  //   res.send('404 Not Found')
  // }
})


// 익명게시판 newPost 페이지
app.get('/newpost', (req, res) => {
  res.render('insert.ejs')
})


// 새글 추가 endpoint
app.post('/newpost', urlencodedParser, (req, res) => {
  const title = req.body.title
  const text = req.body.text
  // validation
  if (title, text) {
    const newpost = {
      id: ++id,
      title,
      text
    }
    newPosts.push(newpost)
    // id++
    res.redirect('/') // res.redirect는 302 상태코드로 응답합니다.
  } else {
    res.status(400)
    res.send('400 Bad Request')
  }
})

// 새 댓글 추가 endpoint
app.post('/comment', urlencodedParser, (req, res) => {
  const comment = req.body.comment
  if (comment) {
    // const newcomment = {
    //   id: uuidv4(),
    //   comment
    // }
    newPosts.unshift(comment)
    res.redirect('/viewpost/:id')
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

