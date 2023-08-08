export class ContractMethodRequest {
    public constructor(
        public chain: string,
        public eventName: string,
        public methodName: string,
        public x?: number,
        public y?: number,
    ) {}

    static create(chain: string, eventName: string, methodName: string) {
        return new ContractMethodRequest(
            chain, eventName, methodName
        );
    }

    withX(x: number) {
        this.x = x;
        return this;
    }

    withY(y: number) {
        this.y = y;
        return this;
    }

    getOptionalValues(): any[] {
        let optionalValues: any[] = [];
        if (this.x != null) {
            optionalValues.push(this.x);
        }
        if (this.y != null) {
            optionalValues.push(this.y);
        }
        console.log('getOptionalValues: GameAPI getOptionalValues = ', optionalValues);
        return optionalValues;
    }
}
