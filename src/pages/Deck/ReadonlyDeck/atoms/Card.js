import React, { PureComponent } from "react";
import {
    setsIndex,
    totalCardsPerWave,
    bannedCards,
    restrictedCards,
} from "../../../../data/index";
import { pickCardColor } from "../../../../utils/functions";
import AnimateHeight from "react-animate-height";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BlockIcon from "@material-ui/icons/Block";
import LockIcon from "@material-ui/icons/Lock";
import { getCardWaveFromId, getSetNameById } from "../../../../data/wudb";
import CardImage from "../../../../v2/components/CardImage";
import CardRule from "../../../../atoms/CardRule";
import ObjectiveScoreTypeIcon from "../../../../components/ObjectiveScoreTypeIcon";

const idToPrintId = (id) => {
    return (
        <>
            <span className="font-bold">{`${id}`.slice(-3)}</span>
            <span>/{totalCardsPerWave[parseInt(getCardWaveFromId(id))]}</span>
        </>
    );
};

const SetIcon = ({ id, setId, className = "" }) => (
    <picture>
        <source
            type="image/webp"
            srcSet={`/assets/icons/${getSetNameById(setId)}-icon.webp`}
        />
        <img
            className={`w-4 h-4 -ml-1 mr-2 ${className}`}
            id={id}
            src={`/assets/icons/${getSetNameById(setId)}-icon-24.png`}
            alt="icon"
        />
    </picture>
);

function CardImageOrText({ useTextFallback, image, fallback }) {
    return useTextFallback ? fallback : image;
}

function Expandable({ animateHeight, children }) {
    return (
        <AnimateHeight height={animateHeight} duration={250} easing="ease-out">
            {children}
        </AnimateHeight>
    );
}

class Card extends PureComponent {
    state = {
        expanded: false,
        useTextFallback: false,
    };

    render() {
        const { card, classes, asImage } = this.props;
        const cardId = `${card.id}`.padStart(5, "0");
        const animateHeight = this.state.expanded ? "auto" : 0;

        return (
            <>
                {asImage && (
                    <div style={{ margin: ".5rem", position: "relative" }}>
                        <CardImage
                            alt={card.name}
                            id={cardId}
                            style={{ width: `14rem` }}
                        />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography>Location: </Typography>
                            <SetIcon id={`${cardId}`} setId={card.setId} />
                        </div>

                        {bannedCards[card.id] && (
                            <BlockIcon className={classes.blockedIcon} />
                        )}
                        {restrictedCards[card.id] && (
                            <LockIcon className={classes.lockedIcon} />
                        )}
                    </div>
                )}
                {!asImage && (
                    <>
                        <div
                            className="flex items-center cursor-pointer space-x-1 transform hover:scale-105 transition-all hover:bg-gray-300 hover:shadow-sm p-2 rounded"
                            onClick={this._toggleExpanded}
                        >
                            <SetIcon id={`${cardId}`} setId={card.setId} />
                            <h3
                                className="cursor-pointer flex-1 inline-block"
                                style={{ color: pickCardColor(cardId) }}
                            >
                                {card.name}
                            </h3>
                            <div className="flex items-center">
                                {card.scoreType && (
                                    <ObjectiveScoreTypeIcon
                                        type={card.scoreType}
                                        style={{
                                            width: ".8rem",
                                            height: ".8rem",
                                        }}
                                    />
                                )}
                                {card.glory && (
                                    <span className="text-xs font-bold">
                                        ({card.glory})
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center">
                                <div className="ml-auto flex items-center text-xs text-gray-700">
                                    <div>(</div>
                                    {idToPrintId(cardId)}
                                    <picture>
                                        <source
                                            type="image/webp"
                                            srcSet={`/assets/icons/wave-${cardId.substr(
                                                0,
                                                2
                                            )}-icon-48.webp`}
                                        />
                                        <img
                                            className="w-3 h-3 ml-1"
                                            id={idToPrintId(cardId)}
                                            alt={`wave-${cardId.substr(0, 2)}`}
                                            src={`/assets/icons/wave-${cardId.substr(
                                                0,
                                                2
                                            )}-icon-24.png`}
                                        />
                                    </picture>
                                    <div>)</div>
                                </div>
                            </div>
                        </div>
                        <Expandable animateHeight={animateHeight}>
                            <CardImageOrText
                                useTextFallback={this.state.useTextFallback}
                                image={
                                    <CardImage
                                        onError={this._handleImageError}
                                        onLoad={this._handleImageLoaded}
                                        className="w-4/5 mx-auto my-2 rounded-lg shadow-md sm:max-w-xs"
                                        id={card.id}
                                        alt={card.name}
                                    />
                                }
                                fallback={<CardRule rule={card.rule} />}
                            />
                        </Expandable>
                    </>
                )}
            </>
        );
    }

    _toggleExpanded = () => {
        this.setState((state) => ({ expanded: !state.expanded }));
    };

    _handleImageLoaded = () => {
        this.setState({ useTextFallback: false });
    };

    _handleImageError = (e) => {
        this.setState({ useTextFallback: true });
    };
}

const styles = (theme) => ({
    img: {
        width: "90%",
        margin: ".5rem 5%",
        [theme.breakpoints.up("sm")]: {
            maxWidth: "20rem",
        },
    },

    blockedIcon: {
        color: "rgba(255, 0, 0)",
        opacity: ".7",
        width: "10rem",
        height: "10rem",
        position: "absolute",
        zIndex: "1",
        top: "2rem",
        left: "2rem",
    },

    lockedIcon: {
        color: "goldenrod",
        opacity: ".7",
        width: "10rem",
        height: "10rem",
        position: "absolute",
        zIndex: "1",
        top: "2rem",
        left: "2rem",
    },
});

export default withStyles(styles)(Card);
