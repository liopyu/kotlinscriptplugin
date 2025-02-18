import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export class Utils {
    public logFile: string;
    public logBuffer: string[] = [];
    public flushInterval: NodeJS.Timeout | null = null;
    public outputChannel: vscode.OutputChannel;
    private lastMessage: string | null = null;
    private lastMessageCount: number = 1;
    constructor(context: vscode.ExtensionContext) {
        this.outputChannel = vscode.window.createOutputChannel("KotlinScript Logs")
        const basePath = context.extensionPath;
        this.logFile = path.join(basePath, 'debug.log');
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }
        fs.writeFileSync(this.logFile, '');
        console.log(`Logging to: ${this.logFile}`);
        this.flushInterval = setInterval(() => {
            if (this.logBuffer.length > 0) {
                fs.appendFile(this.logFile, this.logBuffer.join(''), (err) => {
                    if (err) console.error("Failed to write logs:", err);
                });
                this.logBuffer = [];
            }
        }, 1000);
    }
    private getFormattedTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    private logToFile(type: 'log' | 'warn' | 'error', args: any[]) {
        const messageContent = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');
        const timestampedMessage = `[${this.getFormattedTimestamp()}] ` + (type !== 'log' ? `[${type.toUpperCase()}]: ` : '') + messageContent;

        if (this.lastMessage === messageContent) {
            this.lastMessageCount++;
            this.updateLastLogEntry();
        } else {
            if (this.lastMessageCount > 1) {
                this.writeModifiedLastLogEntry();
            }
            this.lastMessage = messageContent;
            this.lastMessageCount = 1;
            this.logBuffer.push(timestampedMessage + '\n');
        }

        this.outputChannel.appendLine(timestampedMessage);
    }

    private updateLastLogEntry() {
        if (this.logBuffer.length > 0) {
            this.logBuffer[this.logBuffer.length - 1] = `(x${this.lastMessageCount}) ` + this.logBuffer[this.logBuffer.length - 1].replace(/^\(x\d+\) /, '');
        }
    }

    private writeModifiedLastLogEntry() {
        if (this.logBuffer.length > 0) {
            this.logBuffer[this.logBuffer.length - 1] = `(x${this.lastMessageCount}) ` + this.logBuffer[this.logBuffer.length - 1].replace(/^\(x\d+\) /, '');
            this.lastMessageCount = 1;
        }
    }

    public log(...args: any[]) {
        console.log(...args);
        this.logToFile('log', args);
    }

    public warn(...args: any[]) {
        console.warn(...args);
        this.logToFile('warn', args);
    }

    public error(...args: any[]) {
        console.error(...args);
        this.logToFile('error', args);
    }
}
