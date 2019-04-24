import { LogEntry } from './log-entry';

export namespace LogBokAppenders {
    let appenders: Map<string, Appender> = new Map();

    export function register(name: string, appender: Appender) {
        appenders.set(name, appender);
    }

    export function unregister(name: string) {
        appenders.delete(name);
    }

    export function log(logEntry: LogEntry) {
        appenders.forEach((appender: Appender) => {
            if (appender) {
                appender.log(logEntry);
            }
        });
    }
}

export interface Appender {
    appenderName: string;
    log(logEntry: LogEntry): void;
}
