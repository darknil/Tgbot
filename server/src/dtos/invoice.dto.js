import 'dotenv/config'
const productId = process.env.PRODUCT_ID
export class InvoiceDTO {
  constructor(email) {
    this.email = email
    this.offerId = productId
    this.currency = 'RUB'
    this.buyerLanguage = 'RU'
  }
}
