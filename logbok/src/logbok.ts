import { Logger as Logger } from './logger';
import { LogLevel } from './log-level';
import { ConfigPropertyHandler } from './property-handlers';

export namespace Logbok {
    const loggers = new Map<string, Logger> ();

    export function getLogger<T>(type: T) {
        const name = type['name'];
        let logger = loggers.get(name);
        if (!logger) {
            logger = new Logger(name, CONFIG['log-level'] || LogLevel.debug);
            loggers.set(name, logger);
        }

        return logger;
    }

    export const CONFIG = new Proxy({}, new ConfigPropertyHandler(loggers));
}
