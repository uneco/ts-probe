import * as ts from 'typescript'
import { probe } from '../src/index'

describe('base interface', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe({
      program,
      source,
      typeText: 'User',
    })

    expect(type).toBeTruthy()
    expect(type?.getProperties()?.length).toBe(3)
    expect(type?.getProperty('id')?.declarations[0].getText()).toBe('id: string;')
  })
})

describe('extended interface', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe({
      program,
      source,
      typeText: 'StoredUser',
    })

    expect(type).toBeTruthy()
    expect(type?.getProperties()?.length).toBe(4)
    expect(type?.getProperty('storedAt')?.declarations[0].getText()).toBe('storedAt: Date;')
  })
})

describe('mapped interface manually', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe({
      program,
      source,
      typeText: '{ [P in keyof StoredUser]: StoredUser[P] }',
    })

    expect(type).toBeTruthy()
    expect(type?.getProperties()?.length).toBe(4)
    expect(type?.getProperty('storedAt')?.declarations[0].getText()).toBe('storedAt: Date;')
  })
})

describe('mapped interface automatically', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe({
      program,
      source,
      typeText: 'StoredUser',
      extractInterface: true,
    })

    expect(type).toBeTruthy()
    expect(type?.getProperties()?.length).toBe(4)
    expect(type?.getProperty('storedAt')?.declarations[0].getText()).toBe('storedAt: Date;')
  })
})

describe('intersection type', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe({
      program,
      source,
      typeText: 'StoredUser & { special: boolean; }',
      extractInterface: true,
    })

    expect(type).toBeTruthy()
    expect(type?.getProperties()?.length).toBe(5)
    expect(type?.getProperty('special')?.declarations[0].getText()).toBe('special: boolean;')
  })
})

describe('partial', () => {
  it('should be properly probed', () => {
    const program = ts.createProgram(['tests/fixtures/sample.ts'], {})
    const source = program.getSourceFile('tests/fixtures/sample.ts')

    if (!source) {
      throw new Error('source file not found')
    }

    const type = probe({
      program,
      source,
      typeText: 'Partial<StoredUser>',
    })

    expect(type).toBeTruthy()
    expect(type?.getProperties()?.length).toBe(4)
    expect(type?.getProperty('storedAt')?.declarations[0].getText()).toBe('storedAt: Date;')
  })
})
