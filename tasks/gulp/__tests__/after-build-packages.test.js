/* eslint-env jest */

const lib = require('../../../lib/file-helper')

describe('building packages/', () => {
  describe('when running copy-to-destination', () => {
    // Check to have all the components packages and nothing else
    it('should copy all components packages', () => {
      let expectedPackagesComponentList = lib.SrcComponentList.slice()
      expectedPackagesComponentList.sort()
      expect(lib.PackagesComponentList).toEqual(expectedPackagesComponentList)
    })
  })

  function defineTestsForComponent (componentName) {
    describe('when publishing ' + componentName, () => {
      // Check component files in packages
      it('should copy the right files to packages', () => {
        let actualPackagesFiles = lib.packagesFilesForComponent(componentName)
        let expectedPackagesFiles = lib.expectedPackagesFilesForComponent(componentName)
        expect(actualPackagesFiles).toEqual(expectedPackagesFiles)
      })
    })
  }

  lib.SrcComponentList.forEach((componentName) => {
    defineTestsForComponent(componentName)
  })
})
