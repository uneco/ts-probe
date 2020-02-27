import * as ts from 'typescript'

const ProbeTypeIdentifier = '__ProbeType'
const ProbeTypeCheckIdentifier = '__ProbeTypeCheck'

type ProbeOptions = {
  program: ts.Program;
  source: ts.SourceFile;
  typeText: string;
  extractInterface?: boolean;
  compilerOptions?: ts.CompilerOptions;
}

function typeCheckDeclaration (extractInterface: boolean): string {
  if (extractInterface) {
    return `type ${ProbeTypeCheckIdentifier} = { [P in keyof ${ProbeTypeIdentifier}]: ${ProbeTypeIdentifier}[P] }`
  }

  return `type ${ProbeTypeCheckIdentifier} = ${ProbeTypeIdentifier}`
}

export function probe (options: ProbeOptions): ts.Type | undefined {
  const sourceText = options.source.getText()
  const injectedSourceText = [
    sourceText,
    `type ${ProbeTypeIdentifier} = ${options.typeText}`,
    typeCheckDeclaration(Boolean(options.extractInterface)),
  ].join('\n\n')

  const probeSource = ts.createSourceFile(
    options.source.fileName,
    injectedSourceText,
    options.source.languageVersion,
    true,
  )

  const defaultCompilerHost = ts.createCompilerHost(options.compilerOptions ?? {})

  const customCompilerHost = {
    ...(defaultCompilerHost),
    getSourceFile (filename: string): ts.SourceFile | undefined {
      if (filename === options.source.fileName) {
        return probeSource
      }

      return defaultCompilerHost.getSourceFile(filename, options.source.languageVersion)
    },
  }

  const fileNames = options.program.getRootFileNames()
  const customProgram = ts.createProgram(
    fileNames,
    options.program.getCompilerOptions(),
    customCompilerHost,
    options.program,
  )
  const checker = customProgram.getTypeChecker()

  const probeSourceNode = probeSource.getChildAt(0, probeSource)

  const probeTypeDeclaration = probeSourceNode.getChildren(probeSource).find((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      return node.name.text === ProbeTypeCheckIdentifier
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
