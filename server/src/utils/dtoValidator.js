export class DtoValidator {
  async validateReportDto(ReportDTO) {
    try {
      if (
        typeof ReportDTO.id !== 'number' ||
        typeof ReportDTO.ownerId !== 'string' ||
        !Array.isArray(ReportDTO.questions) ||
        !(ReportDTO.date instanceof Date)
      ) {
        return false
      }
      return true
    } catch (error) {
      console.log('validateReportDto error', error)
    }
  }
}
