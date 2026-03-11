import { useState } from "react";
import { SETTINGS_SECTIONS } from "../data/mock";
import Header from "../components/layout/Header";
import Toggle from "../components/ui/Toggle";

function ChipSelect({ options, value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => {
        const optVal = opt.toLowerCase();
        const isActive = value.toLowerCase() === optVal;
        return (
          <button
            key={opt}
            onClick={() => onChange(optVal)}
            className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors ${
              isActive
                ? "bg-brand text-white"
                : "bg-slate-100 text-text-secondary hover:bg-slate-200"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function Settings() {
  const [values, setValues] = useState(() => {
    const initial = {};
    SETTINGS_SECTIONS.forEach((section) =>
      section.items.forEach((item) => {
        initial[item.key] = item.value;
      })
    );
    return initial;
  });

  const update = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));

  return (
    <div>
      <Header title="설정" />
      <div className="px-4 py-3 space-y-6">
        {SETTINGS_SECTIONS.map((section) => (
          <section key={section.id}>
            <h3 className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2 px-1">
              {section.label}
            </h3>
            <div className="bg-surface rounded-2xl divide-y divide-slate-100">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-4 py-3 min-h-[48px]"
                >
                  <span className="text-[14px] text-text-primary">
                    {item.label}
                  </span>
                  {item.type === "toggle" && (
                    <Toggle
                      checked={values[item.key]}
                      onChange={(v) => update(item.key, v)}
                    />
                  )}
                  {item.type === "value" && (
                    <span className="text-[13px] text-text-secondary">
                      {values[item.key]}
                    </span>
                  )}
                  {item.type === "chip" && (
                    <ChipSelect
                      options={item.options}
                      value={String(values[item.key])}
                      onChange={(v) => update(item.key, v)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
