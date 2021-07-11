import { HOME_TOKEN } from '../../constants'
import { createId, initialState, reducerFlow } from '../../util'
import { exportContext } from '../../selectors'
import setCursorFirstMatch from '../../test-helpers/setCursorFirstMatch'

// reducers
import newSubthought from '../newSubthought'
import newThought from '../newThought'
import moveThoughtDown from '../moveThoughtDown'
import setCursor from '../setCursor'
import toggleAttribute from '../toggleAttribute'

it('move within root', () => {
  const steps = [
    newThought('a'),
    newThought('b'),
    setCursor({ path: [{ id: createId(), value: 'a', rank: 0 }] }),
    moveThoughtDown,
  ]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - b
  - a`)
})

it('move within context', () => {
  const steps = [
    newThought('a'),
    newSubthought('a1'),
    newThought('a2'),
    setCursor({
      path: [
        { id: createId(), value: 'a', rank: 0 },
        { id: createId(), value: 'a1', rank: 0 },
      ],
    }),
    moveThoughtDown,
  ]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
    - a2
    - a1`)
})

it('move to next uncle', () => {
  const steps = [
    newThought('a'),
    newSubthought('a1'),
    newThought({ value: 'b', at: [{ id: createId(), value: 'a', rank: 0 }] }),
    newSubthought('b1'),
    setCursor({
      path: [
        { id: createId(), value: 'a', rank: 0 },
        { id: createId(), value: 'a1', rank: 0 },
      ],
    }),
    moveThoughtDown,
  ]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
  - b
    - a1
    - b1`)
})

it('move to next uncle in sorted list', () => {
  const steps = [
    newThought('a'),
    toggleAttribute({ context: ['a'], key: '=sort', value: 'Alphabetical' }),
    newSubthought('a1'),
    newThought('a2'),
    newThought({ value: 'b', at: [{ id: createId(), value: 'a', rank: 0 }] }),
    setCursorFirstMatch(['a', 'a1']),
    moveThoughtDown,
  ]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
    - =sort
      - Alphabetical
    - a2
  - b
    - a1`)
})

it('prevent move in sorted list when there is no next uncle', () => {
  const steps = [
    newThought('a'),
    toggleAttribute({ context: ['a'], key: '=sort', value: 'Alphabetical' }),
    newSubthought('a1'),
    newThought('a2'),
    setCursorFirstMatch(['a', 'a1']),
    moveThoughtDown,
  ]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
    - =sort
      - Alphabetical
    - a1
    - a2`)
})
it('move descendants', () => {
  const steps = [
    newThought('a'),
    newSubthought('a1'),
    newSubthought('a1.1'),
    newThought({ value: 'b', at: [{ id: createId(), value: 'a', rank: 0 }] }),
    newSubthought('b1'),
    newSubthought('b1.1'),
    setCursor({ path: [{ id: createId(), value: 'a', rank: 0 }] }),
    moveThoughtDown,
  ]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - b
    - b1
      - b1.1
  - a
    - a1
      - a1.1`)
})

it('trying to move last thought of root should do nothing', () => {
  const steps = [newThought('a'), newThought('b'), moveThoughtDown]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
  - b`)
})

it('trying to move last thought of context with no next uncle should do nothing', () => {
  const steps = [
    newThought('a'),
    newThought('b'),
    setCursor({ path: [{ id: createId(), value: 'a', rank: 0 }] }),
    newSubthought('a1'),
    newSubthought('a1.1'),
    moveThoughtDown,
  ]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
    - a1
      - a1.1
  - b`)
})

it('do nothing when there is no cursor', () => {
  const steps = [newThought('a'), newThought('b'), setCursor({ path: null }), moveThoughtDown]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
  - b`)
})

it('move cursor thought should update cursor', () => {
  const steps = [
    newThought('a'),
    newSubthought('a1'),
    newThought('a2'),
    setCursor({
      path: [
        { id: createId(), value: 'a', rank: 0 },
        { id: createId(), value: 'a1', rank: 0 },
      ],
    }),
    moveThoughtDown,
  ]

  // run steps through reducer flow
  const stateNew = reducerFlow(steps)(initialState())

  expect(stateNew.cursor).toMatchObject([
    { value: 'a', rank: 0 },
    { value: 'a1', rank: 2 },
  ])
})
