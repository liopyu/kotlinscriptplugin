import { ImportCodeLensProvider } from './codelens';
import { SemanticTokensProvider } from './semantictokensprovider';
import { TreeProvider } from './treeprovider'
import * as vscode from 'vscode';
export interface CustomData {
    // treeProvider: TreeProvider;
    //document: vscode.TextDocument;
    semanticTokensProvider: SemanticTokensProvider | undefined;
    //codeLens: ImportCodeLensProvider | undefined;
}