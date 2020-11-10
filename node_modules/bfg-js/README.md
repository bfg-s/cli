# Install

```bash
npm install -g bfg-js
// or
yarn global add bfg-js
``` 

# Usage
Set to you `resources/js/app.js` a next code:
```js
require('bfg-js');

app.provider({
    register () {
        console.log(`Run application v${app.ver}...`);
    }
})

app.provider({
    boot () {
        console.log(`Booted application!`);
    }
})

app.boot();
```