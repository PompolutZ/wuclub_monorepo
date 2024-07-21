import { createContext } from "react";
import Firebase from ".";

const FirebaseContext = createContext({} as typeof Firebase);

export const withFirebase =
  (
    Component: React.ComponentType<{
      firebase: typeof Firebase;
    }>,
  ) =>
  (props: Record<string, unknown>) => (
    <FirebaseContext.Consumer>
      {(firebase) => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  );

export default FirebaseContext;
