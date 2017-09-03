# 익명 게시판 

최소 요구사항
- 누구나 글을 쓸 수 있음
- 누구나 댓글을 달 수 있음
- 관리자만 사용한 가능한 페이지에서 글을 삭제할 수 있음

리뷰
- 각 페이지별, 기능별로 모듈화 하여 호출하였다.
- 메인파일(index.ejs)에서는 전체적인 실행 순서나 흐름만을 제어한다.

초기 셋팅
- Express 앱 세팅
  - npm install --save express
  - 템플릿 엔진 설정
  - npm script 추가
  - static 라우트 설정
  - 템플릿, CSS 파일 추가

- 로깅과 인증
  - morgan 설정
  - express-basic-auth 설정
