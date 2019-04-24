import { DisabledLoggersListService } from '../disabled-logger-list.service';
import { LogLevel } from '../log-level';
import { DisabledLoggersPropertyHandler } from '.';
import { Logger } from '../logger';
import { LogBokAppenders } from '../logbok-appenders';
import { LogAppendersPropertyHandler } from '.';

export class ConfigPropertyHandler {
    disabledLoggers: any[] = [];

    constructor(private loggers: Map<string, Logger>) {}

    set (_CONFIG: any, key: any, value: any): boolean {
        if (key === 'disabled-loggers') {
            _CONFIG['disabled-loggers'] = _CONFIG['disabled-loggers'] || new Proxy(this.disabledLoggers, new DisabledLoggersPropertyHandler());
            DisabledLoggersListService.disableLoggers(this.disabledLoggers, value);
        } else if (key === 'log-level') {
            if (value in LogLevel) {
                _CONFIG['log-level'] =  LogLevel[value];
                this.loggers.forEach((logger: Logger) => {
                    logger.configureLogLevels(_CONFIG['log-level']);
                })
            }
        } else if (key === 'log-appenders') {
            value.forEach((appender: any) => {
                const appenderName = appender.appenderName;
                const appenderText = 'Appender';
                if (appenderName && appenderName.indexOf(appenderText) === (appenderName.length - appenderText.length)) {
                    value[appenderName] = appender;
                    LogBokAppenders.register(appenderName, appender);
                }
            });
            _CONFIG['log-appenders'] = _CONFIG['log-appenders'] || new Proxy(value, new LogAppendersPropertyHandler());
            return true;
        }
        return true;
    }

    deleteProperty(_CONFIG: any, key: any): boolean {
        return true;
    }
}