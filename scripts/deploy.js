#!/usr/bin/env node

/**
 * Deployment script for Genius Online Navigator
 * 
 * This script automates the deployment process to different environments
 * (development, staging, production) using Netlify CLI.
 * 
 * Usage:
 *   node scripts/deploy.js [environment] [--draft]
 * 
 * Examples:
 *   node scripts/deploy.js staging
 *   node scripts/deploy.js production
 *   node scripts/deploy.js staging --draft
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const ENVIRONMENTS = {
  development: {
    name: 'Development',
    siteId: process.env.NETLIFY_DEV_SITE_ID,
    buildCommand: 'npm run build:dev',
    envFile: '.env.development'
  },
  staging: {
    name: 'Staging',
    siteId: process.env.NETLIFY_STAGING_SITE_ID,
    buildCommand: 'npm run build:staging',
    envFile: '.env.staging'
  },
  production: {
    name: 'Production',
    siteId: process.env.NETLIFY_PRODUCTION_SITE_ID,
    buildCommand: 'npm run build:production',
    envFile: '.env.production'
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0] || 'staging';
const isDraft = args.includes('--draft');

// Validate environment
if (!ENVIRONMENTS[environment]) {
  console.error(`Error: Invalid environment "${environment}". Valid options are: ${Object.keys(ENVIRONMENTS).join(', ')}`);
  process.exit(1);
}

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: Netlify CLI is not installed. Please install it with: npm install -g netlify-cli');
  process.exit(1);
}

// Check if user is logged in to Netlify
try {
  execSync('netlify status', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: You are not logged in to Netlify. Please login with: netlify login');
  process.exit(1);
}

// Check if environment variables are set
const envConfig = ENVIRONMENTS[environment];
if (!envConfig.siteId) {
  console.error(`Error: Netlify site ID for ${envConfig.name} environment is not set.`);
  console.error(`Please set the NETLIFY_${environment.toUpperCase()}_SITE_ID environment variable.`);
  process.exit(1);
}

// Check if .env file exists
const envFilePath = path.join(process.cwd(), envConfig.envFile);
if (!fs.existsSync(envFilePath)) {
  console.error(`Error: Environment file ${envConfig.envFile} not found.`);
  console.error(`Please create the file with the required environment variables.`);
  process.exit(1);
}

// Start deployment process
console.log(`\n🚀 Deploying to ${envConfig.name} environment...\n`);

try {
  // Build the application
  console.log(`📦 Building application for ${envConfig.name}...`);
  execSync(envConfig.buildCommand, { stdio: 'inherit' });

  // Deploy to Netlify
  console.log(`\n🌐 Deploying to Netlify...`);
  
  const deployCommand = isDraft
    ? `netlify deploy --dir=dist --site=${envConfig.siteId}`
    : `netlify deploy --dir=dist --prod --site=${envConfig.siteId}`;
  
  execSync(deployCommand, { stdio: 'inherit' });

  // Success message
  const deployType = isDraft ? 'Draft' : 'Production';
  console.log(`\n✅ ${deployType} deployment to ${envConfig.name} completed successfully!`);
  
  if (isDraft) {
    console.log('\n⚠️  This is a draft deployment. To deploy to production, run the command without the --draft flag.');
  }
  
  if (environment === 'production') {
    // Create a deployment record
    const deploymentRecord = {
      date: new Date().toISOString(),
      environment: 'production',
      version: require('../package.json').version,
      user: execSync('git config user.name').toString().trim()
    };
    
    const deploymentsDir = path.join(process.cwd(), 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }
    
    const deploymentFile = path.join(deploymentsDir, `deployment-${deploymentRecord.date.replace(/:/g, '-')}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentRecord, null, 2));
    
    console.log('\n📝 Deployment record created.');
  }
} catch (error) {
  console.error(`\n❌ Deployment failed: ${error.message}`);
  process.exit(1);
}
