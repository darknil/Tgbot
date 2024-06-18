export class WebHookController {
  constructor() {}
  handleWebHook = async (req, res) => {
    try {
      const data = req.body
    } catch (error) {
      console.log('handle webhook error :', error)
    }
  }
}
