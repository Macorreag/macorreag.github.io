const fs = require('fs');
const path = require('path');

const STATUS_PATH = path.join(__dirname, '../src/data/notion/sync-status.json');

function loadStatus() {
  try {
    return JSON.parse(fs.readFileSync(STATUS_PATH, 'utf8'));
  } catch (err) {
    return {};
  }
}

function setStatus(section, data) {
  const status = loadStatus();
  status[section] = data;
  fs.mkdirSync(path.dirname(STATUS_PATH), { recursive: true });
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
}

function getStatus(section) {
  const status = loadStatus();
  return status[section] || { source: 'placeholder', lastSyncedAt: null };
}

module.exports = { loadStatus, setStatus, getStatus, STATUS_PATH };
