import { LogLevel } from './log-level';

export class LogEntry {
    public readonly timestamp: Date;

    constructor(
        public readonly scope: string,
        public readonly message: string,
        public readonly level: LogLevel,
        public readonly params: any[]
    ) {
        this.message = message;
        this.level = level;
        this.params = params;
        this.timestamp = new Date();
    }

    buildLogString(timestamp: string = this.toDefaultTimestampFormat(this.timestamp)): string {
        let logString = (timestamp && timestamp.length ? timestamp + ' ' : '') + LogLevel[this.level].toUpperCase() + ' ';
        logString += '[' + this.scope + '] - ';
        logString += this.createMessage(this.message);
        return this.formatMessage(logString, this.params);
    }

    private formatMessage(logString: string, params: any[]): string {
        let count = 0;
        let message = logString.replace(/\%([dfisoDFISO])/g, (match, id) => {
            return this.formatParam(match, id, params[count++]);
        });

        if (params.length !== count) {
            let extraParams = ' ';
            if (params.some(param => typeof param === 'object')) {
                for (const item of params.slice(count)) {
                    extraParams += JSON.stringify(item) + ' ';
                }
            }
            message += extraParams;
        }
        return message;
    }

    private formatParam(match: string, id: string, param: any): any {
        if (typeof param === 'undefined' || param === null) {
            return match;
        }

        switch (id.toLowerCase()) {
            case 'o':
                return typeof param === 'object' ? JSON.stringify(param) : param;
            case 'd': case 'i':
                return parseInt(param, 10);
            case 'f':
                return +param;
            case 's':
                return param.toString();
            default:
                return param;
        }
    }

    private createMessage(msg: any): string | undefined {
        if (typeof msg === 'object') {
            if (msg instanceof Error) {
                return msg.stack;
            }
            return JSON.stringify(msg);
        }
        return msg;
    }

    private toDefaultTimestampFormat(date: Date): string {
        let timestamp = '';
        const hour = this.addZero(date.getHours(), 2);
        const minutes = this.addZero(date.getMinutes(), 2);
        const seconds = this.addZero(date.getSeconds(), 2);
        const milliseconds = this.addZero(date.getMilliseconds(), 3);
        const year = date.getFullYear();
        const month = this.addZero(date.getMonth() + 1, 2);
        const day = this.addZero(date.getDate(), 2);
        timestamp += month + '/' + day + '/' + year + ' - ';
        timestamp += hour + ':' + minutes + ':' + seconds + '.' + milliseconds;

        return timestamp;
    }

    private addZero(num: any, numLength: number): string {
        while (num.toString().length < numLength) {
            num = '0' + num;
        }
        return num;
    }
}
