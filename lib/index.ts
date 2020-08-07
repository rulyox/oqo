class OQO {

    private selectList: String[];
    private objectList: any[];

    constructor() {
        this.selectList = [];
        this.objectList = [];
    }

    select(selectList: String[]) {

        this.selectList = selectList;

        return this;

    }

    from(object: any) {

        if(Array.isArray(object)) {

            object.forEach((item) => {

                if(typeof item !== 'object') throw new Error('FROM clause needs an object or an array of objects!');

            });

            this.objectList = object;

        } else {

            if(typeof object === 'object') this.objectList = [object];
            else throw new Error('FROM clause needs an object or an array of objects!');

        }

        return this;

    }

    run() {

        const objectList: any[] = [];

        this.objectList.forEach((item) => {

            const object: any = {};

            this.selectList.forEach((column) => {

                object[`${column}`] = item[`${column}`];

            });

            objectList.push(object);

        });

        return objectList;

    }

}

export = new OQO();
