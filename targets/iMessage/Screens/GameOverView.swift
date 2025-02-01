
import SwiftUI


//TODO check that the game is in fact over
struct GameOverView: View {
  @EnvironmentObject var currentMode: CurrentMode;
  @EnvironmentObject var useGame: UseGame;
  
  var body: some View {
    ZStack {
      GeometryReader { geometry in
        VStack {
          UTTTHeader()
          Text("Game Over!")
            .foregroundStyle(.white)
          let gameOver = Game().getGame(state: useGame.currentGame)?.gameOver
          if (gameOver == gridStateMode.full) {
            Text("The game ended in a tie!")
              .foregroundStyle(.white)
          } else if (gameOver == gridStateMode.o) {
            Text("O won the game!")
              .foregroundStyle(.white)
          } else if (gameOver == gridStateMode.x) {
            Text("X won the game!")
              .foregroundStyle(.white)
          }
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
      }
      BackButton(goBack: {
        currentMode.mode = ViewType.home;
      })
    }
  }
}
