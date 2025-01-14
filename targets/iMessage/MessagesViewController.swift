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

@Observable
class CurrentMode {
  var mode = ViewType.login
}


class MessagesViewController: MSMessagesAppViewController {
  @State private var currentMode = CurrentMode()
    
    // MARK: Properties
    
    override func willBecomeActive(with conversation: MSConversation) {
        super.willBecomeActive(with: conversation)
        FirebaseApp.configure()
        
        do {
          try Auth.auth().useUserAccessGroup("SYV2CK2N9N.com.Archimedes4.UTTT")
        } catch let error as NSError {
          print("Error changing user access group: %@", error)
        }
        
        // Present the view controller appropriate for the conversation and presentation style.
        presentViewController(for: conversation, with: presentationStyle)
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
    
    /// - Tag: PresentViewController
    private func presentViewController(for conversation: MSConversation, with presentationStyle: MSMessagesAppPresentationStyle) {
        // Remove any child view controllers that have been presented.
        removeAllChildViewControllers()
        
        let controller: UIViewController
        if presentationStyle == .compact {
            // Show a list of previously created ice creams.
          controller = UIHostingController(rootView: ViewController(addMessage: { 
            conversation.send(self.composeMessage(session: conversation.selectedMessage?.session))
          }).environment(currentMode))

        } else {
             // Parse an `IceCream` from the conversation's `selectedMessage` or create a new `IceCream`.
          controller = UIHostingController(rootView: ViewController(addMessage: { 
            conversation.send(self.composeMessage(session: conversation.selectedMessage?.session))
          }).environment(currentMode))
        }
      
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
  
    fileprivate func composeMessage(session: MSSession? = nil) -> MSMessage {
        
        let layout = MSMessageTemplateLayout()
        layout.caption = "Do you want to join the game?"
        
        let message = MSMessage(session: session ?? MSSession())
        message.layout = layout
        
        return message
    }
}

