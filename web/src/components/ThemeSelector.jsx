import { useState } from "react";
import {
  Plane,
  Briefcase,
  Dumbbell,
  Tv,
  ShoppingCart,
  BookOpen,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";

const options = [
  { label: "Travel", value: "travel", icon: Plane },
  { label: "Portfolio", value: "portfolio", icon: Briefcase },
  { label: "Sports", value: "sports", icon: Dumbbell },
  { label: "Entertainment", value: "entertainment", icon: Tv },
  { label: "E-commerce", value: "ecommerce", icon: ShoppingCart },
  { label: "Blog", value: "blog", icon: BookOpen },
  { label: "Education", value: "education", icon: GraduationCap },
  { label: "Others", value: "others", icon: MoreHorizontal },
];

export default function ThemeSelector({ selected, onSelect }) {
  const [customOther, setCustomOther] = useState("");
  const handleOtherChange = (e) => {
    setCustomOther(e.target.value);
    onSelect(e.target.value ? e.target.value : "others");
  };
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 mt-10 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Theme or Type of App
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div key={opt.value} className="flex flex-col items-center w-full">
              <button
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium text-gray-700 text-base shadow-sm hover:bg-orange-50 hover:border-orange-400 w-full ${
                  selected === opt.value ||
                  (opt.value === "others" &&
                    selected &&
                    !options.some((o) => o.value === selected))
                    ? "border-orange-500 bg-orange-100"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => {
                  if (opt.value === "others") {
                    setCustomOther("");
                    onSelect("others");
                  } else {
                    setCustomOther("");
                    onSelect(opt.value);
                  }
                }}
                type="button"
              >
                <Icon className="w-8 h-8 mb-2" />
                {opt.label}
              </button>
              {opt.value === "others" &&
                (selected === "others" ||
                  (selected && !options.some((o) => o.value === selected))) && (
                  <input
                    type="text"
                    className="mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                    placeholder="Enter custom theme..."
                    value={customOther}
                    onChange={handleOtherChange}
                  />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
