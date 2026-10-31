import { MongoClient } from 'mongodb';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

let collection;
const memory = new Map();
const localFile = join(process.cwd(), 'data', 'cases.json');

async function loadLocalCases() {
  try {
    const records = JSON.parse(await readFile(localFile, 'utf8'));
    if (Array.isArray(records)) for (const record of records) memory.set(record.id, record);
  } catch (error) {
    if (error.code !== 'ENOENT') console.warn(`Could not read local case storage: ${error.message}`);
  }
}

async function persistLocalCases() {
  await mkdir(dirname(localFile), { recursive: true });
  await writeFile(localFile, JSON.stringify([...memory.values()], null, 2), 'utf8');
}

export async function connectStore() {
  await loadLocalCases();
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is empty; using local case storage.');
    return;
  }
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    collection = client.db(process.env.MONGODB_DB || 'ai_mystery_room').collection('cases');
    await collection.createIndex({ id: 1 }, { unique: true });
  } catch (error) {
    await client.close().catch(() => {});
    console.warn(`MongoDB unavailable (${error.code || error.message}); using local case storage.`);
  }
}

export async function saveCase(record) {
  memory.set(record.id, record);
  if (collection) {
    try {
      await collection.insertOne(record);
      return;
    } catch (error) {
      console.warn(`MongoDB write failed (${error.code || error.message}); saving case locally.`);
    }
  }
  await persistLocalCases();
}

export async function getCase(id) {
  if (collection) {
    try {
      const record = await collection.findOne({ id });
      if (record) return record;
    } catch (error) {
      console.warn(`MongoDB read failed (${error.code || error.message}); checking local case storage.`);
    }
  }
  return memory.get(id);
}
