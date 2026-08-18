// ❌ کد ناکارآمد همکار جونیور
import { useState } from "react";

// فرض کن این لیست شامل ۱۰۰۰ رکورد سنگین است
const INITIAL_TRANSACTIONS = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  amount: Math.floor(Math.random() * 100000),
}));

export function TransactionList() {
  const [search, setSearch] = useState("");

  // با هر بار فشردن کلید، این فیلترِ سنگین دوباره روی ۱۰۰۰ آیتم اجرا می‌شود
  const filteredTransactions = INITIAL_TRANSACTIONS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      
      <ul>
        {filteredTransactions.map((t) => (
          <TransactionItem key={t.id} transaction={t} />
        ))}
      </ul>
    </div>
  );
}

// این کامپوننت فرزند، کلی استایل، آیکون و جزئیات گرافیکی دارد
function TransactionItem({ transaction }) {
  // شبیه‌سازی یک پردازش سنگین گرافیکی در رندر فرزند
  let startTime = performance.now();
  while (performance.now() - startTime < 0.5) { /* فریز کردن عمدی لایه رندر */ }

  return <li>{transaction.name} - ${transaction.amount}</li>;
}