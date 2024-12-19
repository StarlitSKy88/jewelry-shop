#!/bin/bash

# 检查是否安装了Go
if ! command -v go &> /dev/null; then
    echo "请先安装Go环境"
    exit 1
fi

# 进入qin-cdc目录
cd qin-cdc

# 编译
go build -o bin/qin-cdc cmd/main.go

echo "编译完成" 