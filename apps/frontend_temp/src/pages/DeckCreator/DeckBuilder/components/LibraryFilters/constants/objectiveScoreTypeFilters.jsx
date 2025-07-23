import ObjectiveScoreTypeIcon from "../../../../../../components/ObjectiveScoreTypeIcon";

export const OBJECTIVE_SCORE_TYPE_FILTERS = [
    {
        label: "Surge",
        icon: (
            <ObjectiveScoreTypeIcon
                type="Surge"
                style={{ width: "1rem", height: "1rem" }}
            />
        ),
        filter: (card) => card.scoreType === "Surge" || card.scoreType === 0,
    },
    {
        label: "End phase",
        icon: (
            <ObjectiveScoreTypeIcon
                type="End"
                style={{ width: "1rem", height: "1rem" }}
            />
        ),
        filter: (card) => card.scoreType === "End" || card.scoreType === 1,
    },
];
