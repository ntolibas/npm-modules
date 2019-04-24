import { LoggingService } from "../src/logging.service";
import { ConsoleLogAppender } from "../src/appenders/console-log-appender";
import { ChromeConsoleLogAppender } from "../src/appenders/chrome-console-log-appender";
import { IsoTimestampAppender } from "../src/appenders/iso-timestamp-appender";
import { NodeConsoleLogAppender } from "../src/appenders/node-console-log-appender";

export class CreateLoggerTest {
    main() {
        LoggingService.CONFIG['disabled-loggers'] = [];
        LoggingService.CONFIG['log-level'] = 'debug';
        LoggingService.CONFIG['log-appenders'] = [ new ConsoleLogAppender(), new IsoTimestampAppender(), new ChromeConsoleLogAppender(), new NodeConsoleLogAppender()]
        LoggingService.getLogger(CreateLoggerTest).debug('abc');
        LoggingService.getLogger(CreateLoggerTest).info('def');
        LoggingService.getLogger(CreateLoggerTest).warn('jkl');
        LoggingService.getLogger(CreateLoggerTest).error('ghi');
    }
}

new CreateLoggerTest().main();