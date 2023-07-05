const form = document.querySelector("form");
const errorElement = document.querySelector(".error");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.status === 404 || response.status === 401) {
        errorElement.style.display = "block";
        errorElement.textContent =
            "L'adresse e-mail et/ou le mot de passe sont incorrects";
        setTimeout(() => {
            errorElement.style.display = "none";
            errorElement.textContent = "";
        }, 3000);
    }

    if (response.status === 200) {
        const token = data.token;
        const userId = data.userId;

        sessionStorage.clear;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", userId);
        window.location.href = "./index.html";
    }
});
