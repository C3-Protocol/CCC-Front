#!/bin/bash
echo 'start'
name=$1

#部署到线上
dfx build --network ic_$name ccc
dfx --identity=default canister --network ic_$name --wallet=l2hpj-jiaaa-aaaai-aahwa-cai install ccc  --mode=upgrade

#第一次部署
#dfx canister --network ic create ccc 
#dfx deploy --network ic ccc
