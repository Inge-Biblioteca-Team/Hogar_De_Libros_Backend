/* eslint-disable prettier/prettier */
export class LoanPolicy {
  static getLoanLimits(policity: number, currentLoan: number) {
    switch (policity) {
      case 0:
        return {
          canLoan: currentLoan === 0,
        };
      case 8:
        return {
          canLoan: currentLoan === 0,
        };
      case 15:
        return {
          canLoan: currentLoan < 2,
        };
      case 22:
        return {
          canLoan: currentLoan < 3,
        };
      case 30:
        return {
          canLoan: currentLoan < 5,
        };
      case 78:
        return {
          canLoan: true,
        };
      default:
        return {
          canLoan: false,
        };
    }
  }
}
