'use strict'

const path = require('path')
const fs = require('fs')
const nunjucks = require('nunjucks')
const cheerio = require('cheerio')
const yaml = require('js-yaml')
const axe = require('axe-core')
const merge = require('lodash/merge')
const { printReceived, matcherHint } = require('jest-matcher-utils')

const configPaths = require('../config/paths.json')

nunjucks.configure(configPaths.components, {
  trimBlocks: true,
  lstripBlocks: true
})

/**
 * Render a component's template for testing
 * @param {string} componentName
 * @param {string} params parameters that are used in the component template
 * @returns {function} returns cheerio (jQuery) instance of the template for easy DOM querying
 */
function render (componentName, params) {
  const output = nunjucks.render(componentName + '/template.njk', { params })
  return cheerio.load(output)
}

/**
 * Get examples from a component's metadata file
 * @param {string} componentName
 * @returns {object} returns object that includes all examples at once
 */
function getExamples (componentName) {
  const file = fs.readFileSync(
    path.join(configPaths.components, componentName, `${componentName}.yaml`),
    'utf8'
  )

  const docs = yaml.safeLoad(file)

  const examples = {}

  for (let example of docs.examples) {
    examples[example.name] = example.data
  }

  return examples
}

/**
 * Get the raw HTML representation of a component, and remove any other
 * child elements that do not match the component.
 * Relies on B.E.M naming ensuring that child components relating to a component
 * are namespaced.
 * @param {function} $ requires an instance of cheerio (jQuery) that includes the
 * rendered component.
 * @param {string} className the top level class 'Block' in B.E.M terminology
 * @returns {string} returns HTML
 */
function htmlWithClassName ($, className) {
  const $component = $(className)
  const classSelector = className.replace('.', '')
  // Remove all other elements that do not match this component
  $component.find(`[class]:not([class^=${classSelector}])`).remove()
  return $.html($component)
}

/**
 * Small wrapper for axe-core#run that enables promises (required for Jest),
 * default options and injects a cheerio (jQuery) instance into jsdom
 * @param {function} $ requires a cheerio (jQuery) instance
 * @param {object} [additionalOptions] aXe options to merge with default options
 * @returns {promise} returns promise that will resolve with axe-core#run results object
 */
function runAccessibilityTests ($, additionalOptions = {}) {
  // aXe requires real Nodes so we need to inject into Jests' jsdom document.
  document.body.innerHTML = $('body').html()

  const defaultOptions = {}

  const options = merge(defaultOptions, additionalOptions)

  return new Promise((resolve, reject) => {
    axe.run(document.body, options, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
}

/**
 * Custom jest expect matcher, that can check aXe results for violations.
 * @param {results} object requires an instance of aXe's results object
 * (https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#results-object)
 * @returns {object} returns jest matcher object
 */
const toHaveNoViolations = {
  toHaveNoViolations (results) {
    const violations = results.violations

    if (typeof violations === 'undefined') {
      throw new Error('No violations found in aXe results object')
    }

    const reporter = violations => {
      if (violations.length === 0) {
        return []
      }

      const lineBreak = '\n\n'
      const horizontalLine = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'

      return violations.map(violation => {
        var htmlAndTarget = violation.nodes.map(node => {
          const selector = node.target.join(', ')
          return (
            `Expected the HTML found at $('${selector}') to have no violations:` +
            lineBreak +
            node.html
          )
        }).join(lineBreak)

        return (
          htmlAndTarget +
          lineBreak +
          `Recieved: ` +
          lineBreak +
          printReceived(`${violation.help} (${violation.id})`) +
          lineBreak +
          `Try fixing it with this help: ${violation.helpUrl}`
        )
      }).join(lineBreak + horizontalLine + lineBreak)
    }

    const formatedViolations = reporter(violations)
    const pass = formatedViolations.length === 0

    const message = () => {
      if (pass) {
        return
      }
      return matcherHint('.toHaveNoViolations') +
            '\n\n' +
            `${formatedViolations}`
    }

    return { actual: violations, message, pass }
  }
}

module.exports = {
  render,
  getExamples,
  htmlWithClassName,
  runAccessibilityTests,
  toHaveNoViolations
}
