export class OQO {
    private selectList: string[];
    private objectList: any[];

    constructor() {
        this.selectList = [];
        this.objectList = [];
    }

    select(selectList: string[]): OQO {
        this.selectList = selectList;

        return this;
    }

    from(object: any): OQO {
        if (Array.isArray(object)) {
            // check if object array
            object.forEach((item) => {
                if (typeof item !== 'object')
                    throw new Error(
                        'FROM clause needs an object or an array of objects!'
                    );
            });

            this.objectList = object;
        } else {
            // check if single object
            if (typeof object === 'object') this.objectList = [object];
            else
                throw new Error(
                    'FROM clause needs an object or an array of objects!'
                );
        }

        return this;
    }

    where(condition: string): OQO {
        // parse condition
        const splitCondition = condition.split(' ');

        if (splitCondition.length !== 3)
            throw new Error('WHERE clause needs to have two spaces!');

        const key = splitCondition[0];
        const operator = splitCondition[1];
        const operand = splitCondition[2];

        if (
            operator !== '>' &&
            operator !== '>=' &&
            operator !== '=' &&
            operator !== '<' &&
            operator !== '<='
        )
            throw new Error('WHERE clause needs to have the correct operator!');

        // create conditional statement
        let statement: any;

        switch (operator) {
            case '>':
                statement = (item: any): boolean =>
                    isNaN(Number(item[`${key}`]))
                        ? item[`${key}`] > operand
                        : item[`${key}`] > Number(operand);

                break;

            case '>=':
                statement = (item: any): boolean =>
                    isNaN(Number(item[`${key}`]))
                        ? item[`${key}`] >= operand
                        : item[`${key}`] >= Number(operand);

                break;

            case '=':
                statement = (item: any) =>
                    isNaN(Number(item[`${key}`]))
                        ? item[`${key}`] === operand
                        : item[`${key}`] === Number(operand);

                break;

            case '<':
                statement = (item: any) =>
                    isNaN(Number(item[`${key}`]))
                        ? item[`${key}`] < operand
                        : item[`${key}`] < Number(operand);

                break;

            case '<=':
                statement = (item: any) =>
                    isNaN(Number(item[`${key}`]))
                        ? item[`${key}`] <= operand
                        : item[`${key}`] <= Number(operand);

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
        if (type !== 'asc' && type !== 'desc')
            throw new Error('ORDER clause needs to have the correct type!');

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
