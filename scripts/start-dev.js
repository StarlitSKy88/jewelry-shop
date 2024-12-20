const { spawn } = require('child_process');
const path = require('path');

// 定义颜色
const colors = {
  frontend: '\x1b[36m', // 青色
  backend: '\x1b[35m',  // 紫色
  reset: '\x1b[0m'      // 重置
};

function startService(name, command, cwd) {
  const [cmd, ...args] = command.split(' ');
  const process = spawn(cmd, args, {
    cwd: path.join(__dirname, '..', cwd),
    shell: true,
    stdio: 'pipe'
  });

  process.stdout.on('data', (data) => {
    console.log(`${colors[name]}[${name}] ${data.toString()}${colors.reset}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`${colors[name]}[${name}] ${data.toString()}${colors.reset}`);
  });

  process.on('close', (code) => {
    console.log(`${colors[name]}[${name}] 进程退出，退出码 ${code}${colors.reset}`);
  });

  return process;
}

console.log('启动开发环境...');

// 启动后端服务
const backend = startService('backend', 'npm run dev', 'server');

// 启动前端服务
const frontend = startService('frontend', 'npm run dev', 'client');

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n正在关闭所有服务...');
  backend.kill();
  frontend.kill();
  process.exit();
}); 