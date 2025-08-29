// src/components/AuthForm.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthForm() {
  const [mode, setMode] = useState("signIn"); // no <"signIn" | "signUp">
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // no <string | null>

  const handleSubmit = async (e) => { // no : React.FormEvent
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signUp") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("✅ Check your inbox for a confirmation email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("✅ Signed in!");
      }
    } catch (err) { // no : any
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "380px", margin: "0 auto" }}>
      <h2>{mode === "signUp" ? "Create Account" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </label>

        <label style={{ marginTop: "0.5rem" }}>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: "1rem", width: "100%" }}>
          {loading ? (mode === "signUp" ? "Creating…" : "Signing…") : mode === "signUp" ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        {mode === "signUp" ? "Already have an account? " : "No account yet? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signUp" ? "signIn" : "signUp");
            setMessage(null);
          }}
          style={{ color: "steelblue", background: "none", border: "none" }}
        >
          {mode === "signUp" ? "Sign In" : "Sign Up"}
        </button>
      </p>

      {message && (
        <p style={{ marginTop: "0.5rem", color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
