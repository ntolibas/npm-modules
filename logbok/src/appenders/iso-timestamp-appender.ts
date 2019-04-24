import { Appender } from '../logbok-appenders';
import { LogEntry } from '..';

export class IsoTimestampAppender implements Appender {
    appenderName: string = 'NoTimestampAppender';

    log(logEntry: LogEntry): void {
        console.log(logEntry.buildLogString(logEntry.timestamp.toISOString()));
    }
}
