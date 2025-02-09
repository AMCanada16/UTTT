/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
The root view controller shown by the Messages app.
*/

import UIKit
import Messages
import SwiftUI
import Firebase
import FirebaseAuth

class CurrentMode: ObservableObject {
  @Published var mode = ViewType.login
  @Published var previousMode = ViewType.login
}

class MessagesViewController: MSMessagesAppViewController {
  var currentMode = CurrentMode()
  var useGame =  UseGame()
  
  // MARK: Properties
  
  override func willBecomeActive(with conversation: MSConversation) {
    super.willBecomeActive(with: conversation)
    FirebaseApp.configure()
    
    do {
      try Auth.auth().useUserAccessGroup("SYV2CK2N9N.Archimedes4.UTTT.iMessage")
    } catch let error as NSError {
      print("Error changing user access group: %@", error)
    }
    
    // Present the view controller appropriate for the conversation and presentation style.
    presentViewController(for: conversation, with: presentationStyle)
    
    if let pathComps = conversation.selectedMessage?.url?.toPathComponents() {
      handleMessageSelection(components: pathComps)
    }
  }
  
  // MARK: MSMessagesAppViewController overrides
  
  override func willTransition(to presentationStyle: MSMessagesAppPresentationStyle) {
      super.willTransition(to: presentationStyle)
      
      // Hide child view controllers during the transition.
      removeAllChildViewControllers()
  }
  
  override func didTransition(to presentationStyle: MSMessagesAppPresentationStyle) {
      super.didTransition(to: presentationStyle)
      
      // Present the view controller appropriate for the conversation and presentation style.
      guard let conversation = activeConversation else { fatalError("Expected an active converstation") }
      presentViewController(for: conversation, with: presentationStyle)
  }
  
  // MARK: Child view controller presentation
  
  override func willSelect(_ message: MSMessage, conversation: MSConversation) {
    guard let url = message.url else {
      return
    }
    let pathComps = url.toPathComponents()
    handleMessageSelection(components: pathComps)
  }
  
  /// - Tag: PresentViewController
  private func presentViewController(for conversation: MSConversation, with presentationStyle: MSMessagesAppPresentationStyle) {
    // Remove any child view controllers that have been presented.
    removeAllChildViewControllers()
    
    let controller: UIViewController
    controller = UIHostingController(rootView: ViewController(currentMode: currentMode, useGame: useGame, addMessage: { message, url in
      conversation.send(self.composeMessage(session: conversation.selectedMessage?.session, caption: message, url: url))
    }))
    
    addChild(controller)
    controller.view.frame = view.bounds
    controller.view.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(controller.view)
    
    NSLayoutConstraint.activate([
        controller.view.leftAnchor.constraint(equalTo: view.leftAnchor),
        controller.view.rightAnchor.constraint(equalTo: view.rightAnchor),
        controller.view.topAnchor.constraint(equalTo: view.topAnchor),
        controller.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    
    controller.didMove(toParent: self)
  }
  
  // MARK: Convenience
  
  private func removeAllChildViewControllers() {
      for child in children {
          child.willMove(toParent: nil)
          child.view.removeFromSuperview()
          child.removeFromParent()
      }
  }

  fileprivate func composeMessage(session: MSSession? = nil, caption: String, url: String) -> MSMessage {
    let layout = MSMessageTemplateLayout()
    layout.caption = caption
    
    let url = URL(string: url)
    
    let message = MSMessage(session: session ?? MSSession())
    message.layout = layout
    message.summaryText = caption;
    message.url = url;
    
    return message
  }
  
  private func handleMessageSelection(components: [String]) {
    if (components.count >= 1) {
      if (components[0] == "join" && components.count == 2) {
        useGame.joinId = components[1]
        currentMode.mode = ViewType.join
      } else if (components[0] == "game" && components.count == 2) {
        useGame.updateGameId(gameId: components[1])
        currentMode.mode = ViewType.game
      }
    }
  }
}

