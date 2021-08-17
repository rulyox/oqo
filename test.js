const OQO = require('./dist');

const test_data = [
	{ name: 'John', age: 25, gender: 'male' },
	{ name: 'Alice', age: 14, gender: 'female' },
	{ name: 'Bob', age: 19, gender: 'male' },
	{ name: 'Charlie', age: 20, gender: 'female' },
	{ name: 'David', age: 21, gender: 'male' },
];

const test_case_1 = OQO.select('name, gender').from(test_data).where('age >= 20').order('age', 'desc').run();

if (Array.isArray(test_case_1)) {
	if (test_case_1.length > 0) {
		if ('name, gender' === Object.keys(test_case_1[0]).join(', ')) {
			console.info('Test Case #1 Sucess!!!');
		} else {
			console.error('Test Case #1 Fail.');
		}
	} else {
		console.error('Test Case #1 Fail.');
	}
}

const test_case_2 = OQO.select('*').from(test_data).where('age >= 20').order('age', 'desc').run();

if (Array.isArray(test_case_2)) {
	if (test_case_2.length > 0) {
		if (Object.keys(test_data[0]).join(',') === Object.keys(test_case_2[0]).join(',')) {
			console.info('Test Case #2 Sucess!!!');
		} else {
			console.error('Test Case #2 Fail.');
		}
	} else {
		console.error('Test Case #2 Fail.');
	}
}

const test_case_3 = OQO.select('*').from(test_data).where('age<20').order('age', 'desc').run();

if (Array.isArray(test_case_3)) {
	if (test_case_3.length > 0) {
		if (Object.keys(test_data[0]).join(',') === Object.keys(test_case_3[0]).join(',')) {
			console.info('Test Case #3 Sucess!!!');
		} else {
			console.error('Test Case #3 Fail.');
		}
	} else {
		console.error('Test Case #3 Fail.');
	}
}

try {
	OQO.select('*').from(test_data).where('20 <= age').order('age', 'desc').run();
	console.error('Test Case #4 Fail.');
} catch (error) {
	console.info('Test Case #4 Sucess!!!');
}

try {
	OQO.select('*').from(test_data).where('20 age').order('age', 'desc').run();
	console.error('Test Case #5 Fail.');
} catch (error) {
	console.info('Test Case #5 Sucess!!!');
}
