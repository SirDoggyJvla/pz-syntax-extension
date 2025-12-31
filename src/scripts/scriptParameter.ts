import * as vscode from 'vscode';
import { MarkdownString, TextDocument, Diagnostic } from "vscode";
import { ScriptBlock } from "./scriptBlocks";
import { ThemeColorType, DiagnosticType, DefaultText, formatDiagnostic } from '../models/enums';
import { getScriptBlockData } from './scriptData';

export class ScriptParameter {
// MEMBERS
    // extra
    document: TextDocument;
    diagnostics: Diagnostic[];
    
    // param data
    parent: ScriptBlock;
    name: string;
    value: string;

    // positions
    parameterStart: number;
    parameterEnd: number;
    valueStart: number;
    valueEnd: number;

// CONSTRUCTOR
    constructor(
        document: TextDocument,
        parent: ScriptBlock,
        diagnostics: Diagnostic[],
        name: string,
        value: string,
        parameterStart: number,
        parameterEnd: number,
        valueStart: number,
        valueEnd: number
    ) {
        this.document = document;
        this.parent = parent;
        this.diagnostics = diagnostics;
        this.name = name;
        this.value = value;
        this.parameterStart = parameterStart;
        this.parameterEnd = parameterEnd;
        this.valueStart = valueStart;
        this.valueEnd = valueEnd;
    
        this.validateParameter();
    }


// CHECKERS

    private validateParameter(): boolean {
        const blockData = getScriptBlockData(this.parent.scriptBlock);
        const parameters = blockData.parameters;
        const name = this.name;
        const lowerName = name.toLowerCase();

        // check if parameter exists in this block
        const parameterData = parameters[lowerName];
        if (!parameterData) {
            this.diagnostic(
                DiagnosticType.UNKNOWN_PARAMETER,
                { parameter: name, scriptBlock: this.parent.scriptBlock },
                this.parameterStart
            );
            return false;
        }

        return true;
    }



// DIAGNOSTICS HELPERS

    private diagnostic(
        type: DiagnosticType,
        params: Record<string, string>,
        index_start: number,index_end?: number,
        severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Error
    ): void {
        const positionStart = this.document.positionAt(index_start);
        const positionEnd = index_end ? this.document.positionAt(index_end) : positionStart;
        const message = formatDiagnostic(type, params);
        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(positionStart, positionEnd),
            message,
            severity
        );
        this.diagnostics.push(diagnostic);
        console.warn(message);
    }

}