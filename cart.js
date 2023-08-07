const documentCartPage = {
  cart_items: document.querySelector(".cart_items"),
  returnMain: document.querySelector(".returnMain"),
  countPizzas: document.querySelector(".countPizzas"),
  totalPrice: document.querySelector(".totalPrice"),
  trash_text: document.querySelector(".trash_text"),
  emptyPage: document.querySelector(".emptyPage"),
};

function getPizzasFromID(ids) {
  let idPizzas = ids.split(",");

  documentCartPage.countPizzas.innerHTML = idPizzas.length;

  let obj = {};

  idPizzas.forEach((elem) => {
    if (obj[elem]) {
      obj[elem] += 1;
    } else {
      obj[elem] = 1;
    }
  });
  return obj;
}

function displayPizzaCardInCart(obj) {
  let items = [];
  let totalPrice = 0;

  for (const key in obj) {
    let idPizza = key.split("_")[0];

    let result = {};

    for (let i = 0; i < data_pizzas.length; i++) {
      const pizza = data_pizzas[i];

      if (idPizza === pizza.id) {
        result = {
          name: pizza.name,
          id: pizza.id,
        };

        for (let k = 0; k < pizza.type.length; k++) {
          const type = pizza.type[k];

          if (key === type.id) {
            totalPrice += type.price * obj[key];

            result = {
              ...result,
              price: type.price,
              type_name: type.type_name,
              type_id: type.id,
            };
          }
        }
      }
    }

    items.push(`
      <div class="cart_item">
        <div class="cart_wrapper">
            <div class="item_info">
                <img src="./assets/pizzas/${result.id}.jpg" alt="" />
                <div class="item_info_description">
                    <h1>${result.name}</h1>
                    <p>${result.type_name} тесто</p>
                </div>
            </div>
            <div class="item_count">
                <button onclick='calcPizzaInCart("${result.type_id}", "-")'>
                    <p>-</p>
                </button>
                <p>${obj[key]}</p>
                <button onclick='calcPizzaInCart("${result.type_id}", "+")'>
                    <p>+</p>
                </button>
            </div>
        </div>
        <div class="cart_wrapper">
            <h1 class="item_price">${result.price * obj[key]} P</h1>
            <button class="remove" onclick='removeTypePizzas("${
              result.type_id
            }")'>
                <img src="./assets/icons/remove.png" alt="remove" />
            </button>
        </div>
      </div>
    `);
  }

  documentCartPage.totalPrice.innerHTML = totalPrice;

  return items;
}

documentMainPage.cart_btn.addEventListener("click", function () {
  const pizzaCookie = document.cookie.split("; ");
  let isCookie = false;

  let cookieIDPizza = "";

  for (let i = 0; i < pizzaCookie.length; i++) {
    const elem = pizzaCookie[i].split("=");

    if (elem[0] === "pizza") {
      isCookie = true;
      cookieIDPizza = elem[1];
    }
  }

  const objPizza = getPizzasFromID(cookieIDPizza);

  const pizzas = displayPizzaCardInCart(objPizza);

  documentCartPage.cart_items.innerHTML = pizzas.join("");

  if (isCookie) {
    documentMainPage.mainPage.classList.add("none");
    documentMainPage.cartPage.classList.remove("none");
  }
});

documentCartPage.returnMain.addEventListener("click", function () {
  documentMainPage.mainPage.classList.remove("none");
  documentMainPage.cartPage.classList.add("none");
});

function removeTypePizzas(id) {
  const pizzaCookie = document.cookie.split("; ");
  let isCookie = false;

  let cookieIDPizza = "";

  for (let i = 0; i < pizzaCookie.length; i++) {
    const elem = pizzaCookie[i].split("=");

    if (elem[0] === "pizza") {
      isCookie = true;
      cookieIDPizza = elem[1];
    }
  }

  const arrayIDPizza = cookieIDPizza.split(",");

  let newPizzas = [];

  for (let i = 0; i < arrayIDPizza.length; i++) {
    const pizzaID = arrayIDPizza[i];

    if (pizzaID !== id) {
      newPizzas.push(pizzaID);
    }
  }

  if (newPizzas.length) {
    document.cookie = `pizza=${newPizzas.join(",")}; max-age=100000`;
  } else {
    document.cookie = `pizza=1; max-age=-1`;
  }

  const objPizza = getPizzasFromID(newPizzas.join(","));

  const pizzas = displayPizzaCardInCart(objPizza);

  documentCartPage.cart_items.innerHTML = pizzas.join("");
}

function calcPizzaInCart(id, operator) {
  const pizzaCookie = document.cookie.split("; ");
  let isCookie = false;

  let cookieIDPizza = "";

  for (let i = 0; i < pizzaCookie.length; i++) {
    const elem = pizzaCookie[i].split("=");

    if (elem[0] === "pizza") {
      isCookie = true;
      cookieIDPizza = elem[1];
    }
  }

  let objPizza = getPizzasFromID(cookieIDPizza);

  let editCookie = "";

  for (const key in objPizza) {
    if (key === id) {
      if (operator === "+") {
        objPizza[key] += 1;
      } else {
        objPizza[key] -= 1;
      }
    }
  }

  for (const key in objPizza) {
    for (let i = 0; i < objPizza[key]; i++) {
      editCookie += `${key},`;
    }
  }

  document.cookie = `pizza=${editCookie.slice(0, -1)}; max-age=100000`;

  const pizzas = displayPizzaCardInCart(objPizza);

  documentCartPage.cart_items.innerHTML = pizzas.join("");
}

documentCartPage.trash_text.addEventListener("click", function () {
  document.cookie = `pizza=0; max-age=-1`;

  documentCartPage.emptyPage.classList.remove("none");
  documentMainPage.cartPage.classList.add("none");
});
