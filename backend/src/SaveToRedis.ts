//import redis from 'ioredis';

export interface KYCInformation {
  sub: string;
  birthdate: string;
  address: {
    locality: string;
  };
  gender: string;

  name: string;
  phone_number: string;
  email: string;
  picture: string;
}
/* 
export const saveDataToRedis = async (key: string, data: any) => {
  const client = redis.createClient();

  try {
    const serializedData = JSON.stringify(data);
    await client.set(key, serializedData);
    console.log(`Data saved to Redis with key: ${key}`);
  } catch (error) {
    console.error('Error saving data to Redis:', error);
  } finally {
    client.quit();
  }
};

export const saveKYCInfoToRedis = async (userData: any) => {
  try {
    const key = userData.sub; // Use the sub field as the key for KYC information in Redis
    await saveDataToRedis(key, userData); // Call the function to save data to Redis
  } catch (error) {
    console.error('Error saving KYC information to Redis:', error);
  }
};
 */
/* export const getDataFromRedis = async (key: string) => {
  const client = new Redis();

  try {
    const data = await client.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data from Redis:', error);
    throw error;
  } finally {
    await client.quit();
  }
};

export const getKYCInfoFromRedis = async (sub: string) => {
  try {
    const userData = await getDataFromRedis(sub);
    return userData;
  } catch (error) {
    console.error('Error retrieving KYC information from Redis:', error);
    throw error;
  }
}; */