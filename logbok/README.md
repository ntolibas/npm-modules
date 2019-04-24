## Sample usage
### To install
```
npm install --save logbok
```
### To create a logger for a class
```typescript
export class MyClass {
    ...
    private static readonly logger = Logbok.getLogger(MyClass);
    ...
}
```

### Or for a vanilla javascript function
```typescript
...
var logger;

function myFunction() {
    ...
    logger = logger || Logbok.getLogger(myFunction);
    ...
}
...
```

### To log specific messages
```typescript
logger.debug('this is a debug log');
logger.info('this is an info log');
logger.warn('this is a warn log');
logger.error('this is an error log');
```

## Configurations
Logbok reads the specified configuration from its `CONFIG` property.
<br/>Currently supported configurable parameters are `log-level`, `disabled-loggers`, and `log-appenders`.

---
|ATTRIBUTE|TYPE|<div style='text-align: center;'>DESCRIPTION</div>|SAMPLE USAGE***|
|:---:|:---:|:---|:---:|
|*log-level*|string|can be either `debug`, `info`, `warn`, and `error` - with `debug` as the lowest and `error` as the highest level, respectively - initially set to `debug`.|```Logbok.CONFIG['log-level'] = 'debug'```|
|*disabled-loggers*|array|contains the list of the classes/types whose loggers will be disabled - initially set to empty.|```Logbok.CONFIG['disabled-loggers'] = [MyClass]```|
|*log-appenders*|array|contains the list of instances of log appenders to be used - initially set to empty.<br/>Currently, Logbok provides 4 appenders, namely, `ConsoleLogAppender`, `ChromeConsoleLogAppender`, `NodeConsoleLogAppender`, and `IsoTimestampAppender`|```Logbok.CONFIG['log-appenders'] = [ new ChromeConsoleLogAppender(), new CustomLogAppender() ]```|
---

***_Note: All of the above mentioned attributes are configured in a way that when a new value is assigned, the changes will be applied immediately._

## Creating a custom log appender
If the provided appenders are insufficient, you can extend those and/or make your own log appender for your own specific usecase.
<br/>You just need to implement the `Appender` interface like below:
```typescript
// this is a blunt angular sample for a remote log appender implementation
export class RemoteLogAppender implements Appender {
    readonly appenderName = 'RemoteLogAppender';
    private static readonly chromeConsoleLogAppender = new ChromeConsoleLogAppender();

    log(logEntry: LogEntry): void {
        const message = logEntry.buildLogString('');
        this.http.post('https://log/service/url', message, /*httpOptions*/).subscribe(() => {
            this.chromeConsoleLogAppender.log(logEntry);
        });
    }
}
...
// then somewhere up the initialization phase
Logbok.CONFIG['log-appenders'] = [ new RemoteLogAppender() ]
```
For reference purposes, the appender interface is defined in Logbok as
```typescript
export interface Appender {
    readonly appenderName: string;
    log(logEntry: LogEntry): void;
}
```
## Sample Codes
Vanilla javascript code snippet for Node JS:

```javascript
var { Logbok, ConsoleLogAppender } = require("logbok");

var logger;

function myFunction() {
   logger = logger || Logbok.getLogger(myFunction);
   logger.info('this is an info log');
}

Logbok.CONFIG['log-appenders'] = [new ConsoleLogAppender()]

myFunction(); // prints something like "04/24/2019 - 15:30:29.958 INFO [myFunction] - this is an info log"
```

Code snippet for Typescript:
```typescript
import { Logbok, ConsoleLogAppender } from "logbok";

export class MyClass {
    private static readonly logger = Logbok.getLogger(MyClass);

    log() {
        MyClass.logger.info('this is an info log');
    }
}

Logbok.CONFIG['log-appenders'] = [ new ConsoleLogAppender() ];
new MyClass().log(); // prints something like "04/24/2019 - 15:46:33.891 INFO [MyClass] - this is an info log"
```