"use client";

import { FormEvent, useMemo, useState } from "react";

type LoginState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginErrors = Partial<Record<keyof Omit<LoginState, "rememberMe">, string>>;

const initialState: LoginState = {
  email: "",
  password: "",
  rememberMe: true,
};

export default function LoginForm() {
  const [formValues, setFormValues] = useState<LoginState>(initialState);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting || !formValues.email || !formValues.password;
  }, [formValues.email, formValues.password, isSubmitting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const validationErrors = validate(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await fakeSignIn(formValues);
    } catch {
      setErrors((prev) => ({ ...prev, email: "Sign in is unavailable right now." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof LoginState, value: string | boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} aria-label="CityScope login form">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formValues.email}
          onChange={(event) => handleChange("email", event.target.value)}
          className="block w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200/70"
          placeholder="you@email.com"
        />
        {errors.email ? (
          <p className="text-xs font-medium text-red-300">{errors.email}</p>
        ) : (
          <p className="text-xs text-white/60">Use your organization or CityScope account email.</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formValues.password}
          onChange={(event) => handleChange("password", event.target.value)}
          className="block w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200/70"
          placeholder="••••••••"
        />
        {errors.password ? (
          <p className="text-xs font-medium text-red-300">{errors.password}</p>
        ) : (
          <p className="text-xs text-white/60">At least 8 characters, including a number.</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-xs text-white/80">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-200/60"
            checked={formValues.rememberMe}
            onChange={(event) => handleChange("rememberMe", event.target.checked)}
          />
          Remember me on this device
        </label>
        <button
          type="button"
          className="text-xs font-semibold text-cyan-200 transition hover:text-cyan-100"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="flex w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/40 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40 disabled:shadow-none"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs text-white/70">
        Authentication is coming soon. For demo access, contact the CityScope team.
      </p>
    </form>
  );
}

function validate(values: LoginState): LoginErrors {
  const nextErrors: LoginErrors = {};

  if (!values.email.includes("@")) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    nextErrors.password = "Password must be at least 8 characters.";
  }

  return nextErrors;
}

async function fakeSignIn(_: LoginState) {
  // Replace with real authentication integration in the future.
  return new Promise((resolve) => {
    setTimeout(resolve, 600);
  });
}

