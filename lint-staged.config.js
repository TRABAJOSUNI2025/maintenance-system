export default {
  '*.{ts,tsx,js,jsx}': [
    'npm run lint --prefix frontend -- --fix',
    'npm run lint --prefix backend -- --fix'
  ],
  '*.json': ['prettier --write'],
  '*.md': ['prettier --write']
};
