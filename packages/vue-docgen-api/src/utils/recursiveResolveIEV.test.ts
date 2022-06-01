import { SpyInstance } from 'vitest'
import makePathResolver from './makePathResolver'
import recursiveResolveIEV from './recursiveResolveIEV'
import { ImportedVariableSet } from './resolveRequired'

vi.mock('../resolveImmediatelyExported')

describe('recursiveResolveIEV', () => {
	let set: ImportedVariableSet
	let mockResolver: SpyInstance<
		[filePath: string, originalDirNameOverride?: string | undefined],
		string | null
	>
	const spies = {
		pathResolver: makePathResolver('my', {}, [])
	}
	beforeEach(() => {
		set = { test: { filePath: ['my/path'], exportName: 'exportIt' } }
		mockResolver = vi.spyOn(spies, 'pathResolver')
	})

	it('should call the resolver', async () => {
		await recursiveResolveIEV(spies.pathResolver, set, () => true)
		expect(mockResolver).toHaveBeenCalledWith('my/path')
	})

	it('should not resolve anything if multiple path in filePath', async () => {
		set.test.filePath.push('baz')
		await recursiveResolveIEV(spies.pathResolver, set, () => true)

		expect(mockResolver).not.toHaveBeenCalledWith()
	})
})
