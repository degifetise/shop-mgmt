import { CURRENCY, number } from "../utils.js";

function Tile({ label, value, unit, strong }) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        strong ? "border-leaf bg-leaf text-white" : "border-line bg-white"
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wider ${
          strong ? "text-white/80" : "text-muted"
        }`}
      >
        {label}
      </p>
      <p className="num mt-1 break-words text-xl font-semibold">
        {value}
        {unit && (
          <span
            className={`ml-1 text-xs font-normal ${
              strong ? "text-white/80" : "text-muted"
            }`}
          >
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

export default function Summary({ totals }) {
  return (
    <section
      aria-label="Totals"
      className="grid grid-cols-2 gap-3 lg:grid-cols-5"
    >
      <Tile label="Total products" value={totals.count} />
      <Tile label="Total quantity" value={totals.quantity} />
      <Tile label="Total buying" value={number(totals.totalBuy)} unit={CURRENCY} />
      <Tile label="Total selling" value={number(totals.totalSell)} unit={CURRENCY} />
      <Tile
        label="Expected profit"
        value={number(totals.profit)}
        unit={CURRENCY}
        strong
      />
    </section>
  );
}
