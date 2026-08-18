"use client";

import { useVirtualList } from "@/hooks/useVirtualList";

// یک دیتابیس فرضی با ۱۰,۰۰۰ آیتم
const ALL_ITEMS = Array.from({ length: 10000 }, (_, i) => `آیتم شماره ${i + 1}`);

export default function VirtualListDemo() {
  const containerHeight = 400; // ارتفاع باکس اسکرول به پیکسل
  const itemHeight = 50; // ارتفاع ثابت هر آیتم به پیکسل

  const { virtualItems, totalHeight, onScroll } = useVirtualList({
    itemCount: ALL_ITEMS.length,
    itemHeight,
    containerHeight,
    overscan: 3,
    allItems: ALL_ITEMS,
  });

  return (
    /* ۱. container بیرونی: ارتفاع ثابت دارد، overflowY اسکرول می‌خورد و رویداد onScroll به آن وصل می‌شود */
    <div
      onScroll={onScroll}
      style={{
        height: `${containerHeight}px`,
        overflowY: "auto",
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      {/* ۲. المنت داخلی (Spacer): ارتفاع کل لیست را می‌گیرد تا Scrollbar واقعی ایجاد شود */}
      <div style={{ height: `${totalHeight}px`, width: "100%", position: "relative" }}>
        {/* ۳. رندر کردن فقط آیتم‌های فعال (مثلاً حدود ۱۱ تا از ۱۰,۰۰۰ آیتم) */}
        {virtualItems.map(({ index, offsetTop }) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${itemHeight}px`,
              transform: `translateY(${offsetTop}px)`, // جای‌گذاری دقیق آیتم در اسکرول‌بار
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
            }}
          >
            {ALL_ITEMS[index]}
          </div>
        ))}
      </div>
    </div>
  );
}
