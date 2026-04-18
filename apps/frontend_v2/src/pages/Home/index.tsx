import { useNavigate } from "@tanstack/react-router";
import Footer from "../../components/Footer";
import { AutosuggestSearch } from "./Search";
import { AdvRollBtn } from "../../shared/components/DiceBox";

const Home = () => {
  const navigate = useNavigate();
  const handleGlobalSearchClick = (
    payload: { kind: "warband"; id: string } | { kind: "card"; id: string },
  ) => {
    if (payload.kind === "warband") {
      navigate({
        to: "/library",
        search: { view: "warbands", selected: payload.id },
      });
    } else {
      navigate({ to: "/view/card/$id", params: { id: payload.id } });
    }
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
        <AdvRollBtn label="Defence" notation="defence" />
        <AdvRollBtn label="Attack" notation="attack" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-h-screen"></div>

      <Footer />
    </div>
  );
};

export default Home;
