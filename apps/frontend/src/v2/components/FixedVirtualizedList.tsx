import { useRef } from "react";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";

const ratio = 744 / 532;
const minOptimalWidth = 200;
const optimalHeight = 16 * 3;

interface FixedVirtualizedListProps<T> {
    items: T[];
    children: (item: T, row: VirtualItem) => JSX.Element;
    estimateItemSize: number;
}

export const FixedVirtualizedList = <T,>({
    items,
    children,
    estimateItemSize = optimalHeight,
}: FixedVirtualizedListProps<T>) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtual = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateItemSize,
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
                        children(items[virtualRow.index], virtualRow)
                    )}
                </div>
            </div>
        </div>
    );
};
