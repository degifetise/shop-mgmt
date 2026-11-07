import { useEffect, useState } from "react";
import { CURRENCY, money, normalize } from "../utils.js";

const empty = { name: "", quantity: "", buyPrice: "", sellPrice: "" };

const inputBase =
  "w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors";
const inputOk = "border-line focus:border-leaf";
const inputBad =
  "border-red-500 bg-red-50 text-red-700 focus:border-red-600 focus-visible:ring-red-300";

function Field({ id, label, children, hint }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </label>
      {children}
      {hint}
    </div>
  );
}

export default function ProductForm({ products, editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(
      editing
        ? {
            name: editing.name,
            quantity: String(editing.quantity),
            buyPrice: String(editing.buyPrice),
            sellPrice: String(editing.sellPrice),
          }
        : empty
    );
  }, [editing?.id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const name = form.name.trim();
  const quantity = Number(form.quantity);
  const buyPrice = Number(form.buyPrice);
  const sellPrice = Number(form.sellPrice);

  const duplicate =
    name !== "" &&
    products.some(
      (p) => p.id !== editing?.id && normalize(p.name) === normalize(name)
    );

  const valid =
    name !== "" &&
    !duplicate &&
    Number.isInteger(quantity) &&
    quantity > 0 &&
    form.buyPrice !== "" &&
    buyPrice >= 0 &&
    form.sellPrice !== "" &&
    sellPrice >= 0;

  const lineBuy = (Number.isFinite(quantity) ? quantity : 0) * (buyPrice || 0);
  const lineSell = (Number.isFinite(quantity) ? quantity : 0) * (sellPrice || 0);

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSave({ name, quantity, buyPrice, sellPrice });
    setForm(empty);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-line bg-white p-4 sm:p-5"
      noValidate
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">
          {editing ? "Edit product" : "Add product"}
        </h2>
        {editing && (
          <span className="rounded bg-leaf-soft px-2 py-0.5 text-xs font-medium text-leaf">
            Editing
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          id="name"
          label="Product name"
          hint={
            duplicate && (
              <p role="alert" className="text-xs font-semibold text-red-600">
                Duplicate: this product is already in the list.
              </p>
            )
          }
        >
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Sugar 50kg"
            autoComplete="off"
            aria-invalid={duplicate}
            className={`${inputBase} ${duplicate ? inputBad : inputOk}`}
          />
        </Field>

        <Field id="quantity" label="Number of products">
          <input
            id="quantity"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={form.quantity}
            onChange={set("quantity")}
            placeholder="0"
            className={`${inputBase} ${inputOk} num`}
          />
        </Field>

        <Field id="buyPrice" label={`Buying price (${CURRENCY})`}>
          <input
            id="buyPrice"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={form.buyPrice}
            onChange={set("buyPrice")}
            placeholder="0.00"
            className={`${inputBase} ${inputOk} num`}
          />
        </Field>

        <Field id="sellPrice" label={`Selling price (${CURRENCY})`}>
          <input
            id="sellPrice"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={form.sellPrice}
            onChange={set("sellPrice")}
            placeholder="0.00"
            className={`${inputBase} ${inputOk} num`}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="num text-sm text-muted">
          Line total: buying{" "}
          <span className="font-medium text-ink">{money(lineBuy)}</span>
          {"  "}· selling{" "}
          <span className="font-medium text-ink">{money(lineSell)}</span>
        </p>
        <div className="flex gap-2">
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium hover:bg-paper"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!valid}
            className="rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editing ? "Save changes" : "Add product"}
          </button>
        </div>
      </div>
    </form>
  );
}
