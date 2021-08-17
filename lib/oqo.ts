export class OQO {
	private selectList: string[];
	private isSelectAll: boolean;
	private AllOfObjectKeys: string[];
	private objectList: any[];

	constructor() {
		this.selectList = [];
		this.objectList = [];
		this.AllOfObjectKeys = [];
		this.isSelectAll = false;
	}

	select(selectList: string | string[]): OQO {
		if (Array.isArray(selectList)) {
			this.selectList = selectList;
		} else {
			if (selectList !== '*') {
				this.selectList = selectList.replace(/ /gi, '').split(',');
			} else {
				this.isSelectAll = true;
			}
		}
		return this;
	}

	from(object: any): OQO {
		if (Array.isArray(object)) {
			if (this.isSelectAll) {
				if (object.length > 0) {
					this.selectList = Object.keys(object[0]);
				} else {
					// error test
					throw new Error('FROM clause needs an object or an array of objects!');
				}
			}
			this.AllOfObjectKeys = Object.keys(object[0]);
			// check if object array
			object.forEach((item) => {
				if (typeof item !== 'object') throw new Error('FROM clause needs an object or an array of objects!');
			});

			this.objectList = object;
		} else {
			if (this.isSelectAll) {
				this.selectList = Object.keys(object[0]);
				this.AllOfObjectKeys = Object.keys(object[0]);
			}
			// check if single object
			if (typeof object === 'object') this.objectList = [object];
			else throw new Error('FROM clause needs an object or an array of objects!');
		}

		return this;
	}

	where(condition: string): OQO {
		let condition_type: any;
		// parse condition
		let condition_control: string = '';
		if (condition.search('>') !== -1) {
			if (condition.search('>=') !== -1) {
				condition_control = '>=';
			} else {
				condition_control = '>';
			}
		} else if (condition.search('<') !== -1) {
			if (condition.search('<=') !== -1) {
				condition_control = '<=';
			} else {
				condition_control = '<';
			}
		} else if (condition.search('=') !== -1) {
			condition_control = '=';
		}
		const splitCondition = condition.replace(/ /gi, '').split(condition_control);

		let isValided = false;
		for (let idx = 0; idx < this.AllOfObjectKeys.length; idx++) {
			if (this.AllOfObjectKeys[idx] === splitCondition[0]) {
				isValided = true;
			}
		}
		if (!isValided) {
			throw new Error('In the WHERE clause, there should be a field on the left and a value on the right.');
		}
		if (splitCondition.length < 2) {
			throw new Error('Insufficient number of argument values in WHERE clause.');
		} else if (2 < splitCondition.length) {
			throw new Error('Over number of argument values in WHERE clause.');
		}

		const key = splitCondition[0];
		const operator = condition_control;
		let operand: any = splitCondition[1];

		this.objectList.forEach((item) => {
			// Obj List 안에 condition에 해당하는 키(필드) 값이 있는 확인
			if (item.hasOwnProperty(key)) {
				// 해당 값의 타입 기록
				if (typeof item[key] === 'object') {
					if (Array.isArray(item[key])) {
						condition_type = 'array';
					} else {
						condition_type = 'object';
					}
				} else {
					condition_type = typeof item[key];
				}
			}
		});

		switch (condition_type) {
			case 'number':
				operand = Number(operand);
				break;
			case 'string':
				operand = operand;
				break;
			case 'array':
				operand = operand.split(',');
				break;
			case 'object':
				operand = operand;
				break;
		}

		if (operator !== '>' && operator !== '>=' && operator !== '=' && operator !== '<' && operator !== '<=')
			throw new Error('WHERE clause needs to have the correct operator!');

		// create conditional statement
		let statement: any;

		switch (operator) {
			case '>':
				statement = (item: any): boolean =>
					isNaN(Number(item[`${key}`])) ? item[`${key}`] > operand : item[`${key}`] > Number(operand);

				break;

			case '>=':
				statement = (item: any): boolean =>
					isNaN(Number(item[`${key}`])) ? item[`${key}`] >= operand : item[`${key}`] >= Number(operand);

				break;

			case '=':
				statement = (item: any) =>
					condition_type == 'array'
						? JSON.stringify(item[`${key}`]) === JSON.stringify(operand)
						: item[`${key}`] == operand;

				break;

			case '<':
				statement = (item: any) =>
					isNaN(Number(item[`${key}`])) ? item[`${key}`] < operand : item[`${key}`] < Number(operand);

				break;

			case '<=':
				statement = (item: any) =>
					isNaN(Number(item[`${key}`])) ? item[`${key}`] <= operand : item[`${key}`] <= Number(operand);

				break;
		}

		// filter objects
		const objectList: any[] = [];

		this.objectList.forEach((item) => {
			if (statement(item)) objectList.push(item);
		});

		this.objectList = objectList;

		return this;
	}

	order(key: string, type: string): OQO {
		if (type !== 'asc' && type !== 'desc') throw new Error('ORDER clause needs to have the correct type!');

		const flip = type === 'asc' ? 1 : -1;
		const compare = (a: any, b: any): number => {
			if (a[`${key}`] < b[`${key}`]) return -1 * flip;
			else if (a[`${key}`] > b[`${key}`]) return flip;
			else return 0;
		};

		this.objectList = this.objectList.sort(compare);

		return this;
	}

	run(): any[] {
		const objectList: any[] = [];

		// for all objects
		this.objectList.forEach((item) => {
			const object: any = {};

			// filter selected keys
			this.selectList.forEach((key) => {
				object[`${key}`] = item[`${key}`];
			});

			objectList.push(object);
		});

		this.objectList = objectList;

		return this.objectList;
	}
}
