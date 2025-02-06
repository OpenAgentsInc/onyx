import { DOMParser } from '@xmldom/xmldom'

export function parseHxmlFragment(hxml: string, targetElement: Element, mode: 'replace' | 'append' | 'prepend') {
  // Parse HXML string into DOM elements
  const parser = new DOMParser()
  const doc = parser.parseFromString(hxml, 'application/xml')
  
  // Extract content
  const content = doc.documentElement
  
  switch (mode) {
    case 'replace':
      while (targetElement.firstChild) {
        targetElement.removeChild(targetElement.firstChild)
      }
      targetElement.appendChild(content)
      break
      
    case 'append':
      targetElement.appendChild(content)
      break
      
    case 'prepend':
      targetElement.insertBefore(content, targetElement.firstChild)
      break
  }
}