const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser'); 
const { User } = require("./models/User");
const cookieParser = require('cookie-parser');
const config = require('./config/key');


const { auth } = require('./middleware/auth');

//body-Parser가 client에서 오는 정보를 서버에서 분석하여 가져오도록 하기
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true})); 

//application/json
app.use(bodyParser.json()); 
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {   //config.mongoURI(비밀)
  useNewUrlParser: true, useUnifiedTopology: true  
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {res.send('Hello World! WOW~')})

app.get('/api/hello',(req,res) => {
  res.send("안녕하세요~")
})


app.post('/api/users/register', (req,res) => {

})
app.post('/api/users/register', (req,res) => {  //post 매소드이용

  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다. (5번째 줄)



  const user = new User(req.body) 
  //모든정보들을 모델에 넣어주고, user.save를 하기전에, 비밀번호 암호화가 필요(User.js)

  user.save((err, userInfo) => {  //mongoDB에서의 매소드, 정보들이 user모델에 저장됨
    if(err) return res.json({ success: false, err}) //error가 있으면 client에 전달(json형식으로+에러메시지도 전달)
    return res.status(200).json({
      success: true  //성공시, 이 문장 출력하도록
    })
  }) 
})
app.post('/api/users/register',(req, res) => {
  const user = new User(req.body)
  
})

app.post('/api/users/login', (req, res) => {

  //요청된 이메일을 데이터베이스에서 있는지 찾기
  User.findOne({ email: req.body.email }, (err,user) => { 
    if(!user) {               //이메일에 해당하는 유저가 하나도 없다면
      return res.json({       
        loginSuccess: false,  
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password , (err, isMatch ) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        })
      
      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. (쿠키이용)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
        
      })
        
    })
  })
})

app.get('/api/users/auth', auth ,(req,res) => {
  
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false: true, //role 0 -> 일반유저, role 0아니면 -> 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

//로그아웃 route
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, //DB에서 찾을 건데, auth미들웨어에서 id로 찾겠다.
    {token: ""} //토큰을 지워준다.
    , (err, user) => { 
      if (err) return res.json({ success: false, err});
      return res.status(200).send({ //찾는데 성공하면,
        success: true
      })
    })
})

app.listen(port, () => {console.log(`Example app listening on port ${port}`)})
