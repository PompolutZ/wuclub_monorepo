import { useLocation, useParams } from "react-router-dom";
import {
    CHAMPIONSHIP_FORMAT,
    NEMESIS_FORMAT,
    checkCardIsObjective,
    checkCardIsPloy,
    checkCardIsUpgrade,
    getCardById,
    getFactionById,
    getFactionByName,
    getSetById,
} from "../../data/wudb";
import { INITIAL_STATE } from "./reducer";
import { logger } from "@/utils/logger";

export function useStateCreator() {
    const { action, data } = useParams();
    const { state } = useLocation();

    switch (action) {
        case "create":
            return { action, state: null };

        case "edit":
            return {
                action,
                state: {
                    ...INITIAL_STATE,
                    faction: getFactionByName(state?.deck?.faction),
                    selectedObjectives: state?.deck?.objectives,
                    selectedGambits: state?.deck?.gambits,
                    selectedUpgrades: state?.deck?.upgrades,
                },
                previous: {
                    id: data,
                    name: state?.deck?.name,
                    private: state?.deck?.private,
                },
            };

        case "transfer": {
            const [transferFormat, ...cardIds] = data.split(",");
            const decode = getDecodingFunction(transferFormat);
            const decodedCards = cardIds
                .map((foreignId) => {
                    const wuid = decode(foreignId);
                    const card = getCardById(wuid);
                    if (!card) {
                        logger.warn(`Card with ID ${wuid} not found in the database`, { wuid, foreignId });
                        return null;
                    }
                    return card;
                })
                .filter(Boolean);

            const faction = getFactionById();

            const sets = decodedCards.reduce(
                (acc, { setId }) => acc.add(setId),
                new Set()
            );

            const selectedSets = [...sets.values()];

            return {
                action,
                state: {
                    ...INITIAL_STATE,
                    format: selectedSets.length === 2 ? NEMESIS_FORMAT : CHAMPIONSHIP_FORMAT,
                    faction,
                    sets: selectedSets.map((setId) => getSetById(setId)),
                    selectedObjectives: decodedCards.filter(checkCardIsObjective),
                    selectedGambits: decodedCards.filter(checkCardIsPloy),
                    selectedUpgrades: decodedCards.filter(checkCardIsUpgrade),
                },
            };
        }

        default:
            logger.warn(`Unknown DeckCreator action: ${action}`);
            return { action, state: null };
    }
}

const decodeUDS = (card) => {
    const udsId = Number(card);
    if (udsId >= 9000 && udsId < 10000) {
        return String(Number(card) + 2000).padStart(5, "0");
    } else if (udsId >= 10000 && udsId < 11000) {
        return String(Number(card)).padStart(5, "0");
    }
    return String(Number(card) + 1000).padStart(5, "0");
};

const decodeWUC = (card) => card;

const decodeUDB = (card) => card;

const getDecodingFunction = (encoding) => {
    switch (encoding) {
        case "udb":
            return decodeUDB;
        case "uds":
            return decodeUDS;
        case "wuc":
            return decodeWUC;
        default:
            throw Error(`Unknown encoding format: ${encoding}`);
    }
};
