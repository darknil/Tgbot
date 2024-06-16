import jwt from 'jsonwebtoken'

export class JwtService {
  constructor() {
    this.secret = process.env.TG_TOKEN
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: '1h'
    })
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret) // Верификация токена с использованием секретного ключа
    } catch (err) {
      throw new Error('Token verification failed')
    }
  }
}
