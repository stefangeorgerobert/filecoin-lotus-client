# Filecoin Lotus Client

# Install
```
npm i filecoin-lotus-client
```

# Usage

```
const { Lotus } = require('filecoin-lotus-client');
const lotus = new Lotus('lotus.api', 'lotus.token');

let version = await lotus.Version();
console.log(version);

version = await lotus.LotusAPI("Version", []);
```
