import * as ts from 'typescript'

const ProbeTypeIdentifier = '__ProbeType'

export function probe (checkerOrProgram: ts.TypeChecker | ts.Program, source: ts.SourceFile, text: string): ts.Type | undefined {
  const checker = ('getTypeChecker' in checkerOrProgram) ? checkerOrProgram.getTypeChecker() : checkerOrProgram
  const printer = ts.createPrinter()

  const sourceText = printer.printNode(ts.EmitHint.SourceFile, source, source)
  const injectedSourceText = [
    sourceText,
    `type ${ProbeTypeIdentifier} = ${text}`,
  ].join('\n\n')

  const probeSource = ts.createSourceFile(source.fileName, injectedSourceText, source.languageVersion, true)
  const probeSourceNode = probeSource.getChildAt(0, probeSource)

  const probeTypeDeclaration = probeSourceNode.getChildren(probeSource).find((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      return node.name.text === ProbeTypeIdentifier
    }

    return false
  })

  if (probeTypeDeclaration && ts.isTypeAliasDeclaration(probeTypeDeclaration)) {
    const type = checker.getTypeFromTypeNode(probeTypeDeclaration.type)

    if (type.getSymbol()) {
      return type
    }
  }

  return undefined
}
