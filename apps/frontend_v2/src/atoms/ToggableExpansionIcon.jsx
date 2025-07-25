import { ExpansionPicture } from "../shared/components/ExpansionPicture";

export const ToggableExpansionIcon = ({ set, isEnabled, onClick }) => {
    return (
        <div
            className={`cursor-pointer ${isEnabled ? 'opacity-100' : 'opacity-20'}`}
            onClick={() => onClick(set)}
        >
            <ExpansionPicture setName={set} className="w-12 h-12" />
        </div>
    );
};
