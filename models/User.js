const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlengh: 50
    },
    email: {
        type: String,
        trim: true,  //trim: 공백제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {  //관리자, 일반유저 등의 역할
        type: Number,
        default: 0
    },
    image: String,
    token: {  //유효성관리
        type: String
    },
    tokenExp: {  //유효기간
        type: Number
    }

    
})

//위에 만든 Schema를 model로 감싸줌
const User = mongoose.model('User',userSchema) //('모델이름',스키마이름)

//모델을 다른파일에서도 쓰도록 설정
module.exports = {User}