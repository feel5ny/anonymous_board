const express = require('express')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4')
let ramdomString = require('randomstring')
const basicAuth = require('express-basic-auth')
let today = new Date();
let dd = today.getDate()
let mm = today.getMonth()+1
let year = today.getFullYear()

const app = express()
let id;
let comments =[]
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const newPosts = [
  // {
  //   id:1,
  //   title: 'sample1',
  //   text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod maiores sapiente exercitationem commodi architecto incidunt hic, cupiditate eligendi ipsa corrupti ad quos dolorem assumenda rem labore fugit, quasi eveniet doloremque.',
  //   date: year+'/'+mm+'/'+dd,
  //   profile : '익명',
  // },
  // { 
  //   id:2,
  //   title: 'sample2',
  //   text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod maiores sapiente exercitationem commodi architecto incidunt hic, cupiditate eligendi ipsa corrupti ad quos dolorem assumenda rem labore fugit, quasi eveniet doloremque.',
  //   date: year+'/'+mm+'/'+dd,
  //   profile : '익명'
  // }
]
const commentList = [
  {
    id:1,
    comment: '댓글1',
    date: year+'/'+mm+'/'+dd,
    profile : '익명'
  },
  {
    id:2,
    comment: '댓글2',
    date: year+'/'+mm+'/'+dd,
    profile : '익명'
  },
]


app.set('view engine', 'ejs')	
app.use('/static', express.static('public'))

let newPostSeq = newPosts.length;

// 관리자 설정
app.use(basicAuth({
  users: {'admin': 'admin'},
  challenge: true,
  realm : 'Imb4T3st4pp'
}))



// 익명게시판 목록 페이지
app.get('/', (req, res) => {
  res.render('index.ejs', {newPosts, commentList})
})


// 익명게시판 viewDetail 페이지
app.get('/viewpost/:id', (req, res) => {
  //toString의 유무
  const viewpost = newPosts.find(t => t.id.toString() === req.params.id)
  const commentIn = commentList.filter(t => t.id.toString() === req.params.id)
  // console.log(viewpost)
  res.render('viewpost.ejs', {viewpost,commentIn})
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


// 글 삭제 페이지
app.get('/deletepost', (req, res) => {
  // const viewpost = newPosts.find(t => t.id === req.params.id)
  // if (viewpost) {
  res.render('deletepost.ejs', {newPosts,commentList})
  //   res.render('deletepost.ejs', {viewpost})
  // } else {
  //   res.status(404)
  //   res.send('404 Not Found')
  // }
})


// 새글 추가 endpoint
app.post('/newpost', urlencodedParser, (req, res) => {
  const title = req.body.title
  const text = req.body.text
  // validation
  if (title, text) {
    const newpost = {
      id: ++newPostSeq,
      title,
      text,
      date: year+'/'+mm+'/'+dd,
      profile : '익명'
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
  const matched = newPosts.find(item => item.id.toString() === req.params.id)
  // let matchedArr = commentList.filter(item => item.id.toString() === req.params.id)
  
  if (matched) {
    const newcomment = {
      id: req.params.id*1,
      comment: comment,
      date: year+'/'+mm+'/'+dd,
    }
    commentList.push(newcomment)
    res.redirect('back')
  } else {
    res.status(400)
    res.send('400 Bad Request')
  }
})


// 글 삭제 endpoint
app.post('/deletepost', urlencodedParser, (req, res) => {
  const deleteBtn = req.body.delBtn
  const postIndex = newPosts.findIndex(t => t.id*1 === deleteBtn*1)
  // console.log(postIndex) //해당버튼의 id값을 갖고 잇는 게시물 
  // console.log(deleteBtn) //
  newPosts.splice(postIndex, 1)
  res.redirect('/deletepost')
  // if (postIndex !== -1) {
  // } else {
  //   res.status(400)
  //   res.send('400 Bad Reqeust')
  // }
})

app.listen(3000, () => {
  console.log('listening');
})