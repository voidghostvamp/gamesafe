
import { supabase } from "./supabase.js";

const form = document.getElementById("signup-form");
const message = document.getElementById("signup-message");
const submitButton = form.querySelector('button[type="submit"]');

const GAMESAFE_URL = "https://voidghostvamp.github.io/gamesafe/";

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirm-password").value;

    message.textContent = "";
    message.style.color = "#fca5a5";

    if (username.length < 3 || username.length > 20) {
        message.textContent = "Username must be 3–20 characters.";
        return;
    }

    if (password.length < 8) {
        message.textContent = "Password must be at least 8 characters.";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Your passwords do not match.";
        return;
    }

    submitButton.disabled = true;
    submitButton.querySelector("span").textContent = "Creating account...";

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: GAMESAFE_URL,
                data: {
                    username: username
                }
            }
        });

        if (error) {
            throw error;
        }

        message.style.color = "#86efac";

        if (data.session) {
            message.textContent =
                "Account created successfully! You can now sign in.";
        } else {
            message.textContent =
                "Account created! Check your email for a confirmation link.";
        }

        form.reset();

    } catch (error) {
        message.style.color = "#fca5a5";

        if (error.message?.toLowerCase().includes("already registered")) {
            message.textContent =
                "This email is already registered. Try signing in.";
        } else {
            message.textContent =
                error.message || "Something went wrong. Please try again.";
        }

    } finally {
        submitButton.disabled = false;
        submitButton.querySelector("span").textContent = "Create account";
    }
});
