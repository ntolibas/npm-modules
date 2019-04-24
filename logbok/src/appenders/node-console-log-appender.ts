import { Appender } from '../logbok-appenders';
import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-level';

export class NodeConsoleLogAppender implements Appender {
    appenderName: string = 'NodeConsoleLogAppender';

    log(logEntry: LogEntry) {
        const logStringWithStyleSpecifier = '%s' + logEntry.buildLogString() + '%s';
        console.log(logStringWithStyleSpecifier, this.getColorStyle(logEntry.level), this.getColorStyle(-1));
    }

    private getColorStyle(level: LogLevel): string {
        switch (level) {
            case 0:
                return '\x1b[34m';  // fgBlue
            case 1:
                return '\x1b[32m';  // fgGreen
            case 2:
                return '\x1b[33m';  // fgYellow
            case 3:
                return '\x1b[31m';  // fgRed
            default:
                return '\x1b[0m';   // reset
        }
    }
}