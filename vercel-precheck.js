// Pre-deployment check script for Vercel
import fs from 'fs';
import path from 'path';

// Define the critical files that should exist
const criticalFiles = [
  'package.json',
  'vercel.json',
  'vite.config.ts',
  'server/index.ts',
  'server/db.ts',
  'client/index.html'
];

// Define environment variables that should be set in production
const criticalEnvVars = [
  'DATABASE_URL'
];

function checkFiles() {
  console.log('🔍 Checking for critical files...');
  const missingFiles = [];
  
  for (const file of criticalFiles) {
    if (!fs.existsSync(path.resolve(process.cwd(), file))) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing critical files:', missingFiles.join(', '));
    return false;
  }
  
  console.log('✅ All critical files present!');
  return true;
}

function checkVercelConfig() {
  console.log('🔍 Checking Vercel configuration...');
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'vercel.json'), 'utf8'));
    
    // Check for essential configuration properties
    if (!vercelConfig.version || !vercelConfig.builds || !vercelConfig.routes) {
      console.error('❌ vercel.json is missing essential configuration!');
      return false;
    }
    
    console.log('✅ Vercel configuration appears valid!');
    return true;
  } catch (error) {
    console.error('❌ Error reading or parsing vercel.json:', error.message);
    return false;
  }
}

function checkEnvVars() {
  console.log('🔍 Checking for critical environment variables...');
  const missingVars = [];
  
  for (const envVar of criticalEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables that will be needed on Vercel:', missingVars.join(', '));
    console.warn('Make sure to add these in your Vercel project settings!');
    return false;
  }
  
  console.log('✅ All critical environment variables present!');
  return true;
}

function runChecks() {
  console.log('🚀 Running Vercel pre-deployment checks...');
  console.log('===========================================');
  
  const filesOk = checkFiles();
  const vercelConfigOk = checkVercelConfig();
  const envVarsOk = checkEnvVars();
  
  console.log('===========================================');
  
  if (filesOk && vercelConfigOk && envVarsOk) {
    console.log('✅ All checks passed! Ready for deployment to Vercel.');
    return true;
  } else {
    console.log('⚠️ Some checks failed. Review the issues above before deploying to Vercel.');
    return false;
  }
}

runChecks();