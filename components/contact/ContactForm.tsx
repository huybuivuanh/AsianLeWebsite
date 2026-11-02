"use client";

import { useState } from "react";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`
  : null;

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setStatus("error");
      setErrorMessage(
        "Contact form is not configured. Please set NEXT_PUBLIC_FORMSPREE_FORM_ID.",
      );
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
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (!FORMSPREE_ENDPOINT) {
    return (
      <div className="rounded-3xl border border-sand-line bg-white p-8 text-center text-sm text-body">
        <p className="font-medium">Contact form not configured</p>
        <p className="mt-2">
          Set{" "}
          <code className="rounded bg-sand px-1.5 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_FORMSPREE_FORM_ID
          </code>{" "}
          in your environment to enable the form. Get a free form ID at{" "}
          <a
            href="https://formspree.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand underline hover:text-brand-dark"
          >
            formspree.io
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-sand-line bg-white p-6 sm:p-8">
      <h2 className="text-xl font-extrabold">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">
        Have a question or feedback? Send us a message and we&apos;ll get back
        to you.
      </p>

      {status === "success" && (
        <div
          className="mt-5 rounded-2xl border border-success/30 bg-success-soft p-4 text-sm font-semibold text-success"
          role="alert"
        >
          Thanks! Your message has been sent. We&apos;ll reply as soon as we
          can.
        </div>
      )}

      {status === "error" && errorMessage && (
        <div
          className="mt-5 rounded-2xl border border-brand/30 bg-white p-4 text-sm font-semibold text-brand"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 sm:grid-cols-2"
        aria-label="Contact form"
      >
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-bold"
          >
            Name <span className="text-brand">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            disabled={status === "sending"}
            className="mt-1.5 w-full rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base font-normal text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-bold"
          >
            Email <span className="text-brand">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            disabled={status === "sending"}
            className="mt-1.5 w-full rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base font-normal text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
            placeholder="your@email.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-subject"
            className="block text-sm font-bold"
          >
            Subject <span className="text-brand">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            required
            disabled={status === "sending"}
            className="mt-1.5 w-full rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base font-normal text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
            placeholder="What is this about?"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-message"
            className="block text-sm font-bold"
          >
            Message <span className="text-brand">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            disabled={status === "sending"}
            className="mt-1.5 w-full resize-y rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base font-normal text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
            placeholder="Your message..."
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-12 rounded-full bg-ink px-8 font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 sm:col-span-2 sm:justify-self-start"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
