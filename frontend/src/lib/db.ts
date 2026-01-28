// MongoDB Connection Pool
import { MongoClient, Db } from 'mongodb';

interface GlobalWithMongo {
  mongo?: {
    client: MongoClient;
    db: Db;
  };
}

declare const global: GlobalWithMongo;

// Delayed initialization - check at runtime, not build time
const getUri = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  return uri;
};

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  retryReads: true,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  ssl: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
  tlsAllowInvalidHostnames: process.env.NODE_ENV === 'development',
  authSource: 'admin',
  w: 1,
};

let client: MongoClient;
let db: Db;

async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  // Get URI at runtime
  const uri = getUri();
  // In development or if not cached, create new connection
  if (!global.mongo) {
    client = new MongoClient(uri, options);
    
    let retries = 3;
    let lastError: Error | null = null;
    
    while (retries > 0) {
      try {
        await client.connect();
        db = client.db('portfolio');
        
        global.mongo = { client, db };
        break;
      } catch (error) {
        lastError = error as Error;
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (!global.mongo && lastError) {
      throw lastError;
    }
  }

  if (!global.mongo) {
    throw new Error('Failed to connect to MongoDB');
  }

  return {
    client: global.mongo.client,
    db: global.mongo.db,
  };
}

export async function getDB(): Promise<Db> {
  const { db } = await connectDB();
  return db;
}

export async function getCollection(collectionName: string) {
  const db = await getDB();
  return db.collection(collectionName);
}

export async function closeDB() {
  if (global.mongo) {
    await global.mongo.client.close();
    global.mongo = undefined;
  }
}
