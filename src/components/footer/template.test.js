/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('footer')

describe('footer', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('footer', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  describe('meta', () => {
    it('passes accessibility tests', async () => {
      const $ = render('footer', examples['with-meta'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders heading', () => {
      const $ = render('footer', examples['with-meta'])

      const $component = $('.govuk-c-footer')
      const $heading = $component.find('h2.govuk-h-visually-hidden')
      expect($heading.text()).toEqual('Support links')
    })

    it('renders links', () => {
      const $ = render('footer', examples['with-meta'])

      const $component = $('.govuk-c-footer')
      const $list = $component.find('ul.govuk-c-footer__inline-list')
      const $items = $list.find('li.govuk-c-footer__inline-list-item')
      const $firstItem = $items.find('a.govuk-c-footer__link:first-child')
      expect($items.length).toEqual(4)
      expect($firstItem.attr('href')).toEqual('#1')
      expect($firstItem.text()).toContain('Item 1')
    })

    it('renders html', () => {
      const $ = render('footer', {
        meta: {
          items: [
            {
              html: 'example <b>HTML</b> content'
            }
          ]
        }
      })

      const $component = $('.govuk-c-footer')
      const $list = $component.find('ul.govuk-c-footer__inline-list')
      const $item = $list.find('li.govuk-c-footer__inline-list-item')
      expect($item.html()).toContain('example <b>HTML</b> content')
    })
  })

  describe('navigation', () => {
    it('passes accessibility tests', async () => {
      const $ = render('footer', examples['with-navigation'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders headings', () => {
      const $ = render('footer', examples['with-navigation'])

      const $component = $('.govuk-c-footer')
      const $firstSection = $component.find('.govuk-c-footer__section:first-child')
      const $lastSection = $component.find('.govuk-c-footer__section:last-child')
      const $firstHeading = $firstSection.find('h2.govuk-c-footer__heading')
      const $lastHeading = $lastSection.find('h2.govuk-c-footer__heading')
      expect($firstHeading.text()).toEqual('Two column list')
      expect($lastHeading.text()).toEqual('Single column list')
    })

    it('renders lists of links', () => {
      const $ = render('footer', examples['with-navigation'])

      const $component = $('.govuk-c-footer')
      const $list = $component.find('ul.govuk-c-footer__list')
      const $items = $list.find('li.govuk-c-footer__list-item')
      const $firstItem = $items.find('a.govuk-c-footer__link:first-child')
      expect($items.length).toEqual(9)
      expect($firstItem.attr('href')).toEqual('#1')
      expect($firstItem.text()).toContain('Navigation item 1')
    })

    it('renders lists in columns', () => {
      const $ = render('footer', examples['with-navigation'])

      const $component = $('.govuk-c-footer')
      const $list = $component.find('ul.govuk-c-footer__list')
      expect($list.hasClass('govuk-c-footer__list--columns-2')).toBeTruthy()
    })
  })
})
