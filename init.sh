#!/bin/bash

dfx canister --no-wallet create --all
# init internet_identity
# dfx canister --no-wallet create internet_identity
# dfx canister --no-wallet install internet_identity --argument '(null)'
# dfx canister --no-wallet id internet_identity

#"start": "CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai II_ENV=development webpack serve ",

dfx build --all
dfx deploy --no-wallet factory
dfx deploy --no-wallet registry


#部署到线上
dfx build --network ic
dfx deploy --network ic ccc
