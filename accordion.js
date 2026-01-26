document.addEventListener("DOMContentLoaded", () => {
    // Select all headers inside elements with class 'card'
    const headers = document.querySelectorAll(".card header");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            // Find the parent .card element
            const card = header.parentElement;

            // Toggle the class 'is-open'
            card.classList.toggle("is-open");
        });
    });
});