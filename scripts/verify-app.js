'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const assetPattern = /(?:src|href)=["']([^"']+)["']/g;
const missing = [];
let match;

while ((match = assetPattern.exec(indexHtml)) !== null) {
  const asset = match[1];
  if (/^(https?:)?\/\//.test(asset) || asset.startsWith('#')) {
    continue;
  }

  const assetPath = path.join(root, asset);
  if (!fs.existsSync(assetPath)) {
    missing.push(asset);
  }
}

if (missing.length > 0) {
  console.error('Missing assets referenced by index.html:');
  missing.forEach((asset) => console.error(`  - ${asset}`));
  process.exit(1);
}

function calculateDate(startDate, days) {
  const splittedDate = startDate.split('/');
  const parsedStartDate = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0]);
  const newDate = new Date(parsedStartDate);
  return newDate.setDate(parsedStartDate.getDate() + days);
}

const result = new Date(calculateDate('01/01/2021', 270));
const expected = new Date('28/09/2021'.split('/').reverse().join('-'));

if (result.toDateString() !== expected.toDateString()) {
  console.error(
    `Date calculation failed: expected ${expected.toDateString()}, got ${result.toDateString()}`
  );
  process.exit(1);
}

const app = fs.readFileSync(path.join(root, 'js/angular/app.js'), 'utf8');

if (!app.includes("angular.module('dateCounter'")) {
  console.error('Angular app module definition not found.');
  process.exit(1);
}

console.log('All referenced assets exist and date calculation works.');
