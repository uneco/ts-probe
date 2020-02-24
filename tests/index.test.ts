import ts from 'typescript'
import { probe } from '../src/index'

describe('pass program', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe(program, source, 'User')

    expect(type).toBeTruthy()
    expect(type?.getProperty('id')?.declarations[0].getText()).toBe('id: string;')
  })
})

describe('pass checker', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe(program.getTypeChecker(), source, 'User')

    expect(type).toBeTruthy()
    expect(type?.getProperty('id')?.declarations[0].getText()).toBe('id: string;')
  })
})
