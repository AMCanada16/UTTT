/*
  UTTT
  Andrew Mainella
  8 May 2024
  _layout.tsx

*/
import RootLayout from "@components/RootLayout";
import * as Sentry from '@sentry/react-native';

/**
 * The the main function for the app holds providers.
 * @returns The app
 */
function AppContainer() {
  return <RootLayout />
}


Sentry.init({
  dsn: 'https://654d48ea7630611874fb4a0ba8029b2f@o4507935791513600.ingest.us.sentry.io/4508762015006720',
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

export default Sentry.wrap(AppContainer);
