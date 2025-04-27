// build.js - Vercel build script
import { execSync } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

async function build() {
  console.log('🏗️ Building for Vercel deployment...');
  
  // Build client (frontend)
  console.log('📦 Building client...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create a simple package.json for the Vercel build
  console.log('📄 Creating Vercel package.json...');
  const vercelPackageJson = {
    "name": "spicepop",
    "version": "1.0.0",
    "engines": {
      "node": "18.x"
    },
    "scripts": {
      "start": "node dist/index.js"
    }
  };

  try {
    await writeFile(
      path.join(process.cwd(), 'dist', 'package.json'),
      JSON.stringify(vercelPackageJson, null, 2)
    );
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build().catch(console.error);