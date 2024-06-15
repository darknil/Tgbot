export class ResponseService {
  constructor() {}
  success(res, data, message = 'Success', statusCode = 200) {
    try {
      return res.status(statusCode).json({
        status: 'Success',
        message: message,
        body: data
      })
    } catch (error) {
      console.log('response succes error', error)
    }
  }
  error(res, message = 'Error', statusCode = 500) {
    try {
      return res.status(statusCode).json({
        status: 'Error',
        message: message
      })
    } catch (error) {
      console.log('response error error', error)
    }
  }
  notFound(res, message = 'Not found', statusCode = 404) {
    try {
      return res.status(statusCode).json({
        status: 'Not Found',
        message: message
      })
    } catch (error) {
      console.log('response not found error', error)
    }
  }
  badRequest(res, message = 'Bad request', statusCode = 400) {
    try {
      return res.status(statusCode).json({
        status: 'Bad Request',
        message: message
      })
    } catch (error) {
      console.log('response bad request error', error)
    }
  }
  unauthorized(res, message = 'Unauthorized', statusCode = 401) {
    try {
      return res.status(statusCode).json({
        status: 'Unauthorized',
        message: message
      })
    } catch (error) {
      console.log('response unauthorized error', error)
    }
  }
}
