"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var ProbeTypeCheckIdentifier = '__ProbeTypeCheck';
function typeCheckDecralation(extractInterface) {
    if (extractInterface) {
        return "type " + ProbeTypeCheckIdentifier + " = { [P in keyof " + ProbeTypeIdentifier + "]: " + ProbeTypeIdentifier + "[P] }";
    }
    return "type " + ProbeTypeCheckIdentifier + " = " + ProbeTypeIdentifier;
}
function probe(options) {
    var _a;
    var sourceText = options.source.getText();
    var injectedSourceText = [
        sourceText,
        "type " + ProbeTypeIdentifier + " = " + options.typeText,
        typeCheckDecralation(Boolean(options.extractInterface)),
    ].join('\n\n');
    var probeSource = ts.createSourceFile(options.source.fileName, injectedSourceText, options.source.languageVersion, true);
    var defaultCompilerHost = ts.createCompilerHost((_a = options.compilerOptions) !== null && _a !== void 0 ? _a : {});
    var customCompilerHost = __assign(__assign({}, (defaultCompilerHost)), { getSourceFile: function (filename) {
            if (filename === options.source.fileName) {
                return probeSource;
            }
            return defaultCompilerHost.getSourceFile(filename, options.source.languageVersion);
        } });
    var fileNames = options.program.getRootFileNames();
    var customProgram = ts.createProgram(fileNames, options.program.getCompilerOptions(), customCompilerHost, options.program);
    var checker = customProgram.getTypeChecker();
    var probeSourceNode = probeSource.getChildAt(0, probeSource);
    var probeTypeDeclaration = probeSourceNode.getChildren(probeSource).find(function (node) {
        if (ts.isTypeAliasDeclaration(node)) {
            return node.name.text === ProbeTypeCheckIdentifier;
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
