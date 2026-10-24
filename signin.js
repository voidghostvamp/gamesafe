
import { supabase } from "./supabase.js";

const form = document.getElementById("signin-form");
const message = document.getElementById("signin-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;
    const button = form.querySelector('button[type="submit"]');

    message.textContent = "Signing in...";
    button.disabled = true;

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw error;
        }

        message.style.color = "#86efac";
        message.textContent = "Sign-in successful! Welcome to GameSafe.";

        window.location.href = "games.html";

    } catch (error) {
        message.style.color = "#fca5a5";
        message.textContent = error.message || "Sign-in failed. Please try again.";
    } finally {
        button.disabled = false;
    }
});
