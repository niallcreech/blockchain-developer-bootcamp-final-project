# https://github.com/niallcreech/blockchain-developer-bootcamp-final-project

Please answer the following questions. Does your project:

1. Follow this naming format: https://github.com/YOUR_GITHUB_USERNAME_HERE/blockchain-developer-bootcamp-final-project? [**YES**]

2. Contain a README.md file which describes the project, describes the directory structure, and where the frontend project can be accessed? [**YES**]
    - [x] Describes the project
    - [x] Describes the directory structure
    - [x] Where the frontend project can be accessed?

3. Contain smart contract(s) which [YES]
    - [x] Are commented to the specs described by NatSpec Solidity documentation
    - [x] Use at least two design patterns from the "Smart Contracts" section
        - Inheritance of Openzeppelin contracts for ownable and Pausable.
        - Access Control using restriction of some functionality to owner, blocking on pausing the contract, user bans on certain functions as well as backoff time blocking on voting mechanism.

    - [x] Protect against two attack vectors from the "Smart Contracts" section with its the SWC number
           - SafeMath mitigated by pragma requiring > 0.8.0, https://swcregistry.io/docs/SWC-101
        - Limit looping to a max to avoid DoS through out of gas https://swcregistry.io/docs/SWC-128
       - Deploy with same compiler version https://swcregistry.io/docs/SWC-103
    - [x] Inherits from at least one library or interface. [Uses 'Owner', 'Pausable' from OpenZepellin]
    - [x] Can be easily compiled, migrated and tested? [See 'scripts' directory]

4. Contain a Markdown files named...? [**YES**]
    - [x] design_pattern_decisions.md
    - [x] avoiding_common_attacks.md

5. Have at least five smart contract unit tests that pass? [**YES**]

6. Contain a `deployed_address.txt` file which contains the testnet address and network where your contract(s) have been deployed? [**YES**]

7. Have a frontend interface built with a framework like React or HTML/CSS/JS that:  [**YES**]
    - [x] Detects the presence of MetaMask
    - [x] Connects to the current account
    - [x] Displays information from your smart contract
    - [x] Allows a user to submit a transaction to update smart contract state
    - [x] Updates the frontend if the transaction is successful or not?

8. Hosted on Heroku, Netlify, or some other free frontend service that gives users a public interface to your decentralized application? (That address should be in your README.md document)  [**YES**]
      - Deployed to Dfinity IC through Fleek 

9. Have a folder named scripts which contains these scripts:  [**YES**]
    - [x] `scripts/bootstrap` - When run locally, it builds or checks for the dependencies of your project.
    - [x] `scripts/server` - Spins up a local testnet and server to serve your decentralized application locally
    - [x] `scripts/tests` - Used to run the test suite for your project?

10. A screencast of you walking through your project? [**YES**]

Congratulations on finishing your final project!

