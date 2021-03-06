import { getContextsSortedAndRanked } from '../selectors'
import { head, normalizeThought, splice } from '../util'
import { Path, SimplePath, State } from '../@types'

/** Merges thoughts into a context chain, removing the overlapping head. */
// use autogenerated rank of context
// if there is no/empty context chain, return thoughtsRanked as-is
const chain = (state: State, contextChain: SimplePath[], simplePath: SimplePath): Path => {
  if (!contextChain || contextChain.length === 0) return simplePath

  // get the head thought in the last segment of the contextChain
  const pivot = head(contextChain[contextChain.length - 1])
  const i = simplePath.findIndex(child => normalizeThought(child.value) === normalizeThought(pivot.value))

  // TODO: This should never happen, but the Subthoughts test causes i === -1
  // if (i === -1) {
  //   console.warn('chain: contextChain pivot child not found in simplePath',pivot, simplePath)
  //   console.warn('simplePath', pathToContext(simplePath))
  //   console.warn('contextChain', contextChain)
  //   console.warn('pivot', pivot)
  // }

  const append = simplePath.slice(i - 1)
  const contexts = getContextsSortedAndRanked(state, pivot.value)
  const appendedThoughtInContext = contexts.find(
    child => normalizeThought(head(child.context)) === normalizeThought(append[0].value),
  )

  // keep the first segment intact
  // then remove the overlapping head of each one after
  return contextChain
    .concat([
      appendedThoughtInContext
        ? [{ value: append[0].value, rank: appendedThoughtInContext.rank }].concat(append.slice(1))
        : append,
    ] as SimplePath[])
    .map((thoughts, i) => (i > 0 ? splice(thoughts, 1, 1) : thoughts))
    .flat() as Path
}

export default chain
