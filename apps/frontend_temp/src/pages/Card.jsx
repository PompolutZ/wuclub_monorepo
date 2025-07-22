import { useParams } from "react-router-dom";
import {
    CHAMPIONSHIP_FORMAT,
    getSetById,
    NEMESIS_FORMAT,
    RELIC_FORMAT,
    validateCardForPlayFormat
} from "../data/wudb";
import { cards } from "../data/wudb/cards";
import { CardPicture } from "../shared/components/CardPicture";
import { PlayFormatPicture } from "../shared/components/PlayFormatPicture";
import { ExpansionPicture } from "../shared/components/ExpansionPicture";
import { sets } from "../data/wudb/sets";

function Card() {
    const { id } = useParams();
    const card = cards[id];
    const [
        isValid,
        isForsakenChampionship,
        isRestrictedChampionship,
    ] = validateCardForPlayFormat(card, CHAMPIONSHIP_FORMAT);
    const [isRelicValid, isForsakenRelic] = validateCardForPlayFormat(
        card,
        RELIC_FORMAT
    );
    const [isValidForNemesis] = validateCardForPlayFormat(
        card,
        NEMESIS_FORMAT
    );
    const set = getSetById(card.setId);

    return (
        <div className="w-full h-full lg:w-1/2 lg:mx-auto grid place-content-center px-4 text-gray-900">
            <CardPicture card={card} className="max-w-full rounded-xl shadow-md mb-4" />
            {card && (
                <>
                    <div>
                        <h3 className="font-bold text-gray-700 mt-4">
                            Card location:
                        </h3>
                        <div>
                            <ExpansionPicture setName={sets[card.setId].name} className="w-8 h-8 inline-block mr-2" />
                            {set.displayName}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 mt-4">
                            Play format availability:
                        </h3>
                        <div className="flex my-2 items-center space-x-4">
                            {isValid && (
                                <span>
                                    ✅ This card is VALID for Nemesis format.
                                </span>
                            )}
                            {isRestrictedChampionship && (
                                <span>
                                    ⚠️ This card is RESTRICTED for Nemesis format.
                                </span>
                            )}
                            {isForsakenChampionship && (
                                <span>
                                    ❌ This card is FORSAKEN for Nemesis format.
                                </span>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Card;
