"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCInformation = void 0;
class KYCInformation {
    constructor(data) {
        this.sub = data.sub || '';
        this.birthdate = data.birthdate || '';
        this.address = data.address ? { locality: data.address.locality || '' } : { locality: '' };
        this.gender = data.gender || '';
        this.name = data.name || '';
        this.phoneNumber = data.phoneNumber || '';
        this.email = data.email || '';
        this.picture = data.picture || '';
    }
}
exports.KYCInformation = KYCInformation;
