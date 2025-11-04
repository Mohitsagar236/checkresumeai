// Script to run subscription validation tests
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Running subscription validation tests...');

try {
  // Check if the test file exists
  const testFilePath = path.join(__dirname, '..', 'src', '__tests__', 'subscriptionValidation.test.ts');
  if (!fs.existsSync(testFilePath)) {
    console.error('Test file not found:', testFilePath);
    process.exit(1);
  }

  // Run the test using ts-node
  console.log('Executing tests...');
  const result = execSync('npx ts-node -r tsconfig-paths/register ' + testFilePath, { 
    encoding: 'utf-8',
    stdio: 'inherit'
  });

  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Error running tests:', error.message);
  process.exit(1);
}
