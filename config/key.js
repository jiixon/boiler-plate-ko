if(process.env.NODE_ENV === 'production') {  //process.env.NODE_ENV(환경변수)
    module.exports = require('./prod'); //deploy(배포)한 후
} else {
    module.exports = require('./dev'); //local 환경에서
}