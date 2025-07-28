import { useHistory } from "react-router-dom";
import Footer from "../../components/Footer";
import { Card } from "../../data/wudb/types";
// import DeckMetaSummary from "./DecksMetaSummary";
import { AutosuggestSearch } from "./Search";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults"; // fui index exports are messed up -> going to src
import DiceParser from "@3d-dice/dice-parser-interface";
import { Dice } from "../../shared/components/DiceBox";
// import { useDeckStats } from "./useDeckStats";

// create Dice Roll Parser to handle complex notations
const DRP = new DiceParser({
  
});

// create display overlay for final results
const DiceResults = new DisplayResults("#dice-box");

// initialize the Dice Box outside of the component
Dice.init().then(() => {
  // clear dice on click anywhere on the screen
  document.addEventListener("mousedown", () => {
    const diceBoxCanvas = document.getElementById("dice-canvas");
    if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
      Dice.hide().clear();
      DiceResults.clear();
    }
  });
});

const AdvRollBtn = (props) => {
  const { label, onRoll, notation } = props;

  const roll = () => {
    onRoll(notation);
  };

  return <button onClick={roll}>{label}</button>;
};

const Home = () => {
  const history = useHistory();
  // const { data: stats } = useDeckStats();
  const handleGlobalSearchClick = (payload: Card) => {
    history.push(`/view/card/${payload.id}`);
  };

  Dice.onRollComplete = (results) => {
  };

  // trigger dice roll
  const rollDice = (notation) => () => {
    Dice.clear();
    // trigger the dice roll using the parser
    const diceCount = Math.floor(Math.random() * 4) + 1; // randomize number of dice
    Dice.show().roll(`${diceCount}d${notation}`);
  };

  return (
    <div className="relative">
      <h1 className="block text-2xl my-16 px-2 text-center text-white font-semibold">
        Deck building website for Warhammer Underworlds.
      </h1>

      <div className="mb-16 justify-center">
        <div className="mx-4 sm:mx-auto sm:w-1/2 lg:w-1/3">
          <AutosuggestSearch onClick={handleGlobalSearchClick} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <AdvRollBtn label="Defence" onRoll={rollDice("defence")} />
        <AdvRollBtn label="Attack" onRoll={rollDice("attack")} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-h-screen">
      </div>

      <Footer />
    </div>
  );
};

export default Home;
