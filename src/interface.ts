import { TreeProvider } from './treeprovider'
import * as vscode from 'vscode';
import { log, error, warn } from './extension';
import { console } from './extension'
export interface CustomData {
    treeProvider: TreeProvider;
    document: vscode.TextDocument;
}