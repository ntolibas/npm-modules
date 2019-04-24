import { LogLevel } from '../log-level';
import { LogEntry } from '../log-entry';
import { Appender } from '../logbok-appenders';

export class ChromeConsoleLogAppender implements Appender {
    appenderName: string = 'StyledConsoleLogAppender';

    log(logEntry: LogEntry) {
        const logStringWithStyleSpecifier = this.addStyleSpecifier(logEntry.buildLogString());
        console.log(logStringWithStyleSpecifier, this.getBoldWithColorStyle(logEntry.level), this.getColorStyle(logEntry.level));
    }

    private addStyleSpecifier(logString: string) {
        return '%c' + logString.replace('] - ', '] - %c');
    }

    private getBoldWithColorStyle(level: LogLevel): string {
        return 'font-weight:bold;' + this.getColorStyle(level);
    }

    private getColorStyle(level: LogLevel): string {
        let msgStyle = 'color:';
        switch (level) {
            case 0:
                msgStyle += '#0000FF;';  // blue
                break;
            case 1:
                msgStyle += '#008000;';  // green
                break;
            case 2:
                msgStyle += '#E6C300;';  // yellow
                break;
            case 3:
                msgStyle += '#FF0000;';  // red
                break;
        }

        return msgStyle;
    }
}