# @pooltogether/merkle-distributor

[![Tests](https://github.com/pooltogether/merkle-distributor/workflows/Tests/badge.svg)](https://github.com/pooltogether/merkle-distributor/actions?query=workflow%3ATests)
[![Lint](https://github.com/pooltogether/merkle-distributor/workflows/Lint/badge.svg)](https://github.com/pooltogether/merkle-distributor/actions?query=workflow%3ALint)

This project contains the distribution, code, and deployment scripts for the PoolTogether retroactive token claims. The BigQuery output was generated by the [Retroactive Query](https://github.com/pooltogether/retroactive-query)

# Setup

Install Dependencies

```sh
$ yarn
```

Compile Contracts

```sh
$ yarn compile
```

Run Tests

```sh
$ yarn test
```

# Verify the output from the Retroactive Query

The file `bq-results-20210202-094742-fvr9ifm390n3.json` contains the full set of rows (ordered by address ascending) of the [Retroactive Query](https://github.com/pooltogether/retroactive-query). You can follow the steps in that project to generate this file.

In this repo the file `merkle_tree.json` is generated from the BigQuery output and fed into the contract deployment script. You can generate the merkle proof file yourself using the steps below.

## Generate Merkle Proof

First pre-process the BigQuery results (the file is missing commas):

```sh
$ ts-node ./scripts/pre-process-json.ts -i bq-results-20210202-094742-fvr9ifm390n3.json > bq-results.processed.json
```

Now generate a merkle proof blob:

```sh
$ ts-node ./scripts/generate-merkle-root -i bq-results.processed.json > merkle-proof.generated.json
```

You can compare your proof to the committed proof:

```sh
$ diff merkle-proof.generated.json merkle_tree.json
```

You will not see any differences!

# Amended Distribution: Verify output from Excel workbook

1. Go to [Workbook](https://docs.google.com/spreadsheets/d/15DrnIMgw_lICkPijL2fT9iNimzp-aJgn07Czylsi6vA/edit?pli=1#gid=1330145834) and download it as an xlsx file
2. Move this to root folder of this project and keep name as ‘Retro-Query-Fork.xlsx’
3. Generate the 'new_dist_list.csv' file: 
```sh
$ ts-node ./scripts/create_dist.ts 
```
4. Generate friendly json results:
```sh
$ ts-node ./scripts/parse_csv.ts -i new_dist_list.csv > dist_results.json
```
5. Generate merle proof blob:
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
