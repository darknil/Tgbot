import jwt from 'jsonwebtoken'

export class JwtService {
  constructor() {
    this.secret = process.env.TG_TOKEN
    this.expiresIn = '3h';
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn
    })
  }

  verifyToken(token) {
    try {
      if (!token) {
        throw new Error('Token is not provided')
      }
      return jwt.verify(token, this.secret) // Верификация токена с использованием секретного ключа
    } catch (err) {
      console.log('Error verifying token:', err)
      return false
    }
  }
  getExpirationTime(){
    try {
      const timeUnit = this.expiresIn.slice(-1);
      const timeValue = parseInt(this.expiresIn.slice(0, -1), 10);

      let expirationInSeconds;

      switch (timeUnit) {
        case 's':
          expirationInSeconds = timeValue;
          break;
        case 'm':
          expirationInSeconds = timeValue * 60;
          break;
        case 'h':
          expirationInSeconds = timeValue * 3600;
          break;
        case 'd':
          expirationInSeconds = timeValue * 86400;
          break;
        default:
          throw new Error('Invalid time unit');
      }

      return expirationInSeconds;
    } catch (error) {
      console.log('get expiration time error :', error)
      return null;
    }
  }
}
