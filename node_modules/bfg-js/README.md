# Install

```bash
npm install bfg-js
// or
yarn add bfg-js
``` 

# Usage
Set to you `resources/js/app.js` a next code:
```js
require('bfg-js');

app.provider({
    register () {
        console.log(`Run application...`);
    }
})

app.provider({
    boot () {
        console.log(`Booted application!`);
    }
})

app.boot();
```