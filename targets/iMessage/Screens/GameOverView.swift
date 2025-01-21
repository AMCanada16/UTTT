
import SwiftUI


//TODO check that the game is in fact over
struct GameOverView: View {
  @EnvironmentObject var currentMode: CurrentMode
  @EnvironmentObject var useGame: UseGame
  
  func goBack() {
    currentMode.mode = ViewType.home
  }
  
  var body: some View {
    ZStack {
      GeometryReader { geometry in
        VStack {
          UTTTHeader()
          Text("Game Over!")
          let gameOver = Game().getGame(state: useGame.currentGame)?.gameOver
          if (gameOver == gridStateMode.full) {
            Text("The game ended in a tie!")
          } else if (gameOver == gridStateMode.o) {
            Text("O won the game!")
          } else if (gameOver == gridStateMode.x) {
            Text("X won the game!")
          }
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
      }
      VStack {
        HStack {
          Button(action: goBack) {
            Image(systemName: "arrowshape.backward.circle")
              .resizable()
              .frame(width: 40, height: 40)
              .foregroundStyle(.white)
          }
          .padding(.leading, 15)
          .padding(.top, 15)
          Spacer()
        }
        Spacer()
      }
    }
  }
}
