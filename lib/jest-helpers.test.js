/* eslint-env jest */

const cheerio = require('cheerio')

const { runAccessibilityTests, toHaveNoViolations } = require('./jest-helpers')

const failingAxeResults = {
  violations: [
    {
      id: 'image-alt',
      impact: 'critical',
      tags: [
        'cat.text-alternatives',
        'wcag2a',
        'wcag111',
        'section508',
        'section508.22.a'
      ],
      description: 'Ensures <img> elements have alternate text or a role of none or presentation',
      help: 'Images must have alternate text',
      helpUrl: 'https://dequeuniversity.com/rules/axe/2.6/image-alt?application=axeAPI',
      nodes: [
        {
          any: [
            {
              id: 'has-alt',
              data: null,
              relatedNodes: [],
              impact: 'critical',
              message: 'Element does not have an alt attribute'
            },
            {
              id: 'aria-label',
              data: null,
              relatedNodes: [],
              impact: 'serious',
              message: 'aria-label attribute does not exist or is empty'
            },
            {
              id: 'aria-labelledby',
              data: null,
              relatedNodes: [],
              impact: 'serious',
              message: 'aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty or not visible'
            },
            {
              id: 'non-empty-title',
              data: null,
              relatedNodes: [],
              impact: 'serious',
              message: 'Element has no title attribute or the title attribute is empty'
            },
            {
              id: 'role-presentation',
              data: null,
              relatedNodes: [],
              impact: 'minor',
              message: 'Element\'s default semantics were not overridden with role="presentation"'
            },
            {
              id: 'role-none',
              data: null,
              relatedNodes: [],
              impact: 'minor',
              message: 'Element\'s default semantics were not overridden with role="none"'
            }
          ],
          all: [],
          none: [],
          impact: 'critical',
          html: '<img src="">',
          target: [ 'body > img' ],
          failureSummary: 'Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty or not visible\n  Element has no title attribute or the title attribute is empty\n  Element\'s default semantics were not overridden with role="presentation"\n  Element\'s default semantics were not overridden with role="none"'
        }
      ]
    }
  ]
}

const successfulAxeResults = {
  violations: []
}

const $failingHtmlExample = cheerio.load(`
  <html>
    <body>
      <a href="#"></a>
    </body>
  </html>
`)

const $goodHtmlExample = cheerio.load(`
  <html>
    <body>
      <a href="http://gov.uk">Visit GOV.UK</a>
    </body>
  </html>
`)

describe('Jest helpers', () => {
  describe('runAccessibilityTests', () => {
    it('returns an axe results object', async () => {
      const results = await runAccessibilityTests($failingHtmlExample)
      expect(typeof results).toBe('object')
      expect(typeof results.violations).toBe('object')
    })

    it('returns violations for failing html example', async () => {
      const results = await runAccessibilityTests($failingHtmlExample)
      const violation = results.violations[0]
      expect(violation.id).toBe('link-name')
      expect(violation.description).toBe('Ensures links have discernible text')
    })

    it('can ignore allowed failures', async () => {
      const results = await runAccessibilityTests($failingHtmlExample, {
        rules: {
          'link-name': { enabled: false }
        }
      })
      const violations = results.violations
      expect(violations.length).toBe(0)
    })

    it('returns no violations for a good html example', async () => {
      const results = await runAccessibilityTests($goodHtmlExample)
      const violations = results.violations
      expect(violations.length).toBe(0)
    })
  })
  describe('toHaveNoViolations', () => {
    it('returns a jest matcher object with object', () => {
      const matcherFunction = toHaveNoViolations.toHaveNoViolations
      expect(matcherFunction).toBeDefined()
      expect(typeof matcherFunction).toBe('function')
    })

    it('throws error if non axe results object is passed', () => {
      const matcherFunction = toHaveNoViolations.toHaveNoViolations
      expect(() => {
        matcherFunction({})
      }).toThrow('No violations found in aXe results object')
    })

    it('returns pass as true when no violations are present', () => {
      const matcherFunction = toHaveNoViolations.toHaveNoViolations
      const matcherOutput = matcherFunction(successfulAxeResults)
      expect(matcherOutput.pass).toBe(true)
    })

    it('returns same violations that are passed in the results object', () => {
      const matcherFunction = toHaveNoViolations.toHaveNoViolations
      const matcherOutput = matcherFunction(failingAxeResults)
      expect(matcherOutput.actual).toBe(failingAxeResults.violations)
    })

    it('returns correctly formatted message when violations are present', () => {
      const matcherFunction = toHaveNoViolations.toHaveNoViolations
      const matcherOutput = matcherFunction(failingAxeResults)
      expect(typeof matcherOutput.message).toBe('function')
      expect(matcherOutput.message()).toMatchSnapshot()
    })

    it('returns pass as false when violations are present', () => {
      const matcherFunction = toHaveNoViolations.toHaveNoViolations
      const matcherOutput = matcherFunction(failingAxeResults)
      expect(matcherOutput.pass).toBe(false)
    })
  })
})
