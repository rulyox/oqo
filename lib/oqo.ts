export class OQO {

    private selectList: string[];
    private objectList: any[];

    constructor() {
        this.selectList = [];
        this.objectList = [];
    }

    select(selectList: string[]) {

        this.selectList = selectList;

        return this;

    }

    from(object: any) {

        if(Array.isArray(object)) {

            // check if object array
            object.forEach((item) => {

                if(typeof item !== 'object') throw new Error('FROM clause needs an object or an array of objects!');

            });

            this.objectList = object;

        } else {

            // check if single object
            if(typeof object === 'object') this.objectList = [object];
            else throw new Error('FROM clause needs an object or an array of objects!');

        }

        return this;

    }

    where(condition: string) {

        // parse condition
        const splitCondition = condition.split(' ');

        if(splitCondition.length !== 3) throw new Error('WHERE clause needs to have two spaces!');

        const column = splitCondition[0];
        const operator = splitCondition[1];
        const operand = splitCondition[2];

        if(operator !== '>' && operator !== '>=' && operator !== '=' && operator !== '<' && operator !== '<=') throw new Error('WHERE clause needs to have the correct operator!');

        // create conditional statement
        let statement: any;

        switch(operator) {
            case '>':
                statement = (item: any): boolean => isNaN(Number(item[`${column}`])) ?
                    item[`${column}`] > operand :
                    item[`${column}`] > Number(operand);

                break;

            case '>=':
                statement = (item: any): boolean => isNaN(Number(item[`${column}`])) ?
                    item[`${column}`] >= operand :
                    item[`${column}`] >= Number(operand);

                break;

            case '=':
                statement = (item: any) => isNaN(Number(item[`${column}`])) ?
                    item[`${column}`] === operand :
                    item[`${column}`] === Number(operand);

                break;

            case '<':
                statement = (item: any) => isNaN(Number(item[`${column}`])) ?
                    item[`${column}`] < operand :
                    item[`${column}`] < Number(operand);

                break;

            case '<=':
                statement = (item: any) => isNaN(Number(item[`${column}`])) ?
                    item[`${column}`] <= operand :
                    item[`${column}`] <= Number(operand);

                break;
        }

        // filter objects
        const objectList: any[] = [];

        this.objectList.forEach((item) => {

            if(statement(item)) objectList.push(item);

        });

        this.objectList = objectList;

        return this;

    }

    run() {

        const objectList: any[] = [];

        // for all objects
        this.objectList.forEach((item) => {

            const object: any = {};

            // filter selected columns
            this.selectList.forEach((column) => {

                object[`${column}`] = item[`${column}`];

            });

            objectList.push(object);

        });

        this.objectList = objectList;

        return this.objectList;

    }

}
