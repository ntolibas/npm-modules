import { LogBokAppenders } from '../logbok-appenders';

export class LogAppendersPropertyHandler {
    defineProperty(_logAppenders: any, index: number, propertyDescriptor: any): boolean{
        const appenderName = propertyDescriptor.value.appenderName;
        const appenderText = 'Appender';
        if (appenderName && appenderName.indexOf(appenderText) === (appenderName.length - appenderText.length)) {
            LogBokAppenders.register(appenderName, propertyDescriptor.value);
        }

        _logAppenders[index] = propertyDescriptor.value;

        return true;
    }

    deleteProperty(_logAppenders: any, index: any): boolean {
        if (_logAppenders[index]) {
            LogBokAppenders.unregister(_logAppenders[index].constructor.name);
        }

        delete _logAppenders[index];

        return true;
    }
}