import mysql, {createPoolCluster} from 'mysql2';
import { TokenData } from '../models/TokenData';

const {
  HOST,
  USER,
  PASSWORD,
  DATABASE,
} = process.env;
// todo: use a package (e.g. convict) to deal with env vars; make some envs required

const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE
});

// todo: connect to DB in index.ts before starting the server
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

export const SaveDataToDB = async (tokenData: TokenData): Promise<TokenData | { error: string }> => {
  return new Promise((resolve, reject) => {
    const { psut, token } = tokenData;

    // First, check if the psut already exists in the token table
    const checkQuery = 'SELECT * FROM tokens WHERE psut = ?';
    // todo: use async/await version instead on callbacks, e.g.: const [result] = await db.query(checkQuery);
    db.query(checkQuery, [psut], (err, results) => {
      if (err) {
        console.error('Error checking psut in database:', err);
        reject({ error: 'Failed to check psut' });
        return;
      }

      if (Array.isArray(results) && results.length > 0) {
        // If psut exists, update the existing record with the new token and set status to 'active'
        const updateQuery = 'UPDATE tokens SET token = ?, status = "active" WHERE psut = ?';
        db.query(updateQuery, [token, psut], (err, result) => {
          if (err) {
            console.error('Error updating data in database:', err);
            reject({ error: 'Failed to update data' });
          } else {
            console.log('Data updated in database successfully');
            resolve(tokenData);
          }
        });
      } else {
        // If psut does not exist, insert a new record
        const insertQuery = 'INSERT INTO tokens (psut, token, status) VALUES (?, ?, "active")';
        const values = [psut, token];
        db.query(insertQuery, values, (err, result) => {
          if (err) {
            console.error('Error saving data to database:', err);
            reject({ error: 'Failed to save data' });
            return ({ error: 'Failed to save data' }); // todo: what for this return?
          } else {
            console.log('Data saved to database successfully');
            resolve(tokenData);
            return ({ message: 'Data saved successfully' });
          }
        });
      }
    });
  });
};
