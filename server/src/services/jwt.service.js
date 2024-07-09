import jwt from 'jsonwebtoken'

export class JwtService {
  constructor() {
    this.secret = process.env.TG_TOKEN
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: '3h'
    })
  }

  verifyToken(token) {
    try {
      if (!token) {
        throw new Error('Token is not provided')
      }
      return jwt.verify(token, this.secret) // Верификация токена с использованием секретного ключа
    } catch (err) {
      return false
    }
  }
}
