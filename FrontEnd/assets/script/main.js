const galleryElement = document.querySelector(".gallery");
const categoriesElement = document.querySelector(".filters");
const editionBandeauElement = document.querySelector(".edition");
const modifyButtonModalElement = document.querySelector("#modifier");
const modalElement = document.getElementById("modal");
const modalElement2 = document.getElementById("modal-2");
const modalGalleryElement = document.querySelector(".galerie-modifications");
const boutonActionModal = document.querySelector(".bouton-modal");
const boutonAjouterPhotoPreview = document.querySelector(".bouton-ajouter-photo");
const divAjoutPhoto = document.querySelector(".ajout-photo");
const boutonAjoutPreview = document.getElementById("work-image");
const inputTitreWork = document.getElementById("work-title");
const listOptionModal = document.getElementById("work-category");
const optionElement = document.createElement("option");
const apercuPhoto = document.querySelector(".photo-apercu");
const boutonValidationAjout = document.querySelector(".bouton-modal-2");
const retourModal = document.querySelector(".back-modal");
const formulaireAjout = document.querySelector("#form-ajout-photo");
const messageAjout = document.querySelector(".message-ajout-photo");

let worksItems = [];
let categoriesItems = [];
let isLogged = sessionStorage.getItem("token") || null;
let userId = Number(sessionStorage.getItem("userId")) || null;
let modal = null;

const afficherBandeauEdition = () => {
    const header = document.querySelector("header");
    const editionBandeauElement = document.createElement("div");
    const editionIcone = document.createElement("span");
    const modeEditionTitre = document.createElement("h3");
    const boutonPublier = document.createElement("button");
    const headerSite = document.getElementById("header-site");

    editionBandeauElement.classList.add("edition");
    headerSite.classList.replace("header-site", "header-site-edition");
    modeEditionTitre.textContent = "Mode édition";
    boutonPublier.classList.add("bouton-publier");
    categoriesElement.style.display = "none";

    editionBandeauElement.appendChild(editionIcone);
    editionBandeauElement.appendChild(modeEditionTitre);
    editionBandeauElement.appendChild(boutonPublier);
    header.appendChild(editionBandeauElement);
};

if (isLogged !== null && userId === 1) {
    editionBandeauElement.style.display = "flex";
    modifyButtonModalElement.style.display = "block";
    afficherBandeauEdition();

    document.getElementById("bouton-login").innerHTML = "<li>logout</li>";
    document.getElementById("bouton-login").addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("token", "userId");
        location.reload();
    });

    modifyButtonModalElement.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
    });
}

const getWorks = async () => {
    worksItems = [];
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        if (response.ok) {
            worksItems.push(...data);
        }
    } catch (error) {
        console.log(error);
    }
};

const createWorks = (works) => {
    galleryElement.innerHTML = "";
    works.forEach((work) => {
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");

        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        figcaptionElement.textContent = work.title;

        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
        galleryElement.appendChild(figureElement);
    });
};

const getCategories = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        if (response.ok) {
            categoriesItems.push(...data);
        }
    } catch (error) {
        console.log(error);
    }
};

const createButtonFilter = (id, name) => {
    const filterElement = document.createElement("li");

    filterElement.textContent = name;
    filterElement.dataset.id = id;
    filterElement.classList.add("click_categorie");
    if (id === 0) {
        filterElement.classList.add("selected_filter");
    }

    filterElement.addEventListener("click", () => {
        document.querySelectorAll(".click_categorie").forEach((button) => {
            button.classList.remove("selected_filter");
        });
        filterElement.classList.add("selected_filter");

        galleryElement.innerHTML = "";

        if (Number(filterElement.getAttribute("data-id")) === 0) {
            return createWorks(worksItems);
        }

        const filteredWorks = worksItems.filter(
            (work) =>
                work.categoryId ===
                Number(filterElement.getAttribute("data-id"))
        );
        createWorks(filteredWorks);
    });

    categoriesElement.appendChild(filterElement);
};

const createCategories = (categories) => {
    createButtonFilter(0, "Tous");

    categories.forEach((categorie) => {
        createButtonFilter(categorie.id, categorie.name);
    });
};

const createCategoriesModal = (categories) => {
    listOptionModal.innerHTML = "";

    createOptionModal(0, "");

    categories.forEach((categorie) => {
        createOptionModal(categorie.id, categorie.name);
    });
};

const createOptionModal = (id, name) => {
    const listOptionModal = document.getElementById("work-category");
    const optionElement = document.createElement("option");

    optionElement.textContent = name;
    optionElement.value = id;

    listOptionModal.appendChild(optionElement);
};

