import winston, {Logger} from "winston";
import path from "path";

function projectName () {
    try {
        const projectPath = require.main?.filename;
        if(!projectPath?.length) {
            return '';
        }
        const path = projectPath.split('/');
        let projectFolderName = '';
        for(let i=path.length-1;i>=0;i--){
            if(path[i] == 'src') {
                projectFolderName = path[i - 1];
                break;
            }
        }
        return projectFolderName;
    }catch (e){
        logError(e.toString());
        return '';
    }
}

let loggerDay:number = -1;
let _logger: Logger;
export function logger()  {
    const currentDay = new Date().getDate();
    if(loggerDay != currentDay) {
        loggerDay = currentDay;
        _logger?.close();

        const logsFilename = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)}-${(new Date().getDate())}.log`; // filename example: "2022-10-8.log"
        const logsPathAndFilename = path.join(`../logs`, projectName(), logsFilename);

        _logger = winston.createLogger({
            transports: [
                new winston.transports.File({filename: logsPathAndFilename, level: 'silly' as Level}),
                new winston.transports.File({filename: logsPathAndFilename, level: 'debug' as Level}),
                new winston.transports.File({filename: logsPathAndFilename, level: 'verbose' as Level}),
                new winston.transports.File({filename: logsPathAndFilename, level: 'http' as Level}),
                new winston.transports.File({filename: logsPathAndFilename, level: 'info' as Level}),
                new winston.transports.File({filename: logsPathAndFilename, level: 'warn' as Level}),
                new winston.transports.File({filename: logsPathAndFilename, level: 'error' as Level}),
            ]
        });
    }
    return _logger;
}


export type Level =
    'error' |
    'warn' |
    'info' |
    'http' |
    'verbose' |
    'debug' |
    'silly';

export function log(message, level:Level = 'debug') {
    console.log(message);
    return logger().log({message: message.toString(), level: level});
}

export function logDebug(message) : void {
    log(message, "debug");
}
export function logWarn(message) : void {
    log(message, "warn");
}
export function logInfo(message) : void {
    log(message, "info");
}
export function logError(message) : void {
    log(message, "error");
}