"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
var ProbeTypeIdentifier = '__ProbeType';
function probe(checkerOrProgram, source, text) {
    var checker = ('getTypeChecker' in checkerOrProgram) ? checkerOrProgram.getTypeChecker() : checkerOrProgram;
    var printer = ts.createPrinter();
    var sourceText = printer.printNode(ts.EmitHint.SourceFile, source, source);
    var injectedSourceText = [
        sourceText,
        "type " + ProbeTypeIdentifier + " = " + text,
    ].join('\n\n');
    var probeSource = ts.createSourceFile(source.fileName, injectedSourceText, source.languageVersion, true);
    var probeSourceNode = probeSource.getChildAt(0, probeSource);
    var probeTypeDeclaration = probeSourceNode.getChildren(probeSource).find(function (node) {
        if (ts.isTypeAliasDeclaration(node)) {
            return node.name.text === ProbeTypeIdentifier;
        }
        return false;
    });
    if (probeTypeDeclaration && ts.isTypeAliasDeclaration(probeTypeDeclaration)) {
        var type = checker.getTypeFromTypeNode(probeTypeDeclaration.type);
        if (type.getSymbol()) {
            return type;
        }
    }
    return undefined;
}
exports.probe = probe;
