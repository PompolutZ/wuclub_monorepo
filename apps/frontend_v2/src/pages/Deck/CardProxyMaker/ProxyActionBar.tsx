const btnClass = "btn btn-purple cursor-pointer px-4 py-2 font-bold";

interface ProxyActionBarProps {
  selectedCardIds: string[];
  totalCards: number;
  selectedFighters: string[];
  totalFighters: number;
  hasWarband: boolean;
  selectedWarbandCard: boolean;
  selectedPlotCards: string[];
  totalPlotCards: number;
  onDownload: () => void;
  onToggleAll: () => void;
  onToggleWarband: () => void;
  onToggleWarbandCard: () => void;
  onTogglePlotCards: () => void;
  onExit: () => void;
}

export const ProxyActionBar = ({
  selectedCardIds,
  totalCards,
  selectedFighters,
  totalFighters,
  hasWarband,
  selectedWarbandCard,
  selectedPlotCards,
  totalPlotCards,
  onDownload,
  onToggleAll,
  onToggleWarband,
  onToggleWarbandCard,
  onTogglePlotCards,
  onExit,
}: ProxyActionBarProps) => (
  <div className="bg-gray-300 p-4 flex items-center gap-4">
    <button className={btnClass} onClick={onDownload}>Download</button>
    <button className={btnClass} onClick={onToggleAll}>Toggle All</button>
    {hasWarband && (
      <button className={btnClass} onClick={onToggleWarbandCard}>Toggle Warband Card</button>
    )}
    {hasWarband && (
      <button className={btnClass} onClick={onToggleWarband}>Toggle Warband</button>
    )}
    {totalPlotCards > 0 && (
      <button className={btnClass} onClick={onTogglePlotCards}>Toggle Plot Cards</button>
    )}
    <div className="text-sm text-gray-700 flex items-center gap-2">
      <span>{selectedCardIds.length}/{totalCards} deck cards</span>
      {hasWarband && (
        <span>· {selectedWarbandCard ? 1 : 0}/1 warband card</span>
      )}
      {hasWarband && (
        <span>· {selectedFighters.length}/{totalFighters} fighters</span>
      )}
      {totalPlotCards > 0 && (
        <span>· {selectedPlotCards.length}/{totalPlotCards} plot cards</span>
      )}
    </div>
    <button className={`ml-auto ${btnClass}`} onClick={onExit}>Quit</button>
  </div>
);
