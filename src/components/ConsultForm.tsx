"use client";

import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

const inputClass =
  "w-full border border-[#dde2ea] rounded-sm px-3 py-2 text-[#0e1420] focus:outline-none focus:ring-2 focus:ring-[#2f6fed] focus:border-transparent";

export default function ConsultForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(
          data.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setStatus("success");
      setForm(initialState);
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border-l-2 border-[#1e8e5a] bg-[#1e8e5a]/5 rounded-sm p-4">
        <p className="text-[#0e1420]">
          Thanks — we&apos;ve received your message and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium mb-1 text-[#0e1420]"
          htmlFor="name"
        >
          Name *
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1 text-[#0e1420]"
          htmlFor="email"
        >
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1 text-[#0e1420]"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1 text-[#0e1420]"
          htmlFor="company"
        >
          Company
        </label>
        <input
          id="company"
          name="company"
          value={form.company}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1 text-[#0e1420]"
          htmlFor="message"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <div className="border-l-2 border-red-600 bg-red-50 rounded-sm p-3">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-[#0e1420] text-white rounded-sm px-4 py-2.5 hover:bg-[#2f6fed] transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
