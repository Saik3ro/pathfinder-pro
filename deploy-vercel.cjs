const { execSync } = require('child_process');

console.log('🚀 Starting Vercel deployment...');

try {
  // Try to deploy using Vercel CLI with different approach
  const deploy = execSync('npx vercel --prod --no-deploy', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log(deploy.stdout);
  console.log('✅ Deployment completed!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
