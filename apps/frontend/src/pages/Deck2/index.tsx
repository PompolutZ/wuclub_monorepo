const Deck2 = () => {
    return (
        <div className="flex-1 flex flex-col bg-gray-500">
            <div className="flex">
                <div className="flex-1 bg-violet-500">SUMMARY</div>
                <div className="bg-violet-400">MENU</div>
            </div>
            <div className="bg-orange-500 order-last lg:order-none">TABS</div>
            <div className="flex-1 bg-green-500">CONTENT</div>
        </div>
    );
};

export default Deck2;
