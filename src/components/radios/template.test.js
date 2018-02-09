/* globals describe, it, expect */

const { render, getExamples, htmlWithClassName } = require(
  '../../../lib/jest-helpers'
)

const axe = require('axe-core')

const examples = getExamples('radios')

expect.extend({
  toHaveNoAxeViolations (violation, expected) {


    var _renderNode = function (node) {
      return ' Check the HTML:\n' +
        ' `' +
        node.html +
        '`\n' +
        ' found with the selector:\n' +
        ' "' +
        node.target.join(', ') +
        '"'
    }

    const reporter = violations => {
      if (typeof violations !== 'undefined' && violations.length !== 0) {
        return violations.map(function (violation) {
          var help = 'Problem: ' + violation.help + ' (' + violation.id + ')'
          var helpUrl = 'Try fixing it with this help: ' + violation.helpUrl
          var htmlAndTarget = violation.nodes.map(_renderNode).join('\n\n')

          return [ help, htmlAndTarget, helpUrl ].join('\n\n\n')
        }).join('\n\n- - -\n\n')
      } else {
        return false
      }
    }

    const formatedViolations = reporter(violation)
    const pass = formatedViolations.length === 0

    const message = () => formatedViolations

    return { actual: violation, message, pass }
  }
})

describe('Radios', () => {
  it('default passes aXe', done => {
    const $ = render('radios', examples.default)

    document.body.innerHTML = $('body').html()

    const options = {
      rules: {
        'landmark-one-main': { enabled: false },
        // Esnures each document has a <main> attribute
        'document-title': { enabled: false },
        // Ensures each HTML document contains a non-empty <title> element
        'html-has-lang': { enabled: false },
        // Ensures every HTML document has a lang attribute
        // Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content
        bypass: { enabled: false }
      }
    }

    // expect(true).toEqual(false)

    axe.run(document, options, (err, results) => {
      if (err) throw err
      // aXe captures thrown errors so use a setTimeout to avoid this.
      // setTimeout(() => {
          // expect(reporter(results.violations)).toEqual([])
        expect(results.violations).toHaveNoAxeViolations()
        try {
        } catch (e) {
          // swallow errors that make jest messy
        }
        done()
      // }, 0)
    })
  })

  it('render example with minimum required name and items', () => {
    const $ = render('radios', {
      name: 'example-name',
      items: [ { value: 'yes', text: 'Yes' }, { value: 'no', text: 'No' } ]
    })

    const $component = $('.govuk-c-radios')

    const $firstInput = $component.find(
      '.govuk-c-radios__item:first-child input'
    )
    const $firstLabel = $component.find(
      '.govuk-c-radios__item:first-child label'
    )
    expect($firstInput.attr('name')).toEqual('example-name')
    expect($firstInput.val()).toEqual('yes')
    expect($firstLabel.text()).toContain('Yes')

    const $lastInput = $component.find(
      '.govuk-c-radios__item:last-child input'
    )
    const $lastLabel = $component.find(
      '.govuk-c-radios__item:last-child label'
    )
    expect($lastInput.attr('name')).toEqual('example-name')
    expect($lastInput.val()).toEqual('no')
    expect($lastLabel.text()).toContain('No')
  })

  it('render classes', () => {
    const $ = render('radios', {
      name: 'example-name',
      items: [ { value: 'yes', text: 'Yes' }, { value: 'no', text: 'No' } ],
      classes: 'app-c-radios--custom-modifier'
    })

    const $component = $('.govuk-c-radios')

    expect($component.hasClass('app-c-radios--custom-modifier')).toBeTruthy()
  })

  it('render attributes', () => {
    const $ = render('radios', {
      name: 'example-name',
      items: [ { value: 'yes', text: 'Yes' }, { value: 'no', text: 'No' } ],
      attributes: {
        'data-attribute': 'value',
        'data-second-attribute': 'second-value'
      }
    })

    const $component = $('.govuk-c-radios')

    expect($component.attr('data-attribute')).toEqual('value')
    expect($component.attr('data-second-attribute')).toEqual('second-value')
  })

  describe('items', () => {
    it('render a matching label and input using name by default', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [ { value: 'yes', text: 'Yes' }, { value: 'no', text: 'No' } ]
      })

      const $component = $('.govuk-c-radios')

      const $firstInput = $component.find(
        '.govuk-c-radios__item:first-child input'
      )
      const $firstLabel = $component.find(
        '.govuk-c-radios__item:first-child label'
      )
      expect($firstInput.attr('id')).toEqual('example-name-1')
      expect($firstLabel.attr('for')).toEqual('example-name-1')

      const $lastInput = $component.find(
        '.govuk-c-radios__item:last-child input'
      )
      const $lastLabel = $component.find(
        '.govuk-c-radios__item:last-child label'
      )
      expect($lastInput.attr('id')).toEqual('example-name-2')
      expect($lastLabel.attr('for')).toEqual('example-name-2')
    })

    it('render a matching label and input using custom idPrefix', () => {
      const $ = render('radios', {
        idPrefix: 'custom',
        name: 'example-name',
        items: [ { value: 'yes', text: 'Yes' }, { value: 'no', text: 'No' } ]
      })

      const $component = $('.govuk-c-radios')

      const $firstInput = $component.find(
        '.govuk-c-radios__item:first-child input'
      )
      const $firstLabel = $component.find(
        '.govuk-c-radios__item:first-child label'
      )
      expect($firstInput.attr('id')).toEqual('custom-1')
      expect($firstLabel.attr('for')).toEqual('custom-1')

      const $lastInput = $component.find(
        '.govuk-c-radios__item:last-child input'
      )
      const $lastLabel = $component.find(
        '.govuk-c-radios__item:last-child label'
      )
      expect($lastInput.attr('id')).toEqual('custom-2')
      expect($lastLabel.attr('for')).toEqual('custom-2')
    })

    it('render disabled', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          { value: 'yes', text: 'Yes', disabled: true },
          { value: 'no', text: 'No', disabled: true }
        ]
      })

      const $component = $('.govuk-c-radios')

      const $firstInput = $component.find(
        '.govuk-c-radios__item:first-child input'
      )
      expect($firstInput.attr('disabled')).toEqual('disabled')

      const $lastInput = $component.find(
        '.govuk-c-radios__item:last-child input'
      )
      expect($lastInput.attr('disabled')).toEqual('disabled')
    })

    it('render checked', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No', checked: true }
        ]
      })

      const $component = $('.govuk-c-radios')
      const $lastInput = $component.find(
        '.govuk-c-radios__item:last-child input'
      )
      expect($lastInput.attr('checked')).toEqual('checked')
    })
  })

  describe('nested dependant components', () => {
    it('passes through label params without breaking', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          {
            value: 'yes',
            html: '<b>Yes</b>',
            label: {
              attributes: {
                'data-attribute': 'value',
                'data-second-attribute': 'second-value'
              }
            }
          },
          { value: 'no', text: '<b>No</b>', checked: true }
        ]
      })

      expect(htmlWithClassName($, '.govuk-c-radios__label')).toMatchSnapshot()
    })

    it('passes through fieldset params without breaking', () => {
      const $ = render('radios', examples['with-extreme-fieldset'])

      expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
      expect(htmlWithClassName($, '.govuk-c-fieldset')).toMatchSnapshot()
    })

    it('passes through html fieldset params without breaking', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [ { value: 'yes', text: 'Yes' }, { value: 'no', text: 'No' } ],
        fieldset: {
          legendText: 'Have <b>you</b> changed your name?',
          legendHintHtml: 'This <b>includes</b> changing your last name or spelling your name differently.'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-fieldset')).toMatchSnapshot()
    })
  })
})
