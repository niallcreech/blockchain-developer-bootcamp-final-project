# TODO

* Wallet connection assumes metamask and automatically connects. This should really not be automatic, the user might not need to modify the chain.
    - Add a 'Connect wallet' functionality with the ability to use other wallet types.
    - Only call wallet connect when needing to create tracks, vote, etc
    - Use Infura or similar to getTracks and other read functions.

* Move event querying off-chain and into The Graph or similar indexer.
    - If use is high, its likely event querying for elements such as votes, will become non-performant. We can add an indexer to The Graph and move those queries to there instead. 

* Owner roles are too simplistic.
    - One owner at the moment controls all admin functionality. We can move this to a broader range of roles for maintenance etc through Open Zeppelin access roles.

* Batching transactions to save some  $$$

