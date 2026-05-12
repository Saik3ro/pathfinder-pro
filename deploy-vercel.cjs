const { execSync } = require('child_process');

console.log('🚀 Starting Vercel deployment...');

try {
  // Deploy using Vercel CLI with correct options
  const deploy = execSync('npx vercel --prod', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log(deploy.stdout);
  console.log('✅ Deployment completed!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
