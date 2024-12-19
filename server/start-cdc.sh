#!/bin/bash

# 检查qin-cdc是否已编译
if [ ! -f "qin-cdc/bin/qin-cdc" ]; then
    echo "请先运行 build-cdc.sh 编译qin-cdc"
    exit 1
fi

# 启动qin-cdc
./qin-cdc/bin/qin-cdc -config qin-cdc/config.yaml 