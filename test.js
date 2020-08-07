const OQO = require('./dist');

let people = [
    { name: 'John', age: 25, gender: 'male' },
    { name: 'Alice', age: 14, gender: 'female' },
    { name: 'Bob', age: 19, gender: 'male' }
];

const query = OQO
    .select(['name', 'gender'])
    .from(people)
    .run();

console.log(query);
