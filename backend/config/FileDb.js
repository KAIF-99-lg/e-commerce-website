import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const FileDb = {
  connect: () => {
    console.log('✅ File-based database connected');
    return Promise.resolve();
  }
};

export default FileDb;