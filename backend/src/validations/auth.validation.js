const { z, email } = require('zod')

const registerSchema = z.object({
 ism: z.string().min(3, 'Isim kamida 3 ta belgidan iborat bolishi kerak'),
 email: z.string().email('Email notogri formatda'),
 password: z.string().min('6', 'Parol kamida 6 ta belgidan iborat bolishi kerak'),

});

const loginSchema = z.object({
    email: z.string().email('Email notogri formatda'),
    password: z.string().min(1, 'Parol kiritilishi shart' ),

});


module.exports =  {registerSchema, loginSchema};