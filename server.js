const express = require('express')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4')
let ramdomString = require('randomstring')
const basicAuth = require('express-basic-auth')
const today = new Date();
const dd = today.getDate()
const mm = today.getMonth()+1
const year = today.getFullYear()

const app = express()
let num=1
let comments =[]
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const newPosts = [
  {
    id:uuidv4(),
    // commentId: uuidv4(),
    num : num,
    title: 'sample',
    comments: [],
    date: year+'/'+mm+'/'+dd,
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
  // console.log(req.params.id)
  const viewpost = newPosts.find(t => t.id === req.params.id)
  if (viewpost) {
    res.render('viewpost.ejs', {viewpost})
  } else {
    res.status(404)
    res.send('404 Not Found')
  }
})


// 익명게시판 newPost 페이지
app.get('/newpost', (req, res) => {
  res.render('insert.ejs')
})


// 글 삭제 페이지

// 새글 추가 endpoint
app.post('/newpost', urlencodedParser, (req, res) => {
  // let id
  const title = req.body.title
  const text = req.body.text
  // validation
  if (title, text) {
    const newpost = {
      id: uuidv4(),
      num: ++num,
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
app.post('/comment/:id', urlencodedParser, (req, res) => {
  const comment = req.body.comment
  const matched = newPosts.find(item => item.id === req.params.id)

  // 해당 viewpost의 코멘트배열을 갖고와야함
  if (matched) {
    // const newcomment = {
    //   // commentId: uuidv4(),
    //   comments: comment
    // }
    comments.push(comment)
    res.redirect('back')
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
