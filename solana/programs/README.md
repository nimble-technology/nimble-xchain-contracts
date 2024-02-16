# Programs

xchain_token
   - send/receive using Wormhole token message
```
.
├── README.md
└── xchain_token
    ├── Cargo.toml
    ├── Xargo.toml
    └── src
        ├── context.rs                 # imp send & redeem instructions
        ├── error.rs 
        ├── lib.rs                     # register foreigner emitter, transfer with payload
        ├── message.rs
        └── state                      # sender & redeem imp & register
```
