//
//  helpers.swift
//  iMessage
//
//  Created by Andrew Mainella on 2025-01-30.
//

import Foundation
extension URL {
  /**
      This will return the paths so a url like https://hello/world would return ["hello", "world"]
        Some other exampes https:/// -> []
        An invalid entry will return []
   */
  func toPathComponents() -> [String] {
    var components = self.absoluteString.components(separatedBy: "/")
    if (components.count <= 2) {
      // This is invalid
      return []
    }
    components.removeFirst()
    components.removeFirst()
    components.removeAll(where: {$0 == ""})
    
    return components
  }
}
