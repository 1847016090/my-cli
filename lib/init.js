const { promisify } = require("util");

const figlet = promisify(require("figlet")); // 字符画
const clear = require("clear"); // 清屏
const chalk = require("chalk"); // 改变输出log颜色的工具
const inquirer = require("inquirer"); // 改变输出log颜色的工具

const log = content => console.log(chalk.green(content)); // 封装console

async function clone(repo, desc) {
  const download = promisify(require("download-git-repo")); // 从git下载仓库
  const ora = require("ora"); // 命令行显示加载效果
  const process = ora(`downing ${repo}....`);
  process.start();
  await download(repo, desc);
  process.succeed();
}

var promptList = [
  {
    type: "list",
    name: "type",
    message: "请选择拉取的模板类型: ",
    choices: [
      {
        name: "ci",
        value: {
          url: "1847016090/testGithubActions",
          gitName: "testGithubActions",
          val: "ci模版"
        }
      },
      {
        name: "react",
        value: {
          url: "1847016090/2021-webpack-biz",
          gitName: "webpack-biz",
          val: "react模版"
        }
      }
    ]
  }
];

const spawn = async (...args) => {
  const { spawn } = require("child_process"); //原生包的子进程
  return new Promise(resolve => {
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout); //子进程的输出流与主进程相对接  为了打印子进程的日志
    proc.stderr.pipe(process.stderr); //错误流
    proc.on("close", () => {
      resolve();
    });
  });
};

module.exports = async name => {
  clear();
  // 输出欢迎界面
  const figlet_data = await figlet("STE-CLI");
  log(figlet_data);
  inquirer.prompt(promptList).then(async result => {
    const { url, gitName, val } = result.type;
    await clone(`github:${url}`, name);
    log(`已下载${gitName}（${val}）项目，正在安装依赖...`);
    await spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["install"], {
        cwd: `./${name}`
      });
      log(`
        😏安装完成：
        ==============
        cd ${name}
        npm run dev
        ==============
        `);
    
      await spawn(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["run", "dev"],
        { cwd: `./${name}` }
      );
      open("http://localhost:8080");
  });
};