const createWorksGalleryModal = (works) => {
    modalGalleryElement.innerHTML = "";
    works.forEach((work) => {
        const item = document.createElement("div");
        const imageItem = document.createElement("img");
        const editerItem = document.createElement("button");
        const supprimerItem = document.createElement("i");

        item.classList.add("work-card-modal");
        imageItem.src = work.imageUrl;
        imageItem.alt = work.title;
        editerItem.textContent = "éditer";
        supprimerItem.classList.add("fa-regular", "fa-trash-can", "pointer");
        supprimerItem.addEventListener("click", () => {
            supprimerVignette(work.id);
        });

        item.appendChild(supprimerItem);
        item.appendChild(imageItem);
        item.appendChild(editerItem);
        modalGalleryElement.appendChild(item);
    });
};

const init = async () => {
    await getWorks();
    await getCategories();
    createWorks(worksItems);
    createCategories(categoriesItems);
    createWorksGalleryModal(worksItems);
};

init();

const stopPropagation = (e) => {
    e.stopPropagation();
};

const openModal = (e) => {
    modal = modalElement;

    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    modal.addEventListener("click", closeModal);
    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal
        .querySelector(".mes-projets")
        .addEventListener("click", stopPropagation);
};

boutonActionModal.addEventListener("click", (e) => {
    modal = modalElement2;

    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    modal.addEventListener("click", closeModal);
    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal
        .querySelector(".ajout-photo-modal")
        .addEventListener("click", stopPropagation);

    createCategoriesModal(categoriesItems);
});

retourModal.addEventListener("click", (e) => {
    closeModal();
    window.setTimeout(() => {
        openModal();
    }, 251);
    modal = modalElement;
});

const closeModal = () => {
    if (modal.id === null) return;

    if (modal.id === "modal") {
        window.setTimeout(() => {
            modal.style.display = "none";
            modal = null;
        }, 50);
    }

    if (modal.id === "modal-2") {
        window.setTimeout(() => {
            modalElement2.style.display = "none";
            modalElement.style.display = "none";
            modal = null;
        }, 50);

        modalElement2.setAttribute("aria-hidden", "true");
        modalElement2.removeAttribute("aria-modal");
        modalElement2.removeEventListener("click", closeModal);
        modalElement2
            .querySelector(".close-modal")
            .removeEventListener("click", closeModal);
        modalElement2
            .querySelector(".ajout-photo-modal")
            .removeEventListener("click", stopPropagation);

        resetForm();
    }

    modalElement.setAttribute("aria-hidden", "true");
    modalElement.removeAttribute("aria-modal");
    modalElement.removeEventListener("click", closeModal);
    modalElement
        .querySelector(".close-modal")
        .removeEventListener("click", closeModal);
    modalElement
        .querySelector(".mes-projets")
        .removeEventListener("click", stopPropagation);
};

const supprimerVignette = async (e) => {
    if (confirm("Voulez-vous vraiment supprimer cette image ?") == true) {
        const token = sessionStorage.getItem("token");
        const bearer = "Bearer " + token;
        const response = await fetch("http://localhost:5678/api/works/" + e, {
            method: "DELETE",
            headers: {
                Authorization: bearer,
                Accept: "application/json",
            },
            body: JSON.stringify(),
        });

        if (response.status === 204) {
            await getWorks();
            createWorks(worksItems);
            createWorksGalleryModal(worksItems);
        }
    }
};

boutonAjouterPhotoPreview.addEventListener("click", () => {
    boutonAjoutPreview.click();
});

boutonAjoutPreview.addEventListener("change", (e) => {
    const imageSource = URL.createObjectURL(e.target.files[0]);
    const preview = document.createElement("img");

    divAjoutPhoto.style.display = "none";
    apercuPhoto.style.display = "flex";
    preview.src = imageSource;

    apercuPhoto.appendChild(preview);
});

const resetForm = () => {
    formulaireAjout.reset();
    divAjoutPhoto.style.display = "flex";
    apercuPhoto.innerHTML = "";
    apercuPhoto.style.display = "none";
};

formulaireAjout.addEventListener("change", () => {
    checkFormulaire();
});

const checkFormulaire = () => {
    if (
        boutonAjoutPreview.files[0] !== undefined &&
        inputTitreWork.value !== "" &&
        listOptionModal.value !== "0"
    ) {
        boutonValidationAjout.disabled = false;
    } else {
        boutonValidationAjout.disabled = true;
    }
};

formulaireAjout.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    const bearer = "Bearer " + token;
    const data = new FormData(formulaireAjout);
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: bearer,
        },
        body: data,
    });

    if (
        response.status === 400 ||
        response.status === 401 ||
        response.status === 500
    ) {
        messageAjout.style.display = "block";
        messageAjout.textContent =
            "Une erreur est survenue, vérifiez le formulaire.";
        setTimeout(() => {
            messageAjout.style.display = "none";
            messageAjout.textContent = "";
        }, 3000);
    }

    if (response.status === 201) {
        resetForm();
        await getWorks();
        createWorks(worksItems);
        createWorksGalleryModal(worksItems);

        messageAjout.style.display = "block";
        messageAjout.textContent = "Votre photo a bien été ajoutée !";
        setTimeout(() => {
            messageAjout.style.display = "none";
            messageAjout.textContent = "";
        }, 3000);
    }
});
