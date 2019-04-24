import { Logbok } from "../src/logbok";
import { ConsoleLogAppender } from "../src/appenders/console-log-appender";
import { ChromeConsoleLogAppender } from "../src/appenders/chrome-console-log-appender";
import { IsoTimestampAppender } from "../src/appenders/iso-timestamp-appender";
import { NodeConsoleLogAppender } from "../src/appenders/node-console-log-appender";

export class CreateLoggerTest {
    private static readonly logger = Logbok.getLogger(CreateLoggerTest);

    main() {
        Logbok.CONFIG['disabled-loggers'] = [];
        Logbok.CONFIG['log-level'] = 'debug';
        Logbok.CONFIG['log-appenders'] = [ new ConsoleLogAppender(), new IsoTimestampAppender(), new ChromeConsoleLogAppender(), new NodeConsoleLogAppender()]
        CreateLoggerTest.logger.debug('abc');
        CreateLoggerTest.logger.info('def');
        CreateLoggerTest.logger.warn('jkl');
        CreateLoggerTest.logger.error('ghi');
    }

}

new CreateLoggerTest().main();