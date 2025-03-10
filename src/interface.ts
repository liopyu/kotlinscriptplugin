import { TreeProvider } from './treeprovider'
import * as vscode from 'vscode';
export interface CustomData {
    treeProvider: TreeProvider;
    document: vscode.TextDocument;
}