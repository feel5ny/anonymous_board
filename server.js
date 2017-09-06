
const express = require('express') // 기본 구조 셋팅.
const bodyParser = require('body-parser')
let ramdomString = require('randomstring')
const basicAuth = require('express-basic-auth')
let today = new Date();
let dd = today.getDate()
let mm = today.getMonth()+1
let year = today.getFullYear()

const app = express() 
// Express 인스턴스 생성
// app 객체는 express()메소드 호출로 만들어지는 익스프레스 서버 객체이다.
// Express 서버객체가 갖고 있는 주요 메소드
// = set, get, use, get([path],function)

const urlencodedParser = bodyParser.urlencoded({ extended: false })
// extended:true를 해줘야 한다 .왜냐하면 url인코딩이 계속 적용될지 1번만 적용할지 묻는 것이기 때문
// 웹어플리케이션에 들어오는 모든 요청에 대해서 post 방식으로 들어오게 되면, body-parser가 어플리케이션 중간에서 요청을 가로채서(파싱) req 객체에 body라는 프로퍼티를 만들어서 post 데이터에 접근할 수 있게 해준다.
// 예_form에서 method를 post로 설정한 후 name을 지정하면, req.body.이름명 으로 접근할 수 있다.

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
  // },
  // {
  //   id:3,
  //   title: 'sample3',
  //   text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod maiores sapiente exercitationem commodi architecto incidunt hic, cupiditate eligendi ipsa corrupti ad quos dolorem assumenda rem labore fugit, quasi eveniet doloremque.',
  //   date: year+'/'+mm+'/'+dd,
  //   profile : '익명',
  // },
  // {
  //   id:4,
  //   title: 'sample4',
  //   text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod maiores sapiente exercitationem commodi architecto incidunt hic, cupiditate eligendi ipsa corrupti ad quos dolorem assumenda rem labore fugit, quasi eveniet doloremque.',
  //   date: year+'/'+mm+'/'+dd,
  //   profile : '익명',
  // },
  
]
const commentList = [
  // {
  //   id:1,
  //   comment: '댓글1',
  //   date: year+'/'+mm+'/'+dd,
  //   profile : '익명'
  // },
  // {
  //   id:2,
  //   comment: '댓글2',
  //   date: year+'/'+mm+'/'+dd,
  //   profile : '익명'
  // },
]


app.set('view engine', 'ejs')	
// template engine을 ejs로 설정하는 코드.
// set()메소드는 웹 서버의 환경을 설정하는 데 필요한 메소드인데, 서버 설정을 위해 미리 정해진 주요 속성 중 view engine속성이 있다. (디폴트로 사용할 뷰 엔진을 설정하는 코드이다.)
app.use('/static', express.static('public')) // 미들웨어 주입
// express.static은 Express의 유일한 기본 제공 미들웨어 함수이다.

let newPostSeq = newPosts.length;

// 관리자 설정
const authMiddleware = basicAuth({
  users: {'admin': 'admin'},
  challenge: true,
  realm : 'Imb4T3st4pp'
})



// 익명게시판 목록 페이지
// 라우트 핸들러 등록(HTTP 요청 메소드와 같은 이름의 메서드를 이용)
app.get('/', (req, res) => {
  res.render('index.ejs', {newPosts, commentList})
})


// 익명게시판 viewDetail 페이지
// 경로의 특정 부분을 함수의 인자처럼 입력받을 수 있음
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
app.get('/deletepost',authMiddleware, (req, res) => {
  res.render('deletepost.ejs', {newPosts,commentList})
})


// 새글 추가 endpoint
app.post('/newpost', urlencodedParser, (req, res) => {
  const title = req.body.title // 요청 바디를 적절한 형태의 자바스크립트 객체로 변환하여 이곳에 저장. (body-parser 미들웨어에 의해 처리됨)
  const text = req.body.text
  // validation
  if (title && text) {
    const newpost = {
      id: ++newPostSeq,
      title,
      text,
      date: year+'/'+mm+'/'+dd,
      profile : '익명'
    }
    newPosts.unshift(newpost)
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
  // req.params : route parameter
  
  if (matched) {
    const newcomment = {
      id: req.params.id*1,
      comment: comment,
      date: year+'/'+mm+'/'+dd,
    }
    commentList.unshift(newcomment)
    res.redirect('back')
  } else {
    res.status(400)             // 응답의 상태 코드를 지정하는 메소드
    res.send('400 Bad Request') // 인자가 텍스트면 text/ html, 객체면 application /json타입으로 응답
  }
})


// 글 삭제 endpoint
app.post('/deletepost/:id',authMiddleware, urlencodedParser, (req, res) => {
  const postIndex = newPosts.findIndex(t => t.id === req.params.id)
  newPosts.splice(postIndex, 1)
  res.redirect('/deletepost')
})

// 서버구동
app.listen(3001, () => {
  console.log('listening');
})