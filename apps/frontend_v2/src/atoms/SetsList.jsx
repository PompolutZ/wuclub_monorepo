import { getSetNameById } from "../data/wudb";
import { ExpansionPicture } from "../shared/components/ExpansionPicture";

const SetsList = ({ sets = [] }) => (
    <div className="flex flex-wrap space-x-0.5">
        {sets.map(s => <ExpansionPicture className="w-6 h-6" key={s} setName={getSetNameById(s)} />)}
    </div>
);

export default SetsList;
