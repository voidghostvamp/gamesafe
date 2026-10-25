
import { supabase } from "./supabase.js";

const form = document.getElementById("signin-form");
const message = document.getElementById("signin-message");
const identifierInput = document.getElementById("identifier");
const passwordInput = document.getElementById("password");
const button = form.querySelector('button[type="submit"]');
const buttonLabel = button.querySelector("span");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    message.textContent = "";
    message.style.color = "#fca5a5";
    button.disabled = true;
    buttonLabel.textContent = "Signing in...";

    try {
        if (!identifier || !password) {
            throw new Error("Enter your username or email and password.");
        }

        if (identifier.includes("@")) {
            // Sign in using email and password.
            const { error } = await supabase.auth.signInWithPassword({
                email: identifier,
                password
            });

            if (error) {
                throw error;
            }
        } else {
            // Sign in using username through the Supabase Edge Function.
            const { data, error } = await supabase.functions.invoke(
                "username-login",
                {
                    body: {
                        username: identifier,
                        password
                    }
                }
            );

            if (error) {
                let errorMessage =
                    "Username sign-in failed. Please try again.";

                try {
                    const details = await error.context?.json();

                    if (details?.error) {
                        errorMessage = details.error;
                    }
                } catch {
                    // Keep the fallback error message.
                }

                throw new Error(errorMessage);
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            if (!data?.access_token || !data?.refresh_token) {
                throw new Error("No sign-in session was returned.");
            }

            // Save the Supabase session in the browser client.
            const { error: sessionError } =
                await supabase.auth.setSession({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token
                });

            if (sessionError) {
                throw sessionError;
            }
        }

        message.style.color = "#86efac";
        message.textContent = "Sign-in successful! Welcome to GameSafe.";

        window.location.href = "dashboard.html";

    } catch (error) {
        message.style.color = "#fca5a5";
        message.textContent =
            error.message || "Sign-in failed. Please try again.";

    } finally {
        button.disabled = false;
        buttonLabel.textContent = "Sign in";
    }
});
