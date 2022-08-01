const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10  //saltRounds(salt 글자 수)
const jwt = require('jsonwebtoken');

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

//user를 save하기 전에 비밀번호 암호화
userSchema.pre('save',function(next){ //저장하기전 함수적용
    var user = this; //순수패스워드 가져오도록
    
    if(user.isModified('password')){  //비밀번호 변경시에만, 암호화하도록 설정

        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash  //비밀번호(hash)로 교체
                next()
            })
        })
    } else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567  암호화된 비밀번호 $2b$10$lvBB.mQb13b7VygvIJ1eCekcIbdwNp2s4FWAs20jUMw9MzYNzTqXS
    bcrypt.compare(plainPassword, this.password,function(err, isMatch) {
        if(err) return cb(err);
            cb(null, isMatch)  //err가 안난다면(null), isMatch(true)
    })
}

//비밀번호에 맞는 유저에 대한 토큰생성
userSchema.methods.generateToken = function(cb){

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    //user._id + 'secretToken' = token
    //->
    //'secretToken' -> user._id

    user.token = token
    user.save(function(err, user){
        
        if(err) return cb(err) //callback으로 err전달
        cb(null, user)
    })
}



//위에 만든 Schema를 model로 감싸줌
const User = mongoose.model('User',userSchema) //('모델이름',스키마이름)

//모델을 다른파일에서도 쓰도록 설정
module.exports = {User}