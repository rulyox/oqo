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
    { name: 'John',     age: 25,    gender: 'male'   },
    { name: 'Alice',    age: 14,    gender: 'female' },
    { name: 'Bob',      age: 19,    gender: 'male'   },
    { name: 'Charlie',  age: 20,    gender: 'female' },
    { name: 'David',    age: 21,    gender: 'male'   }
];

const result = OQO
    .select(['name', 'gender'])
    .from(people)
    .where('age >= 20')
    .order('age', 'desc')
    .run();

console.log(result);
```

### Result
```javascript
[
    { name: 'John',     gender: 'male'   },
    { name: 'David',    gender: 'male'   },
    { name: 'Charlie',  gender: 'female' }
]
```

## Details

### select
`select` is always needed. An array of keys should be passed.

### from
`from` is always needed. A single object or an array of objects is needed. The objects should have the keys listed in `select`.

### where
`where` can be used to give a condition. The condition should look like `key operator operand`(2 spaces are necessary). Currently, 5 operators (`>`, `>=`, `=`, `<`, `<=`) are supported.

### order
`order` can be used to order the result objects by a key. `asc` or `desc` should be passed as a second value.

### run
`run` is used to finish the query and get the results.
