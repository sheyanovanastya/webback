import fs from 'fs';

class DB {
  constructor(collectionName) {
    this.fileName = `${collectionName}.json`;
    this.data = this._loadData();
    this.collectionName = collectionName;
  }

  _loadData() {
    if (fs.existsSync(this.fileName)) {
      const records = fs.readFileSync(this.fileName, 'utf-8');
      return JSON.parse(records || "[]");
    }
    return [];
  }

  _saveData() {
    fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, 2));
  }

  push(el) {
    this.data.push(el);
    this._saveData();
  }

  filter(cb) {
    return this.data.filter(cb);
  }

  map(cb) {
    return this.data.map(cb);
  }

  find(cb) {
    const el = this.data.find(cb);
    return el ? { ...el } : undefined;
  }

  save(login, newData) {
    this.data = this.data.map(el => el.login === login ? { ...el, ...newData } : el);
    this._saveData();
  }

  update(cb, newData) {
    this.data = this.data.map(el => cb(el) ? { ...el, ...newData } : el);
    this._saveData();
  }

  some(cb) {
    return this.data.some(cb);
  }
}

export const USERS = new DB('db_users');
export const ORDERS = new DB('db_orders');
export const ADDRESSES = new DB('db_addresses');
