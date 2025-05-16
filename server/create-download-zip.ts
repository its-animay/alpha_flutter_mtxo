import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { Request, Response } from 'express';

// Function to create a downloadable zip file
export function createDownloadableZip(req: Request, res: Response) {
  // Define file path for the zip
  const zipFilePath = path.join(process.cwd(), 'public', 'mtxo_labs_edtech.zip');
  
  // Create a write stream
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });
  
  // Listen for errors
  archive.on('error', (err) => {
    console.error('Archive error:', err);
    res.status(500).send({ error: 'Failed to create archive' });
  });
  
  // Stream archive data to the file
  archive.pipe(output);
  
  // Add directories to the archive
  const directoriesToInclude = [
    { source: 'client', destPath: 'client' },
    { source: 'public/mock', destPath: 'public/mock' },
    { source: 'shared', destPath: 'shared' }
  ];
  
  // Add files to the archive
  const filesToInclude = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.ts',
    'postcss.config.js',
    'components.json',
    'drizzle.config.ts'
  ];
  
  // Add directories
  directoriesToInclude.forEach(({ source, destPath }) => {
    if (fs.existsSync(source)) {
      archive.directory(source, destPath);
    }
  });
  
  // Add individual files
  filesToInclude.forEach(file => {
    if (fs.existsSync(file)) {
      archive.file(file, { name: file });
    }
  });
  
  // Add README
  const readmeContent = `# MTXO Labs EdTech Platform

A next-generation learning platform with a futuristic UI, featuring:
- Course Module System with immersive text-based learning
- Interactive quiz components with glassmorphism styling
- Student-instructor communication through the Solve with Prof feature
- Profile management and course progress tracking
- Mock API system with easy toggle between mock and real APIs

## Key Features
- Built with React, TailwindCSS, and TypeScript
- Animated UI elements with Framer Motion
- Dark/light mode support
- Responsive design for all devices
- Axios-based mock API system

## Setup Instructions
1. Install dependencies: \`npm install\`
2. Start the development server: \`npm run dev\`
3. Access the application at http://localhost:5000

## API Configuration
The application uses a mock API system by default. To switch to a real API:
1. Open \`client/src/lib/api/config.ts\`
2. Set \`useMock = false\` and update \`API_BASE_URL\` to your API endpoint

Created by MTXO Labs
`;
  
  archive.append(readmeContent, { name: 'README.md' });
  
  // Finalize the archive
  archive.finalize();
  
  // When the zip is fully written, return the download URL
  output.on('close', () => {
    console.log('Archive created:', archive.pointer() + ' total bytes');
    res.json({
      success: true,
      message: 'Archive created successfully',
      downloadUrl: '/mtxo_labs_edtech.zip'
    });
  });
}

// Export a standalone function to create the zip without serving it
export function generateZipFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create public dir if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Define file path for the zip
    const zipFilePath = path.join(publicDir, 'mtxo_labs_edtech.zip');
    
    // Create a write stream
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Listen for errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      reject(err);
    });
    
    // Stream archive data to the file
    archive.pipe(output);
    
    // Add directories to the archive
    const directoriesToInclude = [
      { source: 'client', destPath: 'client' },
      { source: 'public/mock', destPath: 'public/mock' },
      { source: 'shared', destPath: 'shared' }
    ];
    
    // Add files to the archive
    const filesToInclude = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'components.json',
      'drizzle.config.ts'
    ];
    
    // Add directories
    directoriesToInclude.forEach(({ source, destPath }) => {
      if (fs.existsSync(source)) {
        archive.directory(source, destPath);
      }
    });
    
    // Add individual files
    filesToInclude.forEach(file => {
      if (fs.existsSync(file)) {
        archive.file(file, { name: file });
      }
    });
    
    // Add README
    const readmeContent = `# MTXO Labs EdTech Platform

A next-generation learning platform with a futuristic UI, featuring:
- Course Module System with immersive text-based learning
- Interactive quiz components with glassmorphism styling
- Student-instructor communication through the Solve with Prof feature
- Profile management and course progress tracking
- Mock API system with easy toggle between mock and real APIs

## Key Features
- Built with React, TailwindCSS, and TypeScript
- Animated UI elements with Framer Motion
- Dark/light mode support
- Responsive design for all devices
- Axios-based mock API system

## Setup Instructions
1. Install dependencies: \`npm install\`
2. Start the development server: \`npm run dev\`
3. Access the application at http://localhost:5000

## API Configuration
The application uses a mock API system by default. To switch to a real API:
1. Open \`client/src/lib/api/config.ts\`
2. Set \`useMock = false\` and update \`API_BASE_URL\` to your API endpoint

Created by MTXO Labs
`;
    
    archive.append(readmeContent, { name: 'README.md' });
    
    // Finalize the archive
    archive.finalize();
    
    // When the zip is fully written, return the file path
    output.on('close', () => {
      console.log('Archive created:', archive.pointer() + ' total bytes');
      resolve(zipFilePath);
    });
  });
}