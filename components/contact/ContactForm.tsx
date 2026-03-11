"use client";

import { useState } from "react";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`
  : null;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setStatus("error");
      setErrorMessage("Contact form is not configured. Please set NEXT_PUBLIC_FORMSPREE_FORM_ID.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (!FORMSPREE_ENDPOINT) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-center text-sm text-amber-800">
        <p className="font-medium">Contact form not configured</p>
        <p className="mt-2">
          Set <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_FORMSPREE_FORM_ID</code> in your environment to enable the form. Get a free form ID at{" "}
          <a
            href="https://formspree.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-900"
          >
            formspree.io
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
      <h3 className="mb-5 border-l-4 border-amber-500 pl-4 text-lg font-bold tracking-tight text-stone-900">
        Get in touch
      </h3>
      <p className="mt-2 text-sm text-stone-600">
        Have a question or feedback? Send us a message and we&apos;ll get back to you.
      </p>

      {status === "success" && (
        <div
          className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-800"
          role="alert"
        >
          Thanks! Your message has been sent. We&apos;ll reply as soon as we can.
        </div>
      )}

      {status === "error" && errorMessage && (
        <div
          className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
        aria-label="Contact form"
      >
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-stone-700">
            Name <span className="text-amber-600">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            disabled={status === "sending"}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-stone-100"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-stone-700">
            Email <span className="text-amber-600">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            disabled={status === "sending"}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-stone-100"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-stone-700">
            Subject <span className="text-amber-600">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            required
            disabled={status === "sending"}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-stone-100"
            placeholder="What is this about?"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-stone-700">
            Message <span className="text-amber-600">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            disabled={status === "sending"}
            className="mt-1.5 w-full resize-y rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-stone-100"
            placeholder="Your message..."
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-amber-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50 disabled:opacity-70 disabled:pointer-events-none"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
