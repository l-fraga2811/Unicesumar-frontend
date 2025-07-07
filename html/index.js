async function fetchItems() {
  try {
    const response = await fetch("../data/all-items.json");
    if (!response.ok) {
      throw new Error("Falha ao buscar os dados");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar os itens:", error);
    return [];
  }
}

async function fetchFeedbacks() {
  try {
    const response = await fetch("../data/feedbacks.json");
    if (!response.ok) {
      throw new Error("Falha ao buscar os dados");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar os itens:", error);
    return [];
  }
}

function createFeedbackCarousel(feedbacks) {
  if (!feedbacks || feedbacks.length === 0) return;

  const feedbackContent = document.querySelector(".feedback-content");
  const leftButton = document.getElementById("left-btn-feedback");
  const rightButton = document.getElementById("right-btn-feedback");

  const feedbackText = feedbackContent.querySelector(".feedback-text");
  const feedbackName = feedbackContent.querySelector(".feedback-name");
  const feedbackRole = feedbackContent.querySelector(".feedback-role");
  const feedbackImg = feedbackContent.querySelector(".feedback-img img");

  let currentIndex = 0;

  function updateFeedback() {
    const feedback = feedbacks[currentIndex];

    feedbackContent.classList.add("fade-out");

    setTimeout(() => {
      feedbackText.textContent = feedback.message;
      feedbackName.textContent = feedback.full_name;
      feedbackRole.textContent = feedback.profession;
      feedbackImg.src = feedback.image_url;
      feedbackImg.alt = feedback.full_name;

      feedbackContent.classList.remove("fade-out");
    }, 300);
  }

  leftButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + feedbacks.length) % feedbacks.length;
    updateFeedback();
  });

  rightButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % feedbacks.length;
    updateFeedback();
  });

  updateFeedback();
}

function filterNewItems(items) {
  return items.filter((item) => item.is_new === true);
}

function createCards(items) {
  const menuItemsContainer = document.querySelector(".menu-items");

  menuItemsContainer.innerHTML = "";

  const defaultImage = "https://via.placeholder.com/300x200?text=Sem+Imagem";

  items.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";

    const imageUrl =
      item.imagem_url && item.imagem_url.trim() !== ""
        ? item.imagem_url
        : defaultImage;

    menuItem.innerHTML = `
            <li>
                <img src="${imageUrl}" alt="${item.name}" />
                <h1 class="coffee-color menu-title" id="coffee-title">
                    ${item.name}
                </h1>
                <p class="gray-text" id="coffee-description">
                    ${item.short_description || ""}
                </p>
                <p class="coffee-color" id="coffee-price">R$${item.price.toFixed(
                  2
                )}</p>
                <button class="main-button" id="order-btn">Order now</button>
            </li>
        `;

    menuItemsContainer.appendChild(menuItem);
  });
}

function getUniqueTypes(items) {
  const types = items.map((item) => item.type);
  return ["All Items", ...new Set(types)];
}

