if (typeof window === 'undefined') {
  throw new Error('For browser use only.');
}

const root = window;
const storage = root.localStorage;

const localStorage = {
  setItem(skey, sval) {
    try {
      return storage.setItem(skey, sval);
    } catch (e) {
      console.info(e);
      return null;
    }
  },
  getItem(skey) {
    try {
      return storage.getItem(skey);
    } catch (e) {
      console.info(e);
      return null;
    }
  },
  removeItem(skey) {
    try {
      return storage.removeItem(skey);
    } catch (e) {
      console.info(e);
      return null;
    }
  },
  getJSON(skey, p) {
    try {
      let d = storage.getItem(skey);
      if (d) {
        d = JSON.parse(d);
        return d[p];
      }
      return null;
    } catch (e) {
      console.info(e);
      return null;
    }
  },
  setJSON(skey, p, val) {
    try {
      let f = storage.getItem(skey);
      f = f ? JSON.parse(f) : {};
      f[p] = val;
      storage.setItem(skey, JSON.stringify(f));
    } catch (e) {
      console.info(e);
    }
  },
  removeJSON(skey, p) {
    try {
      let d = storage.getItem(skey);
      if (d) {
        d = JSON.parse(d);
        delete d[p];
        storage.setItem(skey, JSON.stringify(d));
      }
    } catch (e) {
      console.info(e);
    }
  },
};

export default localStorage;
