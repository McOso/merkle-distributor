# @pooltogether/merkle-distributor - Amended Distribution

This project contains the distribution, code, and deployment scripts for the PoolTogether retroactive token claims for the amended distribution. This is needed since not all users received the correct amount of POOL tokens on the initial airdrop. Please visit [POOL Gov](https://gov.pooltogether.com/t/pool-token-airdrop-for-pod-users-who-should-have-qualified/269) for more information.

After the initial airdrop, PT Inc. found a bug in the original retroactive query code where USDC and DAI Pod users were not getting compensated correctly. They fixed the bug and generated ‘Retro-Query-Fork’ workbook [https://docs.google.com/spreadsheets/d/15DrnIMgw_lICkPijL2fT9iNimzp-aJgn07Czylsi6vA/edit?pli=1#gid=1330145834](https://docs.google.com/spreadsheets/d/15DrnIMgw_lICkPijL2fT9iNimzp-aJgn07Czylsi6vA/edit?pli=1#gid=1330145834). This workbook contains the list of missing USDC and DAI POD users, distribution data from the original airdrop (‘retro-query’), and what the true airdrop should have been (‘retro-query-fork’). This project uses this workbook to generate the new amended distribution list.


# Setup

Install Dependencies

```sh
$ yarn
```

Compile Contracts

```sh
$ yarn compile
```

# Verify output from Excel workbook
In this repo the file `merkle_tree.json` is generated from the Retro-Query-Fork.xlsx file and fed into the contract deployment script. You can generate the merkle proof file yourself using the steps below.


1. Go to [Workbook](https://docs.google.com/spreadsheets/d/15DrnIMgw_lICkPijL2fT9iNimzp-aJgn07Czylsi6vA/edit?pli=1#gid=1330145834) and download it as an xlsx file
2. Move this xlsx file to the root folder of this project and keep the filename as ‘Retro-Query-Fork.xlsx’
3. Generate the 'new_dist_list.csv' file by running: 
```sh
$ ts-node ./scripts/create_dist.ts 
```
4. Generate friendly json file by running:
```sh
$ ts-node ./scripts/parse_csv.ts -i new_dist_list.csv > dist_results.json
```
5. Generate merkle proof blob:
```sh
$ ts-node ./scripts/generate-merkle-root -i dist_results.json > merkle-proof.generated.json
```
6. Compare your proof to the committed merkle tree:
```sh
$ diff merkle-proof.generated.json merkle_tree.json
```
You will not see any differences!

You can also compare your 'new_dist_list.csv' to the work done by Taliskye in his [Workbook](https://docs.google.com/spreadsheets/d/1dLuFhQ7nPBE0BRVHAZHgfTeNECXz69HAZU3Hrf2QvH0/edit#gid=341897929)


# Deploy the Contract

The contract deployment script consumes the `merkle_tree.json` file as the distribution. Make sure this file exists before running the deploy script.

You can deploy to rinkeby:

```sh
$ yarn deploy rinkeby
```

Or you can deploy to mainnet:

```sh
$ yarn deploy mainnet
```
