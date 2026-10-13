/* =========================================================
   DR NETTOYAGE RENNES
   MAIN JAVASCRIPT
========================================================= */


/* =========================
   MOBILE MENU
========================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mainNav = document.getElementById("mainNav");

if (mobileMenuButton && mainNav) {
    mobileMenuButton.addEventListener("click", () => {
        mainNav.classList.toggle("open");

        if (mainNav.classList.contains("open")) {
            mobileMenuButton.textContent = "✕";
        } else {
            mobileMenuButton.textContent = "☰";
        }
    });

    const navLinks = mainNav.querySelectorAll("a");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            mobileMenuButton.textContent = "☰";
        });
    });
}


/* =========================
   CURRENT YEAR
========================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================
   WHATSAPP
========================= */

/*
IMPORTANT:

Replace YOUR_WHATSAPP_NUMBER with your number
in international format WITHOUT:

+
spaces
dashes

Example:

French number:
06 12 34 56 78

becomes:

33612345678
*/

const whatsappNumber = "33665380417";

const whatsappMessage =
    "Bonjour, je souhaite obtenir des informations concernant vos services de nettoyage.";

const whatsappButton = document.getElementById("whatsappButton");

if (
    whatsappButton &&
    whatsappNumber !== "YOUR_WHATSAPP_NUMBER"
) {
    whatsappButton.href =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
}


/* =========================
    QUOTE FORM - WEB3FORMS
========================= */

const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
    const formStatus = document.getElementById("quoteFormStatus");
    const submitButton = quoteForm.querySelector('button[type="submit"]');
    const originalButtonLabel = submitButton.textContent.trim();

    // Request an approximate area only when it helps estimate the service.
    // Textile, window cleaning and other requests do not require m².
    const serviceSelect = document.getElementById("service");
    const surfaceInput = document.getElementById("surface");
    const surfaceLabel = document.getElementById("surfaceLabel");
    const optionalSurfaceServices = new Set([
        "Canapé / textile",
        "Vitres",
        "Autre"
    ]);

    function updateSurfaceRequirement() {
        if (!serviceSelect || !surfaceInput || !surfaceLabel) return;

        const selectedService = serviceSelect.value;
        const isRequired = Boolean(selectedService) &&
            !optionalSurfaceServices.has(selectedService);

        surfaceInput.required = isRequired;
        surfaceLabel.textContent = isRequired
            ? "Surface approximative (m²) *"
            : "Surface approximative (m²) (facultatif)";
    }

    if (serviceSelect && surfaceInput && surfaceLabel) {
        serviceSelect.addEventListener("change", updateSurfaceRequirement);
        updateSurfaceRequirement();
    }

    quoteForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Prevent duplicate submissions while awaiting a response.
        if (submitButton.disabled) return;

        submitButton.disabled = true;
        submitButton.textContent = "Envoi en cours...";
        formStatus.className = "form-status form-group-full";
        formStatus.textContent = "Envoi de votre demande...";

        try {
            const formData = new FormData(quoteForm);

            const response = await fetch(quoteForm.action, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "L'envoi a échoué.");
            }

            formStatus.className = "form-status form-group-full form-status--success";
            formStatus.textContent =
                "Merci ! Votre demande de devis a bien été envoyée. Nous vous répondrons dès que possible.";
            quoteForm.reset();
            updateSurfaceRequirement();
        } catch (error) {
            console.error("Erreur Web3Forms :", error);
            formStatus.className = "form-status form-group-full form-status--error";
            formStatus.textContent =
                "Votre demande n'a pas pu être envoyée. Veuillez réessayer ou nous contacter au 06 65 38 04 17.";
            // Keep customer data in the fields if sending fails.
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonLabel;
        }
    });
}


/* =========================
   EXTERNAL LINK SAFETY
========================= */

const externalLinks = document.querySelectorAll(
    'a[target="_blank"]'
);

externalLinks.forEach((link) => {
    link.setAttribute(
        "rel",
        "noopener noreferrer"
    );
});

/* Withdrawal form: submit the customer's legal notification by Web3Forms.
   This does not replace written confirmation/recordkeeping by the business. */
const withdrawalForm = document.getElementById("withdrawalForm");
if (withdrawalForm) {
    const status = document.getElementById("withdrawalFormStatus");
    const button = withdrawalForm.querySelector('button[type="submit"]');
    withdrawalForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (button.disabled) return;
        button.disabled = true;
        const oldText = button.textContent;
        button.textContent = "Envoi en cours...";
        status.className = "form-status form-group-full";
        status.textContent = "Transmission de votre notification...";
        try {
            const response = await fetch(withdrawalForm.action, {
                method: "POST", body: new FormData(withdrawalForm),
                headers: {"Accept":"application/json"}
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Échec de l'envoi");
            status.className = "form-status form-group-full form-status--success";
            status.textContent = "Votre notification a été transmise. Conservez une copie de votre demande et vérifiez notre réponse par e-mail.";
            withdrawalForm.reset();
        } catch (error) {
            console.error("Erreur envoi de rétractation :", error);
            status.className = "form-status form-group-full form-status--error";
            status.textContent = "L'envoi n'a pas abouti. Pour exercer votre droit sans attendre, envoyez votre demande à drnettoyagerennes@gmail.com.";
        } finally {
            button.disabled = false;
            button.textContent = oldText;
        }
    });
}
