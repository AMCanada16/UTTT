# UTTT
React Native Ultimate Tic Tac Toe

## Note when building
Make sure that Stickers Icon Role in Build Settings is set to Extension

## Stack
Framework
Expo
React
React Nativ
Tensorflow

Storage
Redux
Redux Toolkit

## Hosting
Firebase

The Admin functions to delete a user are hosted on aws lambda in my functions.

# iMessage Game
If the game is run on iMessage the game is always online. The user also has to be authenticated, there cannot be annoymous auth because something could make them unable to sign into their account. If they want to be annoymous they can just use a private relay.

## No google sign in
Because the iMessage extension is an app extension, the google sign in does not work. So the user needs to sign in.


## Thing to change in the iMessage build settings 
1. The iMessage App Icon needs to be named `App Icon`
2. Stickers Icon role needs to make to extension.
3. Generate Info.plist file needs to be set to No

## Env
There needs to be a GoogleService-Info.plist in the root directory. This can be downloaded from firebase.