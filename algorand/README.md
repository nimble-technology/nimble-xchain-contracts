# Smart Contracts for Algorand xChain Token Transfer

```
algorand
├── README.md                 // algorand smart contract readme
├── config                    // algorand smart contract config
    ├── mainnet-prod          // mainnet production config
    ├── mainnet-test          // mainnet test config
    ├── config-base.libsonnet // base config
├── contracts                 // algorand smart contract business logic & unit tests
├── scripts                   // bash scripts for env setup etc.
├── ts                        // cli tools for deployment etc.
└── testing                   // algorand smart contract integration tests
```

### Prerequisites

```
#Prerequisite1: Docker
/bin/bash -c "$(curl -fsSL https://get.docker.com)"

#Prerequisite2: Python 3.6 or higher
brew install python@3.9

# Algorand provides a docker instance for tunning a node, to spin up, start the sandbox
./scripts/install-sandbox.sh up

# setup Python3 environment and activate it
python3 -m venv venv
. venv/bin/activate

#install the dependencies
pip3 install -r requirements.txt
```

### Build and Test
```
# run unit tests
pytest

# shutdown sandbox
./scripts/install-sandbox.sh down
```

### References
1. [Algorand pyteal demo](https://developer.algorand.org/docs/get-started/dapps/pyteal/)
2. [Pyteal documentation](https://pyteal.readthedocs.io/en/latest/data_type.html)
