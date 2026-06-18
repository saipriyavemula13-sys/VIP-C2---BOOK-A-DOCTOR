const { MongoClient } = require('mongodb');
const hosts = [
  'ac-d98bv23-shard-00-00.xr6w9qk.mongodb.net:27017',
  'ac-d98bv23-shard-00-01.xr6w9qk.mongodb.net:27017',
  'ac-d98bv23-shard-00-02.xr6w9qk.mongodb.net:27017',
];
const user = 'saipriyavemula13_db_user';
const pass = 'saipriya1221';
const dbName = 'book-a-doctor';

(async () => {
  for (const host of hosts) {
    const uri = `mongodb://${user}:${pass}@${host}/${dbName}?authSource=admin&tls=true&directConnection=true`;
    console.log('TEST', host, uri);
    try {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
      await client.connect();
      const admin = client.db(dbName).admin();
      const info = await admin.command({ hello: 1 });
      console.log('HELLO', host, info);
      await client.close();
    } catch (err) {
      console.error('ERROR', host, err.message);
    }
  }
})();
