import _ from 'lodash'
import { importHtml } from '../importText'

// constants
import {
  ROOT_TOKEN,
} from '../../constants'

// util
import {
  exportContext,
  getThought,
  getThoughtsRanked,
  hashContext,
  hashThought,
} from '../../util'

const RANKED_ROOT = [{ value: ROOT_TOKEN, rank: 0 }]
const initialState = {
  thoughtIndex: {
    [hashThought(ROOT_TOKEN)]: {
      value: ROOT_TOKEN,
      contexts: [],
    },
  },
  contextIndex: {
    [hashContext([ROOT_TOKEN])]: [],
  },
}

/** Imports the given html and exports it as plaintext */
const importExport = html => {
  const {
    contextIndexUpdates: contextIndex,
    thoughtIndexUpdates: thoughtIndex,
  } = importHtml(RANKED_ROOT, html, { state: initialState })
  const state = { contextIndex, thoughtIndex }
  const exported = exportContext([ROOT_TOKEN], 'text/plaintext', { state })
  console.log('exported', exported)

  // remote root, de-indent (trim), and append newline to make tests cleaner
  const exportedWithoutRoot = exported.slice(exported.indexOf('\n'))
    .split('\n')
    .map(line => line.slice(2).trimEnd()) // TODO: Fix exportContext to avoid trimEnd
    .join('\n')
    + '\n'

  return exportedWithoutRoot
}

it('simple', () => {
  expect(importExport('test'))
    .toEqual(`
- test
`)
})

it('simple li', () => {
  expect(importExport('<li>test</li>'))
    .toEqual(`
- test
`)
})

it('simple ul', () => {
  expect(importExport('<ul><li>test</li></ul>'))
    .toEqual(`
- test
`)
})

it('whitespace', () => {
  expect(importExport('  test  '))
    .toEqual(`
- test
`)
})

it('multiple li\'s', () => {
  expect(importExport(`
<li>one</li>
<li>two</li>
`))
    .toEqual(`
- one
- two
`)
})

it('nested li\'s', () => {
  expect(importExport(`
<li>a<ul>
  <li>x</li>
  <li>y</li>
</ul></li>
`))
    .toEqual(`
- a
  - x
  - y
`)
})

it('multiple nested lists', () => {
  expect(importExport(`
<li>a
  <ul>
    <li>b</li>
  </ul>
</li>
<li>c
  <ul>
    <li>d</li>
  </ul>
</li>
`))
  .toEqual(`
- a
  - b
- c
  - d
`)
})

it('strip wrapping tag', () => {
  expect(importExport('<span>test</span>'))
    .toEqual(`
- test
`)
})

it('strip inline tag', () => {
  expect(importExport('a <span>b</span> c'))
  .toEqual(`
- a b c
`)
})

it('strip inline tag in nested list', () => {
  expect(importExport(`
<li>a<span>fter</span>word<ul>
  <li>one <span>and</span> two</li>
  <li>y</li>
</ul></li>
`))
    .toEqual(`
- afterword
  - one and two
  - y
`)
})

it('preserve formatting tags', () => {
  expect(importExport('<b>one</b> and <i>two</i>'))
    .toEqual(`
- <b>one</b> and <i>two</i>
`)
})


it.only('WorkFlowy import with notes', () => {
  expect(importExport(`
z
<ul>
  <li>a<br>
    <span class="note">Note</span>
    <ul>
      <li>b</li>
    </ul>
  </li>
  <li>c<br>
    <span class="note">Other Note</span>
    <ul>
      <li>d</li>
    </ul>
  </li>
</ul>`))
  .toEqual(`
- z
  - a
    - =note
      - Note
    - b
  - c
    - =note
      - Other Note
    - d
`)
})
