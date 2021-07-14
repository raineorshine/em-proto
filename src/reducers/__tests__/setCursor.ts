// TODO: Why does util have to be imported before selectors and reducers?
import { importText, setCursor, toggleContextView } from '../../reducers'
import { initialState, reducerFlow } from '../../util'

it('set the cursor to a SimplePath', () => {
  const text = `
    - a
      - b
        - c`

  const cursor = [
    { value: 'a', rank: 0 },
    { value: 'b', rank: 0 },
    { value: 'c', rank: 0 },
  ]

  const steps = [importText({ text }), setCursor({ path: cursor }), toggleContextView]

  const stateNew = reducerFlow(steps)(initialState())

  expect(stateNew.cursor).toMatchObject(cursor)
})

it('set the cursor to a Path across a context view', () => {
  const text = `
    - a
      - m
        - x
    - b
      - m
        - y
  `

  const cursor = [
    { value: 'a', rank: 0 },
    { value: 'm', rank: 0 },
    { value: 'b', rank: 1 },
    { value: 'y', rank: 0 },
  ]

  const steps = [importText({ text }), setCursor({ path: cursor }), toggleContextView]

  const stateNew = reducerFlow(steps)(initialState())

  expect(stateNew.cursor).toMatchObject(cursor)
})
