# MySQL数据同步工具使用说明

本项目使用 qin-cdc 进行MySQL数据同步。qin-cdc 是一个基于 Go 语言开发的 MySQL CDC（变更数据捕获）工具。

## 前置要求

1. 安装 Go 环境（1.16或更高版本）
```bash
# MacOS
brew install go

# Linux
wget https://golang.org/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

2. 确保源数据库开启了binlog
```sql
SHOW VARIABLES LIKE 'log_bin';
```

## 安装步骤

1. 克隆 qin-cdc 仓库：
```bash
git clone https://github.com/sqlpub/qin-cdc.git
```

2. 编译 qin-cdc：
```bash
chmod +x build-cdc.sh
./build-cdc.sh
```

3. 配置同步参数：
编辑 `qin-cdc/config.yaml` 文件，根据需要修改数据库连接信息。

4. 启动同步：
```bash
chmod +x start-cdc.sh
./start-cdc.sh
```

## 监控

qin-cdc 提供了 Prometheus 格式的监控指标，可以通过访问 http://localhost:9100/metrics 查看。

## 常见问题

1. 如果遇到权限问题，请确保数据库用户具有以下权限：
```sql
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'your_user'@'%';
```

2. 如果需要重置同步位置，可以修改配置文件中的 binlog 位置信息。

3. 如果遇到连接问题，请检查：
   - 数据库连接信息是否正确
   - 防火墙设置
   - 数据库用户权限

## 日志

同步日志默认输出到标准输出，可以通过以下命令查看：
```bash
./start-cdc.sh > cdc.log 2>&1 &
tail -f cdc.log
``` 