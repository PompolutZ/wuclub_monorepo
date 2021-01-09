import React, { PureComponent, useMemo, useState } from "react";
import LockIcon from "@material-ui/icons/Lock";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import { ReactComponent as GloryIcon } from "../../../../svgs/wu-glory.svg";
import { ReactComponent as CloseIcon } from "../../../../svgs/x.svg";
import { addCardAction, removeCardAction } from "../../reducer";
import ObjectiveScoreTypeIcon from "../../../../components/ObjectiveScoreTypeIcon";
import {
    getCardNumberFromId,
    getCardWaveFromId,
    getSetNameById,
    totalCardsPerWave,
} from "../../../../data/wudb";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "../..";
import Fade from "@material-ui/core/Fade";
import { ModalPresenter } from '../../../../index';

class WUCardInfo extends PureComponent {
    render() {
        const { scoreType, name, id, glory, onClick } = this.props;

        const wave = getCardWaveFromId(id);
        return (
            <div className="flex-1 self-start cursor-pointer" onClick={onClick}>
                <div className="flex items-center">
                    <h6 className="">{name}</h6>
                </div>
                <div className="flex items-center text-xs">
                    {scoreType && scoreType !== "-" && (
                        <ObjectiveScoreTypeIcon
                            type={scoreType}
                            style={{
                                width: ".8rem",
                                height: ".8rem",
                            }}
                        />
                    )}

                    {glory && (
                        <div className="flex items-center font-bold mx-2">
                            <GloryIcon className="bg-objectiveGold rounded-full w-4 h-4 fill-current mr-1" />

                            {glory}
                        </div>
                    )}

                    <span className="font-bold text-xs text-gray-500">{`${getCardNumberFromId(
                        id
                    )}/${totalCardsPerWave[+wave]}`}</span>

                    <img
                        className="w-3 h-3 ml-1"
                        alt={`wave-${wave}`}
                        src={`/assets/icons/wave-${wave}-icon.png`}
                    />
                </div>
            </div>
        );
    }
}

function CardInDeck({ card, ...props }) {
    const {
        selectedObjectives,
        selectedGambits,
        selectedUpgrades,
        faction,
    } = useDeckBuilderState();
    const [overlayIsVisible, setOverlayIsVisible] = useState(false);
    const dispatch = useDeckBuilderDispatcher();
    const {
        type,
        id,
        scoreType,
        glory,
        name,
        setId,
        isRestricted,
        isBanned,
    } = card;

    const inDeck = useMemo(
        () =>
            [
                ...selectedObjectives,
                ...selectedGambits,
                ...selectedUpgrades,
            ].find((card) => card.id == id),
        [selectedObjectives, selectedGambits, selectedUpgrades]
    );

    const handleToggleCardInDeck = () => {
        if (inDeck) {
            dispatch(removeCardAction(card));
        } else {
            dispatch(addCardAction(card));
        }
    };

    const pickForegroundColor = (isRestricted, isBanned, defaultColor) => {
        if (isBanned || isRestricted) {
            return "white";
        }

        return defaultColor;
    };

    const handleShowCardImageOverlay = () => {
        setOverlayIsVisible(true);
    };

    return (
        <div className={`${props.isAlter ? "bg-purple-100" : "bg-white"}`}>
            <div className="flex items-center">
                <div className="mx-2 items-center relative">
                    <img
                        className="w-8 h-8"
                        alt={`${getSetNameById(setId)}`}
                        src={`/assets/icons/${getSetNameById(setId)}-icon.png`}
                    />
                    {isRestricted && (
                        <LockIcon
                            className="absolute w-8 h-8 opacity-75 top-1/2 -mt-3 left-1/2 -ml-3"
                            style={{
                                stroke: "white",
                                fill: "goldenrod",
                            }}
                        />
                    )}
                    {isBanned && (
                        <NotInterestedIcon
                            style={{
                                width: "1rem",
                                height: "1rem",
                                fill: "darkred",
                            }}
                        />
                    )}
                </div>
                <WUCardInfo
                    prefix={faction.abbr}
                    rank={props.ranking}
                    pickColor={pickForegroundColor}
                    isRestricted={isRestricted}
                    isBanned={isBanned}
                    set={setId}
                    name={name}
                    scoreType={scoreType}
                    type={type}
                    id={id}
                    glory={glory}
                    onClick={handleShowCardImageOverlay}
                />
                <button
                    className={`btn m-2 w-8 h-8 py-0 px-1 ${inDeck ? 'btn-red' : 'btn-purple'}`}
                    onClick={handleToggleCardInDeck}
                >
                    <CloseIcon
                        className={`text-white stroke-current transform ${
                            inDeck ? "rotate-0" : "rotate-45"
                        }`}
                    />
                </button>
            </div>
            {
                overlayIsVisible && (
                    <ModalPresenter>
                        <Fade in={overlayIsVisible}>
                            <div
                                className="fixed inset-0 z-10 cursor-pointer"
                                onClick={() => setOverlayIsVisible(false)}
                            >
                                <div className="bg-black absolute inset-0 opacity-25"></div>
                                <div className="absolute inset-0 z-20 flex justify-center items-center">
                                    <div className="w-4/5 lg:w-1/4">
                                        <img
                                            className="rounded-lg"
                                            style={{
                                                filter: "drop-shadow(0 0 10px black)",
                                            }}
                                            alt={id}
                                            src={`/assets/cards/${`${id}`.padStart(
                                                5,
                                                "0"
                                            )}.png`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </ModalPresenter>
                )
            }
        </div>
    );
}

export default CardInDeck;
