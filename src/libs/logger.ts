import guid from "./uuid";
import {ApiManagerService} from "../services/apiManager";

const StackTrace = require("stacktrace-js");

export enum Level {
    "INFO" = "info",
    "WARN" = "warn",
    "ERROR" = "error",
}

class Logger {
    private uuid;
    private logs: any[] = [];
    private interval;

    constructor() {
        this.uuid = guid();
        this.interval = setInterval(this.saveLogs, 10000);
    }

    saveLogs = () => {
        if (this.logs.length > 0) {
            ApiManagerService.saveLog(this.logs);
            this.logs = [];
        }
    }

    log(data, level) {
        console[level](data);
        const obj = {
            level: level,
            // context: navigator.userAgent,
            data,
            uuid: this.uuid,
            stack_trace: StackTrace.get()
        }

        this.logs.push(obj)
    }

    public info(...data) {
        this.log(data, Level.INFO);
    }

    public warn(...data) {
        this.log(data, Level.WARN);
    }

    public error(...data) {
        this.log(data, Level.ERROR);
    }
}

export const Log = new Logger();