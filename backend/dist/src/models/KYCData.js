"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCData = void 0;
class KYCData {
    constructor(data) {
        this.name = data.name || '';
        this.dob = data.dob || '';
        this.gender = data.gender || '';
        this.address = data.address || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.nationality = data.nationality || '';
        this.passport_number = data.passport_number || '';
        this.issue_date = data.issue_date || '';
        this.expiry_date = data.expiry_date || '';
        this.bank_account_number = data.bank_account_number || '';
        this.bank_name = data.bank_name || '';
        this.employer = data.employer || '';
        this.occupation = data.occupation || '';
        this.income = data.income || '';
        this.marital_status = data.marital_status || '';
        this.dependents = data.dependents || 0;
        this.risk_level = data.risk_level || '';
    }
}
exports.KYCData = KYCData;
