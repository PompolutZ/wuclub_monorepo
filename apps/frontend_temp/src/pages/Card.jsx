import { useParams } from "react-router-dom";
import {
    getSetById,
    validateCardForPlayFormat
} from "../data/wudb";
import { cards } from "../data/wudb/cards";
import { sets } from "../data/wudb/sets";
import { CardPicture } from "../shared/components/CardPicture";
import { ExpansionPicture } from "../shared/components/ExpansionPicture";

function Card() {
    const { id } = useParams();
    const card = cards[id];
    const [
        isValid,
        isForsakenNemesis,
        isRestrictedNemesis,
    ] = validateCardForPlayFormat(card);
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
                            {isRestrictedNemesis && (
                                <span>
                                    ⚠️ This card is RESTRICTED for Nemesis format.
                                </span>
                            )}
                            {isForsakenNemesis && (
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
