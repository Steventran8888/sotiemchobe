"use client";

export type AuthMethod = "email" | "phone";

export default function AuthMethodTabs({
  active,
  onChange,
}: {
  active: AuthMethod;
  onChange: (method: AuthMethod) => void;
}) {
  return (
    <div className="mb-4 flex rounded-lg bg-neutral-100 p-1 text-sm font-medium">
      {(["email", "phone"] as AuthMethod[]).map((method) => (
        <button
          key={method}
          type="button"
          onClick={() => onChange(method)}
          className={`flex-1 rounded-md py-2 ${
            active === method ? "bg-white text-brand shadow-sm" : "text-neutral-500"
          }`}
        >
          {method === "email" ? "Email" : "Số điện thoại"}
        </button>
      ))}
    </div>
  );
}
