const TABS = ["Register", "Verify", "History"];

export default function Tabs({ active, setActive }) {
  return (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mx-auto mb-8">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
            active === tab
              ? "bg-white text-brand-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
