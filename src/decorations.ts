import * as vscode from 'vscode';
import { TreeProvider } from './treeprovider';
import { VariableType } from './enums';
export const SimpleDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ADD8E6',
});
export const VariableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4bb4ec',
    //textDecoration: 'underline'
});
export const SubVariableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4bb4ec',
    //textDecoration: 'underline'
});
export const ImportDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ff0000',
    textDecoration: 'underline'
});
export const MethodDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#FFD700',
});
export const OtherDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ca27ea',
});
export const DelimiterDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#a258ab',
});
export const DefaultBlueDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#569CD6',
});
