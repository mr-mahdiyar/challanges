"use client";

import { UIEvent, useCallback, useMemo, useState } from "react";

interface UseVirtualListOptions<T> {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  allItems: Array<T>;
}

interface VirtualItem {
  index: number;
  offsetTop: number;
}

export function useVirtualList<T>({ itemCount, itemHeight, containerHeight, overscan = 3, allItems }: UseVirtualListOptions<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const VisibleItemsCount = useMemo(() => {
    return containerHeight / itemHeight;
  }, [itemHeight, containerHeight]);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + VisibleItemsCount;

  const virtualItems: VirtualItem[] = [];

  for (let i = startIndex - overscan; i < startIndex; i++) {
    if (!allItems[i]) break;

    virtualItems.push({
      ...allItems[i],
      index: i,
      offsetTop: i * itemHeight,
    });
  }

  for (let i = startIndex; i < endIndex + overscan; i++) {
    if (!allItems[i]) break;

    virtualItems.push({
      ...allItems[i],
      index: i,
      offsetTop: i * itemHeight,
    });
  }

  return {
    virtualItems,
    totalHeight: itemCount * itemHeight,
    onScroll: handleScroll,
  };
}
