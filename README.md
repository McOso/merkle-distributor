# @pooltogether/merkle-distributor - Amended Uniform Distribution

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
3. Now we need a list of the addresses that are still owed POOL and how much POOL they are owed. To do this we will generate the `new_dist_list.csv` file by running: 
```sh
$ ts-node ./scripts/create_dist.ts 
```
> This may take a minute so please be patient.

4. Now that we have our `new_dist_list.csv` file in our project we need a json file of the distribution that we can feed into the `generate-merkle-root.ts` script. To do this run:
```sh
$ ts-node ./scripts/parse_csv.ts -i new_dist_list.csv > dist_results.json
```
5. We can now pass our `dist_results.json` into the `generate-merkle-root.ts` script to generate merkle proof blob:
```sh
$ ts-node ./scripts/generate-merkle-root -i dist_results.json > merkle-proof.generated.json
```
6. Compare your proof to the committed merkle tree:
```sh
$ diff merkle-proof.generated.json merkle_tree.json
```
You will not see any differences!

You can also compare your `new_dist_list.csv` to the work done by Taliskye in his [Workbook](https://docs.google.com/spreadsheets/d/1dLuFhQ7nPBE0BRVHAZHgfTeNECXz69HAZU3Hrf2QvH0/edit#gid=341897929)


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

# Claiming Tokens - Etherscan

Right now the only way to claim tokens is to interact directly with the MerkleDistributor contract via Etherscan.

## How to Claim - Rinkeby TESTNET
1. Find your address in the [merkle_tree.json](https://github.com/McOso/merkle-distributor/blob/uniform-dist/merkle_tree.json) file in this project. You will need the index, amount, and proof values.
2. Go to the Contract > Write Contract section of the [MerkleDistributor](https://rinkeby.etherscan.io/address/0x0d9b3830b583A2c9c7191FF9792bEa6c722d3F0E#writeContract) contract on Etherscan Rinkeby and click 'Connect to Web3' to connect to your wallet.
3. Click the claim button and fill in the fields with the information you found in Step 1. (Important: For the 'merkleProof (bytes32[])' field enter the proof value you found in Step 1 but with no quotes or spaces.)
4. Then click 'Write', pay the gas, and you will find the appropriate amount of WEENUS tokens in your wallet.

You can also check to see if an address has already claimed their tokens by going to the Contract > Read Contract section and entering the index of the address into the isClaimed query.