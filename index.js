const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser'); 

const config = require('./config/key');

const { User } = require("./models/User"); //User.js의 정보 가져오기

//body-Parser가 client에서 오는 정보를 서버에서 분석하여 가져오도록 하기
app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-urlencoded

app.use(bodyParser.json()); //application/json


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {   //config.mongoURI(비밀)
  useNewUrlParser: true, useUnifiedTopology: true  
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

//mongodb+srv://jiwon:<password>@cluster0.yp52q.mongodb.net/?retryWrites=true&w=majority



app.get('/', (req, res) => {res.send('Hello World! WOW~')})

app.post('/register', (req,res) => {  //post 매소드이용

  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다. (5번째 줄)


  

  const user = new User(req.body) 
  user.save((err, userInfo) => {  //mongoDB에서의 매소드, 정보들이 user모델에 저장됨
    if(err) return res.json({ success: false, err}) //error가 있으면 client에 전달(json형식으로+에러메시지도 전달)
    return res.status(200).json({
      success: true  //성공시, 이 문장 출력하도록
    })
  }) 
})


app.listen(port, () => {console.log(`Example app listening on port ${port}`)})
