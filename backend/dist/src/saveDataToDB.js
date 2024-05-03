"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveDataToDB = void 0;
const mysql_1 = __importDefault(require("mysql"));
const db = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'brp'
});
const SaveDataToDB = (tokenData) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const { psut, token } = tokenData;
        // First, check if the psut already exists in the token table
        const checkQuery = 'SELECT * FROM tokens WHERE psut = ?';
        db.query(checkQuery, [psut], (err, results) => {
            if (err) {
                console.error('Error checking psut in database:', err);
                reject({ error: 'Failed to check psut' });
                return;
            }
            if (results.length > 0) {
                // If psut exists, update the existing record with the new token and set status to 'active'
                const updateQuery = 'UPDATE tokens SET token = ?, status = "active" WHERE psut = ?';
                db.query(updateQuery, [token, psut], (err, result) => {
                    if (err) {
                        console.error('Error updating data in database:', err);
                        reject({ error: 'Failed to update data' });
                    }
                    else {
                        console.log('Data updated in database successfully');
                        resolve(tokenData);
                    }
                });
            }
            else {
                // If psut does not exist, insert a new record
                const insertQuery = 'INSERT INTO tokens (psut, token, status) VALUES (?, ?, "active")';
                const values = [psut, token];
                db.query(insertQuery, values, (err, result) => {
                    if (err) {
                        console.error('Error saving data to database:', err);
                        reject({ error: 'Failed to save data' });
                        return ({ error: 'Failed to save data' });
                    }
                    else {
                        console.log('Data saved to database successfully');
                        resolve(tokenData);
                        return ({ message: 'Data saved successfully' });
                    }
                });
            }
        });
    });
});
exports.SaveDataToDB = SaveDataToDB;
