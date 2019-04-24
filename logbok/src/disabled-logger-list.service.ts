import { Logbok } from './logbok';

export namespace DisabledLoggersListService {
    export function disableLoggers (currentlyDisabledLoggersList: any[], newDisabledLoggersList: any[]) {
        const remainDisabled: any[] = reEnableDisabledLoggers(currentlyDisabledLoggersList, newDisabledLoggersList);
        disableNewlyAddedLoggers(currentlyDisabledLoggersList, newDisabledLoggersList, remainDisabled);
        combineCurrentlyDisabledAndOldDisabledLoggerList(currentlyDisabledLoggersList, remainDisabled);
    }

    function reEnableDisabledLoggers(currentlyDisabledLoggersList: any[], newDisabledLoggersList: any[]): any[] {
        const remainDisabled: any = [];

        // re-enable loggers that are not anymore present in the disabled list
        currentlyDisabledLoggersList.filter((logger: any) => {
            if (logger in newDisabledLoggersList) { // still part of the new list
                remainDisabled.push(logger);        // cache it
                return false;
            } else { // part of the new list
                return true;
            }
        })
        .forEach((logger: any) => Logbok.getLogger(logger).enable());

        return remainDisabled;
    }

    function disableNewlyAddedLoggers(currentlyDisabledLoggersList: any[], newDisabledLoggersList: any[], remainDisabled: any[]) {
        currentlyDisabledLoggersList.length = 0;
        // disable all new loggers & add to list
        newDisabledLoggersList.filter((logger: any) => !(logger in remainDisabled)) // logger is newly added
            .forEach((logger: any) => {
                Logbok.getLogger(logger).disable();
                currentlyDisabledLoggersList.push(logger);
            })
    }

    function combineCurrentlyDisabledAndOldDisabledLoggerList(currentlyDisabledLoggersList: any[], remainDisabled: any[]) {
        // re-add all previously disabled loggers to list
        remainDisabled.forEach((logger: any) => {
            currentlyDisabledLoggersList.push(logger);
        });
    }
}