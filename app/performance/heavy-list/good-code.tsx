"use client";

import { useState, useDeferredValue, useMemo, memo } from "react";

const INITIAL_TRANSACTIONS = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  amount: Math.floor(Math.random() * 100000),
}));

export function TransactionList() {
  // استیت جستجو که فوراً با تایپ کاربر آپدیت می‌شود (بدون لگ)
  const [search, setSearch] = useState("");

  // ایجاد نسخهٔ کم‌اولویت از استیت جستجو برای کارهای سنگین
  const deferredSearch = useDeferredValue(search);

  // فیلتر کردن بر اساس مقدار کم‌اولویت انجام می‌شود
  const filteredTransactions = useMemo(() => {
    return INITIAL_TRANSACTIONS.filter((t) => t.name.toLowerCase().includes(deferredSearch.toLowerCase()));
  }, [deferredSearch]);

  return (
    <div>
      {/* اینپوت کاملاً روان کار می‌کند چون استیت search سریع آپدیت می‌شود */}
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

      <ul>
        {filteredTransactions.map((t) => (
          <TransactionItem key={t.id} transaction={t} />
        ))}
      </ul>
    </div>
  );
}

// استفاده از memo برای اینکه فرزندان سنگین بیهوده ری‌رندر نشوند
const TransactionItem = memo(({ transaction }: { transaction: any }) => {
  const startTime = performance.now();
  while (performance.now() - startTime < 0.5) {
    /* فریز عمدی */
  }

  return (
    <li>
      {transaction.name} - ${transaction.amount}
    </li>
  );
});

TransactionItem.displayName = "TransactionItem";
