import {TokenData} from "../models/TokenData";

export type TGetUserTokenData = {
    token?: string;
    error?: string;
}

export type TFetchUserDataRes = {
    token?: string;
    error?: string;
}

export type ML_Party = {
    "party"?: {
        "body"?: {
            "partyIdInfo"?: {
                "partyIdType"?: string,
                "partyIdentifier"?: string,
                "partySubIdOrType"?: string,
                "fspId"?: string,
                "extensionList"?: {
                    "extension"?: [
                        {
                            "key"?: string,
                            "value"?: string
                        }
                    ]
                }
            },
            "merchantClassificationCode"?: string,
            "name"?: string,
            "personalInfo"?: {
                "complexName"?: {
                    "firstName"?: string,
                    "middleName"?: string,
                    "lastName"?: string
                },
                "dateOfBirth"?: string
            }
        },
        "headers"?: unknown
    },
    "currentState"?: string
    "error"?: string
}

export type TKYCData = {
    name: string;
    dob: string;
    gender: string;
    address: string;
    email: string;
    phone: string;
    nationality: string;
    passport_number: string;
    issue_date: string;
    expiry_date: string;
    bank_account_number: string;
    bank_name: string;
    employer: string;
    occupation: string;
    income: string;
    marital_status: string;
    dependents: number;
    risk_level: string;
}

export type TKycInfo = {
    sub: string;
    birthdate: string;
    address: {
        locality: string;
    };
    gender: string;
    name: string;
    phoneNumber: string;
    email: string;
    picture: string;
}

export type TAppConfig = {
    CLIENT_ID: string;
    ESIGNET_TOKEN_URL: string;
    RETURN_URL: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    REACT_APP_KYC_PROPERTIES_TO_COMPARE: string;
    REACT_APP_JWT_SECRET_KEY: string;
    JWT_SECRET_KEY: string;
    JWT_PRIVATE_KEY: string;
    JWT_PUBLIC_KEY: string;
    PTA_URL: string;
    MOJALOOP_GETPARTIES_URL: string;
    MOJALOOP_SDK_URL: string;
    ESIGNET_USERINFO_URL: string;
    KEY_FILE_PATH: string;
    PORT: number;
}

export type TRouteHandlerDeps = {
    client_id: string,
    esignet_url: string,
    return_url: string
}

export type TStorageRepoDeps = {
    host: string,
    user: string,
    password: string,
    database: string
}
export interface IStorageRepo {
    init(): Promise<void>;
    destroy(): Promise<void>;
    SaveDateToDB (tokenData: TokenData): Promise<TokenData | { error: string }>;
}