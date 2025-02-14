import { DOMParser } from "@xmldom/xmldom"

export function parseHxmlFragment(hxml: string, targetElement: Element, mode: 'replace' | 'append' | 'prepend') {
  // Parse HXML string into DOM elements
  const parser = new DOMParser()
  const doc = parser.parseFromString(hxml, 'application/xml')

  // Extract content - ensure we get the first element
  const content = doc.documentElement

  if (!content) {
    throw new Error('Failed to parse HXML content')
  }

  switch (mode) {
    case 'replace':
      // Clear existing content
      while (targetElement.firstChild) {
        targetElement.removeChild(targetElement.firstChild)
      }
      // Import and append the new content
      const importedNode = targetElement.ownerDocument?.importNode(content, true)
      if (importedNode) {
        targetElement.appendChild(importedNode)
      }
      break

    case 'append':
      const appendNode = targetElement.ownerDocument?.importNode(content, true)
      if (appendNode) {
        targetElement.appendChild(appendNode)
      }
      break

    case 'prepend':
      const prependNode = targetElement.ownerDocument?.importNode(content, true)
      if (prependNode) {
        targetElement.insertBefore(prependNode, targetElement.firstChild)
      }
      break
  }
}
