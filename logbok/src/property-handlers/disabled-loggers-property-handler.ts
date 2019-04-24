import { LoggingService } from '../logging.service';

export class DisabledLoggersPropertyHandler {
    set<Type>(_disabledLoggers: any[], index: string, classType: Type): boolean {
        if (/^\d+$/.test(index)) {
            _disabledLoggers[index] = classType;
            LoggingService.getLogger(classType).disable();
        }
        return true;
    }

    deleteProperty(_disabledLoggers: any[], index: string): boolean {
        if (/^\d+$/.test(index) && _disabledLoggers[+index]) {
            LoggingService.getLogger(_disabledLoggers[index]).enable();
        }
        delete _disabledLoggers[index];
        return true;
    }
}