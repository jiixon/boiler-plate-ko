const { User } =  require('../models/User');

let auth = (req, res, next) => {
    //인증 처리를 하는 곳

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후 유저를 찾는다.(user모델에서 가져와 메소드만듦)
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true})

        req.token = token; //user가 있는 경우
        req.user = user;
        next();
    })

}
module.exports = { auth }; 