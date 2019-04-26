import { Appender } from '../logbok-appenders';
import { LogEntry } from '../log-entry';
import { Stats, appendFileSync, statSync, readdirSync, renameSync } from 'fs';
import { dirname, basename, sep } from 'path';

export class RollingFileAppender implements Appender {
    readonly appenderName = 'RollingFileAppender';
    private readonly fileSizeLimit: number;
    private timeIntervalMs?: number;
    private shouldRollover: (stats: Stats) => boolean;
    private readonly rolloverFilenamePattern: RegExp;

    constructor(private readonly filePath: string = 'logbok.log', private options: RolloverOption = { timeInterval: RolloverTime.DAILY }) {
        this.rolloverFilenamePattern = new RegExp(this.generateRolloverFilenamePattern());
        this.fileSizeLimit = this.calculateSizeLimitBytes();
        if (this.fileSizeLimit)  {
            this.shouldRollover = this.hasReachedFileSizeLimit;
        } else {
            this.timeIntervalMs = this.calculateTimeIntervalLimitMs();
            this.shouldRollover = this.hasReachedTimeIntervalLimit;
        }
    }

    log(logEntry: LogEntry): void {
        let stats = statSync(this.filePath);
        appendFileSync(this.filePath, logEntry.buildLogString() + '\n');
        if (this.shouldRollover(stats)) {
            this.rollover();
        }
    }

    private generateRolloverFilenamePattern(): string {
        const escapedFilename = basename(this.filePath).replace(/(?=[()])/g, '\\'); // escape all parenthesis
        const extensionDot = escapedFilename.lastIndexOf('.');
        let template;

        if (extensionDot !== -1) {
            template = escapedFilename.slice(0, extensionDot) + '-(\\d+)' + escapedFilename.slice(extensionDot);
        } else {
            template = escapedFilename + '-(\\d+)';
        }

        template = template.replace('.', '\\.');
        return template;
    }

    private hasReachedFileSizeLimit(stats: Stats): boolean {
        console.log('stats.size: %d, this.fileSizeLimit: %d', stats.size, this.fileSizeLimit)
        return stats.size >= this.fileSizeLimit;
    }

    private hasReachedTimeIntervalLimit(stats: Stats): boolean {
        const now = Date.now();
        return now - stats.birthtimeMs >= (this.timeIntervalMs || now);
    }

    private calculateSizeLimitBytes(): number {
        return (((this.options.sizeInMiB || (this.options.sizeInGiB || 0) * 1024 // Megabytes
            || (this.options.size || 0)) * 1024) // Kilobytes
            || (this.options.sizeInKiB || 0)) * 1024; // bytes
    }

    private calculateTimeIntervalLimitMs(): number {
        return ((this.options.timeInterval || 0) 
            || (this.options.timeIntervalInSeconds || 0)
            || (this.options.timeIntervalInMinutes || 0) * 60
            || (this.options.timeIntervalInHours || 0) * 3600) * 1000
    }

    private rollover() {
        const folderName = dirname(this.filePath);
        const files = readdirSync(folderName);
        const newName = this.generateNewFilenameFromExistingLogs(files);
        renameSync(this.filePath, folderName + sep + newName);
        appendFileSync(this.filePath, '');
    }

    private generateNewFilenameFromExistingLogs(files: string[]): string {
        let max = 0;
        files.filter((file) => {
            return this.rolloverFilenamePattern.test(file);
        }).map((file) => {
            return +file.replace(this.rolloverFilenamePattern, '$1');
        }).forEach((count) => {
            if (count > max) {
                max = count;
            }
        });
        return this.rolloverFilenamePattern.source.replace('(\\d+)', (max + 1).toString())
                            .replace('\\.', '.');
    }
}

export declare interface RolloverOption {
    size?: RolloverSize,
    sizeInKiB?: number
    sizeInMiB?: number,
    sizeInGiB?: number,
    timeInterval?: RolloverTime,
    timeIntervalInSeconds?: number,
    timeIntervalInMinutes?: number,
    timeIntervalInHours?: number
}

export enum RolloverTime {
    HOURLY = 60 * 60,
    DAILY = HOURLY * 24,
    WEEKLY = DAILY * 7,
    MONTHLY = DAILY * 30,
}

export enum RolloverSize {
    TEN_MiB = 10,
    FIFTY_MiB = TEN_MiB * 5,
    HUNDRED_MiB = FIFTY_MiB * 2,
    ONE_GiB = 1024,
    TEN_GiB = ONE_GiB * 10
}