import { Appender } from '../logbok-appenders';
import { LogEntry } from '..';

export class IsoTimestampAppender implements Appender {
    readonly appenderName: string = 'IsoTimestampAppender';

    log(logEntry: LogEntry): void {
        console.log(logEntry.buildLogString(logEntry.timestamp.toISOString()));
    }
}
