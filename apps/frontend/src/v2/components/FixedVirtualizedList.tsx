import { useEffect, useRef, useState } from "react";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";

const MAGICK_HEIGHT = 436;
const minOptimalWidth = 200;
const optimalHeight = 16 * 3;

interface FixedVirtualizedListProps<T> {
    items: T[];
    children: (item: T | T[], row: VirtualItem) => JSX.Element;
    estimateItemSize: number;
    variant: "list" | "grid",
}

export const FixedVirtualizedList = <T,>({
    items,
    children,
    estimateItemSize = optimalHeight,
    variant = "list",
}: FixedVirtualizedListProps<T>) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const [rowHeight, setRowHeight] = useState(estimateItemSize);
    const [rows, setRows] = useState<T[] | T[][]>(items);

    useEffect(() => {
        if (variant === "list") return;

        const itemsPerRow = Math.floor(700 / minOptimalWidth);
        let updatedRows;

            updatedRows = items.reduce((result, _, index, array) => {
                if (index % itemsPerRow === 0) {
                    result.push(array.slice(index, index + itemsPerRow));
                }
    
                return result;
            }, [] as T[][])
            setRowHeight(MAGICK_HEIGHT);
            setRows(updatedRows);
            // row height will be according to card's height based on keeping original aspect ratio
    }, [items, variant]);

    const virtual = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
        overscan: 5,
    });

    const virtualItems = virtual.getVirtualItems();

    return (
        <div
            ref={parentRef}
            className="flex-1 [contain:strict] overflow-y-auto outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
        >
            <div
                className="w-full relative"
                style={{ height: virtual.getTotalSize() }}
            >
                <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                        transform: `translateY(${virtualItems[0]?.start}px)`,
                    }}
                >
                    {virtualItems.map((virtualRow) =>
                        children(rows[virtualRow.index], virtualRow)
                    )}
                </div>
            </div>
        </div>
    );
};
