import { DynamicHtmlAdapter } from '../../../../src/core/adapters/dynamic-html-adapter'
import { IAdapter, InsertionType } from '../../../../src/core/adapters/interface'

import { describe, expect, it, beforeEach } from '@jest/globals'

import { dynamicHtmlAdapterDataStr } from '../../../data/adapters/dynamic-html-adapter-constants'
import { mockedJsonParser, mockedTreeBuilder } from '../../../helpers'

const NS = 'https://dapplets.org/ns/engine'

describe('dynamic-html-adapter', () => {
  let dynamicAdapter: IAdapter
  let mockedSite: HTMLDivElement

  beforeEach(() => {
    mockedSite = document.createElement('div')
    mockedSite.innerHTML = dynamicHtmlAdapterDataStr

    dynamicAdapter = new DynamicHtmlAdapter(mockedSite, mockedTreeBuilder, NS, mockedJsonParser)
    dynamicAdapter.start()
  })

  it('parse adapter context', () => {
    // Arrange
    const expected = {
      id: 'root',
      insPoints: ['rootPoints'],
      namespaceURI: NS,
      parentNode: null,
      parsedContext: {
        fullname: 'Test-fullname',
        id: 'root',
        img: 'https://img.com/profile_images/id/Q_300x300.jpg',
        username: '2',
      },
      tagName: 'root',
    }

    // Act
    const node = dynamicAdapter.context

    // Assert

    expect(node.id).toBe(expected.id)
    expect(node.insPoints).toStrictEqual(expected.insPoints)
    expect(node.namespaceURI).toBe(expected.namespaceURI)
    expect(node.parentNode).toBe(expected.parentNode)
    expect(node.parsedContext).toStrictEqual(expected.parsedContext)
    expect(node.tagName).toBe(expected.tagName)
  })

  it('append node', async () => {
    // Arrange
    expect(dynamicAdapter.context.children.length).toBe(2)

    const mockedParentNode = mockedSite.getElementsByClassName('root-selector')[0]

    const expected = document.createElement('div')
    expected.innerHTML = `
    <div class="post-selector-point" id="post" data-testid="postTestId">
        <div class="post-root-selector" data-testid='postText' data-bos-layout-manager="layoutManager1">Post Root Insertion Point Content</div>
        <div class="post-text-selector" data-bos-layout-manager="layoutManager1">Post Text Insertion Point Content</div>
    </div>
    `

    // Act
    mockedParentNode.append(expected)
    await new Promise((res) => setTimeout(res, 1000))

    // Assert
    expect(dynamicAdapter.context.children.length).toBe(3)
    expect(expected.parentElement).toBe(mockedParentNode)
  })

  it('remove node', async () => {
    // Arrange
    expect(dynamicAdapter.context.children.length).toBe(2)

    // Act
    mockedSite.getElementsByClassName('post-selector-point')[0].remove()
    await new Promise((res) => setTimeout(res, 1000))

    // Assert
    expect(dynamicAdapter.context.children.length).toBe(1)
  })

  it('change node text content', async () => {
    // Arrange
    expect(dynamicAdapter.context.parsedContext?.username).toBe('2')

    // Act
    mockedSite.querySelector('div[data-testid="UserName"]>span')!.textContent = '58392'
    await new Promise((res) => setTimeout(res, 1000))

    // Assert
    expect(dynamicAdapter.context.parsedContext?.username).toBe('58392')
  })

  it('change node parameter value', async () => {
    // Arrange
    expect(dynamicAdapter.context.parsedContext?.img).toBe(
      'https://img.com/profile_images/id/Q_300x300.jpg'
    )

    const imageNode: HTMLImageElement = mockedSite.querySelector(
      'div[aria-label="Account menu"]>img'
    )!
    expect(imageNode.getAttribute('src')).toBe('https://img.com/profile_images/id/Q_300x300.jpg')

    // Act
    imageNode.setAttribute('src', 'https://img.com/profile_images/id/QXWR_1300x1300.jpg')
    await new Promise((res) => setTimeout(res, 1000))

    // Assert
    expect(dynamicAdapter.context.parsedContext?.img).toBe(
      'https://img.com/profile_images/id/QXWR_1300x1300.jpg'
    )
  })

  it('change child node content', async () => {
    // Arrange
    expect(dynamicAdapter.context.children[0]!.parsedContext!.text).toBe(
      'Post Root Insertion Point Content'
    )
    expect(mockedSite.getElementsByClassName('post-root-selector')[0].textContent).toBe(
      'Post Root Insertion Point Content'
    )

    // Act
    mockedSite.getElementsByClassName('post-root-selector')[0].textContent = 'Let it be, let it be!'
    await new Promise((res) => setTimeout(res, 1000))

    // Assert
    expect(dynamicAdapter.context.children[0]!.parsedContext!.text).toBe('Let it be, let it be!')
  })

  it('inject element before', () => {
    // Arrange
    const elToInject = document.createElement('p')
    elToInject.setAttribute('id', 'inject')
    elToInject.innerText = 'Injecting Widget'

    const targetNode = mockedSite.getElementsByClassName('post-selector-point')[0]

    // Act
    dynamicAdapter.injectElement(
      elToInject,
      dynamicAdapter.context,
      'rootPoints',
      InsertionType.Before
    ) // ToDo: 4-th param shold be like in the config (will be removed)

    // Assert
    expect(mockedSite.querySelector('p')).toBe(elToInject)
    expect(mockedSite.querySelector('p')!.getAttribute('id')).toBe('inject')
    expect(mockedSite.querySelector('p')!.previousElementSibling).toBeNull()
    expect(mockedSite.querySelector('p')!.nextElementSibling).toBe(targetNode)
  })

  it('inject element after', () => {
    // Arrange
    const elToInject = document.createElement('p')
    elToInject.setAttribute('id', 'inject')
    elToInject.innerText = 'Injecting Widget'

    const targetNode = mockedSite.getElementsByClassName('post-selector-point')[0]
    const nextNode = mockedSite.getElementsByClassName('profile-selector')[0]

    // Act
    dynamicAdapter.injectElement(
      elToInject,
      dynamicAdapter.context,
      'rootPoints',
      InsertionType.After
    ) // ToDo: 4-th param shold be like in the config (will be removed)

    // Assert
    expect(mockedSite.querySelector('p')).toStrictEqual(elToInject)
    expect(mockedSite.querySelector('p')!.getAttribute('id')).toBe('inject')
    expect(mockedSite.querySelector('p')!.previousElementSibling).toBe(targetNode)
    expect(mockedSite.querySelector('p')!.nextElementSibling).toBe(nextNode)
  })

  it('inject element end', () => {
    // Arrange
    const elToInject = document.createElement('a')
    elToInject.setAttribute('id', 'injectEnd')
    elToInject.innerText = 'Injecting Widget'

    const lastChildOfTarget = mockedSite.getElementsByClassName('post-text-selector')[0]

    // Act
    dynamicAdapter.injectElement(
      elToInject,
      dynamicAdapter.context,
      'rootPoints',
      InsertionType.End
    ) // ToDo: 4-th param shold be like in the config (will be removed)

    // Assert
    expect(mockedSite.querySelector('a')).toStrictEqual(elToInject)
    expect(mockedSite.querySelector('a')?.getAttribute('id')).toBe('injectEnd')
    expect(mockedSite.querySelector('a')?.previousElementSibling).toBe(lastChildOfTarget)
    expect(mockedSite.querySelector('a')?.nextElementSibling).toBeNull()
  })

  it('inject element begin', () => {
    // Arrange
    const elToInject = document.createElement('a')
    elToInject.setAttribute('id', 'injectBegin')
    elToInject.innerText = 'Injecting Widget'

    const firstChildOfTarget = mockedSite.getElementsByClassName('post-root-selector')[0]
    // Act
    dynamicAdapter.injectElement(
      elToInject,
      dynamicAdapter.context,
      'rootPoints',
      InsertionType.Begin
    ) // ToDo: 4-th param shold be like in the config (will be removed)

    // Assert
    expect(mockedSite.querySelector('a')).toStrictEqual(elToInject)
    expect(mockedSite.querySelector('a')?.getAttribute('id')).toBe('injectBegin')
    expect(mockedSite.querySelector('a')?.previousElementSibling).toBeNull()
    expect(mockedSite.querySelector('a')?.nextElementSibling).toBe(firstChildOfTarget)
  })

  it('get insertion points', () => {
    // Arrange
    const expected = [
      {
        name: 'rootPoints',
        insertionType: 'after',
        bosLayoutManager: 'layoutManager1',
      },
      {
        name: 'inject',
        insertionType: 'after',
        bosLayoutManager: 'layoutManager1',
      },
    ]
    // Act
    const actual = dynamicAdapter.getInsertionPoints(dynamicAdapter.context)
    // Assert
    expect(actual).toStrictEqual(expected)
  })

  // ToDo: test getInsertionPoints() for other contexts

  // ToDo: test stop()
})
