import { LogLevel } from './log-level';
import { LogEntry } from './log-entry';
import { LogBokAppenders } from './logbok-appenders';

export class Logger {
    constructor(private scope: string, private logLevelThreshold: LogLevel) {
        this.configureLogLevels();
    }

    debug(message: string, ...optionalParams: any[]) {}
    info(message: string, ...optionalParams: any[]) {}
    warn(message: string, ...optionalParams: any[]) {}
    error(message: string, ...optionalParams: any[]) {}

    disable () {
        Object.keys(LogLevel).forEach((logLevel: string) => {
            this[logLevel] = () => {};
        });
    }

    enable() {
        this.configureLogLevels();
    }

    configureLogLevels(newLogLevelThreshold: LogLevel = this.logLevelThreshold) {
        Object.keys(LogLevel).forEach((logLevel: string) => {
            this[logLevel] = (msg: string, ...optionalParams: any[]) => {
                if (LogLevel[logLevel] >= newLogLevelThreshold) {
                    this.createLog(msg, LogLevel[logLevel], ...optionalParams);
                }
            }
        });
    }

    private createLog(msg: any, level: LogLevel, ...params: any[]): void {
        LogBokAppenders.log(new LogEntry(this.scope, msg, level, params));
    }
}
