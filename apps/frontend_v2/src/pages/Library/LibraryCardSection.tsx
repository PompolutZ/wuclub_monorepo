import { animated, useSpring } from "@react-spring/web";
import { ExpandCollapseButton } from "../../shared/components/ExpandCollapseButton";
import { ExpansionPicture } from "../../shared/components/ExpansionPicture";
import { useResizeHeight } from "../../hooks/useResizeHeight";
import { getSetNameById } from "../../data/wudb";
import type { Card } from "../../data/wudb";
import LibraryCardRow from "./LibraryCardRow";

interface LibraryCardSectionProps {
  setId: string;
  cards: Card[];
}

function LibraryCardSection({ setId, cards }: LibraryCardSectionProps) {
  const [measureRef, open, toggle, contentHeight] = useResizeHeight({ open: true });
  const expand = useSpring({
    height: open ? `${contentHeight}px` : "0px",
  });

  const setName = getSetNameById(setId as never);

  return (
    <div className="mb-4">
      <div className="flex items-center border-b border-gray-500 pb-2">
        <ExpansionPicture setName={setName} className="w-8 h-8 mr-2" />
        <h1 className="text-gray-900 text-xl mr-2 flex-1 truncate">{setName}</h1>
        <span className="text-gray-500 text-sm mr-2">{cards.length}</span>
        <ExpandCollapseButton
          open={open}
          className="outline-none shadow-md text-white bg-purple-700 rounded-full hover:bg-purple-500 focus:text-white"
          onClick={toggle}
        />
      </div>
      <animated.div style={expand} className="overflow-hidden">
        <div ref={measureRef}>
          {cards.map((card, index) => (
            <LibraryCardRow
              key={card.id}
              cardId={card.id}
              isAlternate={index % 2 === 0}
            />
          ))}
        </div>
      </animated.div>
    </div>
  );
}

export default LibraryCardSection;
