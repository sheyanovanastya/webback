import fs from 'fs';

class DB {
  constructor(collectionName) {
    this.fileName = `${collectionName}.json`;
    this.data = fs.existsSync(this.fileName)
      ? JSON.parse(fs.readFileSync(this.fileName, 'utf-8') || "[]")
      : [];
  }

  saveData() {
    fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, 2));
  }

  push(el) {
    this.data.push(el);
    this.saveData();
  }

  filter(cb) {
    return this.data.filter(cb);
  }

  map(cb) {
    return this.data.map(cb);
  }

  find(cb) {
    return this.data.find(cb);
  }

  save(login, newData) {
    const index = this.data.findIndex(el => el.login === login);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...newData };
      this.saveData();
    }
  }

  some(cb) {
    return this.data.some(cb);
  }
}

export const USERS = new DB('db_users');
export const ORDERS = new DB('db_orders');
