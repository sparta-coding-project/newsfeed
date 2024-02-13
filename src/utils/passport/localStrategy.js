import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';
import { checkPW } from '../bcrypt.js';
import { prisma } from '../prisma/index.js';

export default () => {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email, password, done) => {
        try{
            const exUser = await prisma.users.findFirst({
                where: {
                    email
                }
            })

            if (exUser) {
                const result = checkPW(password, exUser.password);
                if (result) {
                    done(null, exUser);
                }else{
                    done(null, false, {message: "비밀번호가 일치하지 않습니다."});
                }
            }else{
                done(null, false, {message: "가입하지 않은 이용자입니다."})
            }
        }catch(error){
            done(error)
        }
    }))
}