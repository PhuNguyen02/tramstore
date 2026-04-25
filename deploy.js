const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deploy() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '103.69.96.183',
      username: 'root',
      password: 'pTtOLLtsX2WYXCbw'
    });
    console.log('Connected!');

    const commands = [
      'apt-get update',
      'apt-get install -y docker.io docker-compose git',
      'if [ -d "tramstore" ]; then cd tramstore && git pull; else git clone https://github.com/PhuNguyen02/tramstore.git; fi',
      'cd tramstore && docker-compose build',
      'cd tramstore && docker-compose up -d'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const result = await ssh.execCommand(cmd);
      console.log('STDOUT:', result.stdout);
      if (result.stderr) console.error('STDERR:', result.stderr);
    }

    console.log('Deployment successful!');
    process.exit(0);
  } catch (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  }
}

deploy();
