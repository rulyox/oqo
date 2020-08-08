const OQO = require('./dist');

const people = [
    { name: 'John',     age: 25,    gender: 'male'   },
    { name: 'Alice',    age: 14,    gender: 'female' },
    { name: 'Bob',      age: 19,    gender: 'male'   },
    { name: 'Charlie',  age: 20,    gender: 'female' },
    { name: 'David',    age: 21,    gender: 'male'   }
];

const result = OQO
    .select('name gender')
    .from(people)
    .where('age >= 20')
    .order('age', 'desc')
    .run();

console.log(result);
