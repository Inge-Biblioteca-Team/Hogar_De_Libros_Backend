/* eslint-disable prettier/prettier */
export enum Role {
    Viewer = 'viewer',
    Creator = 'creator',
    ExternalUser = 'external_user',
    Admin = 'admin',
}

interface LoanLimits {
    canLoan: boolean;
    maxBooks: number | 'unlimited';
    days: number | 'unlimited';
}

export class LoanPolicy {
    static getLoanLimits(role: Role, numBooks: number = 1): LoanLimits {
        switch (role) {
            case Role.ExternalUser:
                if (numBooks <= 2) {
                    return {
                        canLoan: true,
                        maxBooks: 2,
                        days: 15, 
                    };
                } else if (numBooks === 3) {
                    return {
                        canLoan: true,
                        maxBooks: 3,
                        days: 22, 
                    };
                } else if (numBooks >= 4 && numBooks <= 5) {
                    return {
                        canLoan: true,
                        maxBooks: 5,
                        days: 30, 
                    };
                } else {
                    return {
                        canLoan: false,
                        maxBooks: 0,
                        days: 0,
                    };
                }
            case Role.Admin:
                return {
                    canLoan: true,
                    maxBooks: 'unlimited',
                    days: 'unlimited',
                };
            case Role.Viewer:
                return {
                    canLoan: false,
                    maxBooks: 0,
                    days: 0,
                };
            case Role.Creator:
                return {
                    canLoan: false,
                    maxBooks: 'unlimited',
                    days: 'unlimited',
                };
            default:
                return {
                    canLoan: false,
                    maxBooks: 0,
                    days: 0,
                };
        }
    }

    static canLoan(role: Role, numBooks: number = 1): boolean {
        const policy = this.getLoanLimits(role, numBooks);
        return policy.canLoan;
    }

    static getMaxBooks(role: Role, numBooks: number = 1): number | 'unlimited' {
        const policy = this.getLoanLimits(role, numBooks);
        return policy.maxBooks;
    }

    static getMaxDays(role: Role, numBooks: number = 1): number | 'unlimited' {
        const policy = this.getLoanLimits(role, numBooks);
        return policy.days;
    }
}

