import mysql from 'mysql';


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'brp'
});

interface TokenData {
  psut: string;
  token: string;
}

export const SaveDataToDB = async (tokenData: TokenData): Promise<TokenData | { error: string }> => {
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
            return ({ error: 'Failed to save data' }); 
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