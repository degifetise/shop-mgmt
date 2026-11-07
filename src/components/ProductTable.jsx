import { useState } from "react";
import { lineTotals, number } from "../utils.js";

const th =
  "whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted";

export default function ProductTable({
  rows,
  totals,
  isDuplicate,
  editingId,
  onEdit,
  onDelete,
  hasProducts,
}) {
  const [confirmId, setConfirmId] = useState(null);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
        <p className="font-medium">
          {hasProducts ? "No product matches your search." : "No products yet."}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hasProducts
            ? "Try a different name."
            : "Add your first product in the form above."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper/60 text-left">
            <th className={`${th} w-10 text-right`}>#</th>
            <th className={th}>Product</th>
            <th className={`${th} text-right`}>Qty</th>
            <th className={`${th} text-right`}>Buying price</th>
            <th className={`${th} text-right`}>Selling price</th>
            <th className={`${th} text-right`}>Total buying</th>
            <th className={`${th} text-right`}>Total selling</th>
            <th className={`${th} text-right`}>Profit</th>
            <th className={`${th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => {
            const t = lineTotals(p);
            const dup = isDuplicate(p);
            const editing = p.id === editingId;
            return (
              <tr
                key={p.id}
                className={`border-b border-line last:border-b-0 ${
                  dup ? "bg-red-50" : editing ? "bg-leaf-soft" : ""
                }`}
              >
                <td className="num px-3 py-2.5 text-right text-muted">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`font-medium ${dup ? "text-red-700" : ""}`}
                  >
                    {p.name}
                  </span>
                  {dup && (
                    <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Duplicate
                    </span>
                  )}
                </td>
                <td className="num px-3 py-2.5 text-right">{p.quantity}</td>
                <td className="num px-3 py-2.5 text-right">{number(p.buyPrice)}</td>
                <td className="num px-3 py-2.5 text-right">{number(p.sellPrice)}</td>
                <td className="num px-3 py-2.5 text-right">{number(t.totalBuy)}</td>
                <td className="num px-3 py-2.5 text-right">{number(t.totalSell)}</td>
                <td
                  className={`num px-3 py-2.5 text-right font-medium ${
                    t.profit < 0 ? "text-amber-700" : "text-leaf"
                  }`}
                >
                  {number(t.profit)}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-2">
                    {confirmId === p.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(p.id);
                            setConfirmId(null);
                          }}
                          className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Delete?
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="rounded border border-line px-2.5 py-1 text-xs font-medium hover:bg-paper"
                        >
                          Keep
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(p.id)}
                          className="rounded border border-line px-2.5 py-1 text-xs font-medium hover:bg-paper"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(p.id)}
                          className="rounded border border-line px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink/80 bg-leaf-soft font-semibold">
            <td className="px-3 py-3" />
            <td className="px-3 py-3">Total (all products)</td>
            <td className="num px-3 py-3 text-right">{totals.quantity}</td>
            <td className="px-3 py-3" />
            <td className="px-3 py-3" />
            <td className="num px-3 py-3 text-right">{number(totals.totalBuy)}</td>
            <td className="num px-3 py-3 text-right">{number(totals.totalSell)}</td>
            <td className="num px-3 py-3 text-right text-leaf">
              {number(totals.profit)}
            </td>
            <td className="px-3 py-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
