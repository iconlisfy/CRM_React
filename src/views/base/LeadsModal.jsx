import React, { useState } from "react";
import { X, Plus } from "lucide-react";

export default function LeadsModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState([]);
  const [followUp, setFollowUp] = useState(false);
  const [doubtFull, setDoubtFull] = useState(false);
  const [product, setProduct] = useState("");
  const [note, setNote] = useState("");
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");

  const addItem = () => {
    if (!product.trim()) return;
    setItems([
      ...items,
      { slno: items.length + 1, product, note, qty, value },
    ]);
    setProduct("");
    setNote("");
    setQty("");
    setValue("");
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-2.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          Open Leads Modal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={() => setIsOpen(false)} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-lg z-10">
          <h2 className="text-indigo-600 font-semibold text-lg">Leads</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Row 1: Date Time + Lead Id */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWrap label="Date Time">
              <input
                type="datetime-local"
                defaultValue="2026-07-25T11:54"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </FieldWrap>
            <input
              placeholder="Lead Id"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 self-end focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Row 2: Phone + Customer Name */}
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Customer Phone Number"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              placeholder="Customer Name"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Row 3: Place, Assign to, Lead Source, Lead Source Location */}
          <div className="grid grid-cols-4 gap-4">
            <input
              placeholder="Place"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Assign to</option>
            </select>
            <select className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Lead Source</option>
            </select>
            <input
              placeholder="Lead Source Location"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Enquired for section */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="text-indigo-600 font-medium text-sm mb-3">Enquired for</h3>
            <div className="grid grid-cols-[1fr_1fr_0.6fr_0.6fr_auto] gap-3 mb-3">
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Product"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Qty"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Value"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={addItem}
                className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <th className="text-left px-3 py-2 font-medium">Slno</th>
                    <th className="text-left px-3 py-2 font-medium">Product</th>
                    <th className="text-left px-3 py-2 font-medium">Note</th>
                    <th className="text-left px-3 py-2 font-medium">Qty</th>
                    <th className="text-left px-3 py-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-slate-400 py-4">
                        No items added to enquiry yet.
                      </td>
                    </tr>
                  ) : (
                    items.map((it) => (
                      <tr key={it.slno} className="border-t border-slate-100">
                        <td className="px-3 py-2">{it.slno}</td>
                        <td className="px-3 py-2">{it.product}</td>
                        <td className="px-3 py-2">{it.note}</td>
                        <td className="px-3 py-2">{it.qty}</td>
                        <td className="px-3 py-2">{it.value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks */}
          <textarea
            placeholder="Remarks"
            rows={2}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Follow up + Lead type row */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={followUp}
                onChange={(e) => setFollowUp(e.target.checked)}
                className="rounded border-slate-300"
              />
              Follow Up Required
            </label>
            <FieldWrap label="Date Time">
              <input
                type="datetime-local"
                defaultValue="2026-07-25T11:54"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </FieldWrap>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <select className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Lead Type</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={doubtFull}
                onChange={(e) => setDoubtFull(e.target.checked)}
                className="rounded border-slate-300"
              />
              Doubt Full Lead
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 sticky bottom-0 bg-white rounded-b-lg">
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 rounded-md bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button className="px-5 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            New
          </button>
          <button className="px-5 py-2 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldWrap({ label, children }) {
  return (
    <div>
      <span className="block text-xs text-slate-400 mb-1">{label}</span>
      {children}
    </div>
  );
}
