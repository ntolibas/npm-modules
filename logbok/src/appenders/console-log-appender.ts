import { Appender } from '../logbok-appenders';
import { LogEntry } from '../log-entry';

export class ConsoleLogAppender implements Appender {
    appenderName: string = 'ConsoleLogAppender';
    log(logEntry: LogEntry): void {
        console.log(logEntry.buildLogString());
    }
}