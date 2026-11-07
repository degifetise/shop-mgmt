import { useEffect, useMemo, useState } from "react";
import Summary from "./components/Summary.jsx";
import ProductForm from "./components/ProductForm.jsx";
import ProductTable from "./components/ProductTable.jsx";
import { downloadPdf } from "./pdf.js";
import { newId, normalize, sumTotals } from "./utils.js";

const STORAGE_KEY = "stock-ledger:v1";


const SAMPLE = [
  {
    id: "sample-1",
    name: "Teff flour 25kg",
    quantity: 12,
    buyPrice: 2800,
    sellPrice: 3150,
  },
  {
    id: "sample-2",
    name: "Sunflower oil 5L",
    quantity: 30,
    buyPrice: 1050,
    sellPrice: 1250,
  },
  {
    id: "sample-3",
    name: "Sugar 50kg",
    quantity: 8,
    buyPrice: 6400,
    sellPrice: 7000,
  },
];

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // storage unavailable or corrupted: fall back to the samples
  }
  return SAMPLE;
}

export default function App() {
  const [products, setProducts] = useState(loadProducts);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore: the app still works without saving
    }
  }, [products]);

  const nameCounts = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => {
      const key = normalize(p.name);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [products]);

  const isDuplicate = (p) => (nameCounts.get(normalize(p.name)) || 0) > 1;

  const totals = useMemo(() => sumTotals(products), [products]);
  const editing = products.find((p) => p.id === editingId) || null;

  const visible = useMemo(() => {
    const q = normalize(query);
    return q ? products.filter((p) => normalize(p.name).includes(q)) : products;
  }, [products, query]);

  // Create and update
  const save = (data) => {
    if (editingId) {
      setProducts((list) =>
        list.map((p) => (p.id === editingId ? { ...p, ...data } : p)),
      );
    } else {
      setProducts((list) => [...list, { id: newId(), ...data }]);
    }
    setEditingId(null);
  };

  // Delete
  const remove = (id) => {
    setProducts((list) => list.filter((p) => p.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEdit = (id) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => {
    setProducts([]);
    setEditingId(null);
    setConfirmClear(false);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Kii Suki
          </h1>
          <p className="mt-1 text-sm text-muted">
            Add products, compare buying and selling prices, and download the
            list as a PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadPdf(products, isDuplicate)}
          disabled={products.length === 0}
          className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Download PDF
        </button>
      </header>

      <Summary totals={totals} />

      <ProductForm
        products={products}
        editing={editing}
        onSave={save}
        onCancel={() => setEditingId(null)}
      />

      <section className="flex flex-col gap-3" aria-label="Product list">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">
            Products{" "}
            <span className="num font-normal text-muted">
              ({products.length})
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="search" className="sr-only">
              Search products
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="w-48 rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-leaf"
            />
            {confirmClear ? (
              <>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete all?
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:bg-paper"
                >
                  Keep
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={products.length === 0}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <ProductTable
          rows={visible}
          totals={totals}
          isDuplicate={isDuplicate}
          editingId={editingId}
          onEdit={startEdit}
          onDelete={remove}
          hasProducts={products.length > 0}
        />
      </section>

      <footer className="pt-2 text-xs text-muted">
        Manage Your Products here.
      </footer>
    </div>
  );
}