function createFilterButtons(types, items) {
  const filterContainer = document.querySelector(".table-filters");

  filterContainer.innerHTML = "";

  types.forEach((type, index) => {
    const button = document.createElement("button");
    button.className = "main-button";
    button.id = "filter-btn";
    button.textContent = type;

    if (index === 0) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      let filteredItems;

      if (type === "All Items") {
        filteredItems = items;
      } else {
        filteredItems = items.filter((item) => item.type === type);
      }

      updateTable(filteredItems);

      document.querySelectorAll("#filter-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });

    filterContainer.appendChild(button);
  });
}

function updateTable(items) {
  const tableBody = document.querySelector(".table-body");

  tableBody.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("tr");

    const formattedPrice = `R$ ${item.price.toFixed(2)}`;

    row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${formattedPrice}</td>
        `;

    tableBody.appendChild(row);
  });
}

function validateAndSubscribe() {
  const emailInput = document.querySelector(".subscribe-input");
  const subscribeBtn = document.querySelector(".subscribe-btn");
  const contactSection = document.querySelector(".contact-section");

  const existingMessage = contactSection.querySelector(".subscription-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageElement = document.createElement("div");
  messageElement.className = "subscription-message";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(emailInput.value);

  if (isValid) {
    messageElement.textContent = "Subscribed successfully!";
    messageElement.classList.add("success-message");

    localStorage.setItem("subscribedEmail", emailInput.value);

    updateSubscriptionUI(emailInput.value);
  } else {
    messageElement.textContent = "Please enter a valid email.";
    messageElement.classList.add("error-message");
  }

  const subscribeBox = document.querySelector(".subscribe-box");
  subscribeBox.parentNode.insertBefore(
    messageElement,
    subscribeBox.nextSibling
  );

  setTimeout(() => {
    messageElement.classList.add("fade-out");
    setTimeout(() => {
      messageElement.remove();
    }, 500);
  }, 3000);
}

function cancelSubscription() {
  localStorage.removeItem("subscribedEmail");

  const subscribeBox = document.querySelector(".subscribe-box");

  subscribeBox.innerHTML = `
        <input type="email" placeholder="Enter your mail" class="subscribe-input" />
        <button class="subscribe-btn">Subscribe</button>
    `;

  const subscribeBtn = document.querySelector(".subscribe-btn");
  subscribeBtn.addEventListener("click", validateAndSubscribe);

  const contactSection = document.querySelector(".contact-section");
  const messageElement = document.createElement("div");
  messageElement.className = "subscription-message";
  messageElement.textContent = "Subscription canceled successfully!";
  messageElement.classList.add("info-message");

  contactSection.querySelector(".subscription-message")?.remove();
  subscribeBox.parentNode.insertBefore(
    messageElement,
    subscribeBox.nextSibling
  );

  setTimeout(() => {
    messageElement.classList.add("fade-out");
    setTimeout(() => {
      messageElement.remove();
    }, 500);
  }, 3000);
}

function updateSubscriptionUI(email) {
  const subscribeBox = document.querySelector(".subscribe-box");

  subscribeBox.innerHTML = `
        <div class="subscribed-info">
            <span>Inscribed with: ${email}</span>
            <button class="cancel-btn">Cancel subscription</button>
        </div>
    `;

  const cancelBtn = document.querySelector(".cancel-btn");
  cancelBtn.addEventListener("click", cancelSubscription);
}

function checkSubscriptionStatus() {
  const subscribedEmail = localStorage.getItem("subscribedEmail");

  if (subscribedEmail) {
    updateSubscriptionUI(subscribedEmail);
  }
}

function handleHeaderScroll() {
  const header = document.querySelector("header");
  const homeSection = document.getElementById("home-page");
  let lastScrollTop = 0;

  function isInHomeSection() {
    if (!homeSection) return false;

    const rect = homeSection.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom > 0;
  }

  function updateHeaderState() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (!isInHomeSection()) {
      header.classList.add("with-background");
    } else {
      header.classList.remove("with-background");
    }

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.classList.add("hide");
      header.classList.remove("show");
    } else {
      header.classList.remove("hide");
      header.classList.add("show");
    }

    lastScrollTop = scrollTop;
  }

  window.addEventListener("scroll", updateHeaderState);

  updateHeaderState();
}

async function init() {
  const allItems = await fetchItems();
  const feedbacks = await fetchFeedbacks();

  const newItems = filterNewItems(allItems);

  createFeedbackCarousel(feedbacks);
  createCards(newItems);

  const uniqueTypes = getUniqueTypes(allItems);

  createFilterButtons(uniqueTypes, allItems);

  updateTable(allItems);

  checkSubscriptionStatus();

  const subscribeBtn = document.querySelector(".subscribe-btn");
  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", validateAndSubscribe);
  }

  handleHeaderScroll();
}

document.addEventListener("DOMContentLoaded", init);
