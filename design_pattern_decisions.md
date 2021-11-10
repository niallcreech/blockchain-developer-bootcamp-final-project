# Design Pattern Decisions 

## High-level design

![High-level diagram of the application architecture](./tracks_archtecture.jpg)

## Platforming

Dfinity ICP

## Security 

### Loop capping
Limit looping to a max to avoid DoS through out of gas https://swcregistry.io/docs/SWC-128

### Compiler compatibility
Deploy with same compiler version https://swcregistry.io/docs/SWC-103
    
### Safe Math

SafeMath mitigated by pragma requiring > 0.8.0, https://swcregistry.io/docs/SWC-101

[Solidity version > 0.8.0](https://soliditydeveloper.com/solidity-0.8) has safe maths operations by default. 

## Access controls and protections

Inheritance of Openzeppelin contracts for ownable and Pausable.

Access Control using restriction of some functionality to owner, blocking on pausing the contract, user bans on certain functions as well as backoff time blocking on voting mechanism.
    
### Ownable function protection

### Pausable contract execution protection

### Time-blocking spamming protection

### One-time vote protection


## Future reworks

### Proxy Pattern

[OpenZeppelin: Proxy Upgrade Pattern](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies?utm_source=zos&utm_medium=blog&utm_campaign=proxy-pattern)


