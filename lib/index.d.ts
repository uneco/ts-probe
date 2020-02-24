import * as ts from 'typescript';
export declare function probe(checkerOrProgram: ts.TypeChecker | ts.Program, source: ts.SourceFile, text: string): ts.Type | undefined;
