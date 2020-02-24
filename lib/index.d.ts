import * as ts from 'typescript';
declare type ProbeOptions = {
    program: ts.Program;
    source: ts.SourceFile;
    typeText: string;
    extractInterface?: boolean;
    compilerOptions?: ts.CompilerOptions;
};
export declare function probe(options: ProbeOptions): ts.Type | undefined;
export {};
