# JavaScript Object Query Object

OQO is a package which can help you to query from JavaScript objects. It is inspired by SQL.

* [npm](https://www.npmjs.com/package/oqo)
* [GitHub](https://github.com/rulyox/oqo) 

## Installation

```shell script
npm install oqo
```

## Example

### Usage
```javascript
const OQO = require('oqo');

const people = [
    { name: 'John', age: 25, gender: 'male' },
    { name: 'Alice', age: 14, gender: 'female' },
    { name: 'Bob', age: 19, gender: 'male' },
    { name: 'Charlie', age: 20, gender: 'female' },
    { name: 'David', age: 21, gender: 'male' }
];

const result = OQO
    .select(['name', 'gender'])
    .from(people)
    .where('age >= 20')
    .run();

console.log(result);
```

### Result
```javascript
[
  { name: 'John', gender: 'male' },
  { name: 'Charlie', gender: 'female' },
  { name: 'David', gender: 'male' }
]
```
