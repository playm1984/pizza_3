const documentMainPage = {
  pizzas_items: document.querySelector(".pizza-items"),
  btn_category: document.querySelectorAll(".btn"),
  select_pizza: document.querySelector(".select_pizza"),
  totalPrice: document.querySelector(".price"),
  totalCount: document.querySelector(".count"),
  cart_btn: document.querySelector(".cart_btn"),
  mainPage: document.querySelector(".mainPage"),
  cartPage: document.querySelector(".cartPage"),
};

let categoryPizza = data_pizzas;

document.addEventListener("DOMContentLoaded", function () {
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

  const itemsPizza = cookieIDPizza.split(",");

  let price = 0;

  for (let i = 0; i < itemsPizza.length; i++) {
    const pizzaID = itemsPizza[i].split("_")[0];
    const typeID = itemsPizza[i].split("_")[1];

    for (let k = 0; k < data_pizzas.length; k++) {
      const pizza = data_pizzas[k];

      if (pizzaID === pizza.id) {
        if (typeID === "1") {
          price += pizza.type[0].price;
        } else {
          price += pizza.type[1].price;
        }
      }
    }
  }

  if (itemsPizza[0] === "") {
    documentMainPage.totalCount.innerHTML = 0;
  } else {
    documentMainPage.totalCount.innerHTML = itemsPizza.length;
  }

  documentMainPage.totalPrice.innerHTML = price;
});

function displayPizzaCard(pizzas) {
  const items = [];

  for (let i = 0; i < pizzas.length; i++) {
    let price = 0;
    let idType = "";

    for (let k = 0; k < pizzas[i].type.length; k++) {
      const elem = pizzas[i].type[k];
      if (elem.isActive === true) {
        price = elem.price;
        idType = elem.id;
      }
    }

    items.push(`
    <div class="pizza_item">
        <img src="./assets/pizzas/${pizzas[i].id}.jpg" alt="" />
        <p class="pizza_name">${pizzas[i].name}</p>
        <div class="pizza_choice">
            <button class="pizza_choice_btn ${
              pizzas[i].type[0].isActive ? "choice_btn_active" : ""
            }" onClick='changeTypePizza("${pizzas[i].type[0].id}", "${
      pizzas[i].id
    }")'>тонкое</button>
            <button class="pizza_choice_btn ${
              pizzas[i].type[1].isActive ? "choice_btn_active" : ""
            }" onClick='changeTypePizza("${pizzas[i].type[1].id}", "${
      pizzas[i].id
    }")'>традиционное</button>
        </div>
        <div class="pizza_buy">
            <p class="pizza_price">от <span>${price}</span> &#8376;</p>
            <button class="pizza_btn_buy" onClick='buyPizza("${idType}", "${price}")'>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                >
                <path
                    d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                    fill="#EB5A1E"
                />
                </svg>
                Добавить
            </button>
        </div>
    </div>`);
  }
  return items;
}

const pizzas = displayPizzaCard(data_pizzas);

documentMainPage.pizzas_items.innerHTML = pizzas.join("");

for (let i = 0; i < documentMainPage.btn_category.length; i++) {
  const btn = documentMainPage.btn_category[i];

  btn.addEventListener("click", () => {
    documentMainPage.btn_category.forEach((elem) =>
      elem.classList.remove("btn_active")
    );
    btn.classList.add("btn_active");

    let items = [];

    data_pizzas.forEach((elem) => {
      if (elem.category == btn.innerHTML) {
        items.push(elem);
      } else if (btn.innerHTML === "Все") {
        items.push(elem);
      }
    });

    categoryPizza = items;

    const pizzas = displayPizzaCard(items);

    documentMainPage.pizzas_items.innerHTML = pizzas.join("");
  });
}

documentMainPage.select_pizza.addEventListener("change", function (event) {
  let newPizzas = [];
  if (event.target.value === "name") {
    newPizzas = categoryPizza.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  if (event.target.value === "price") {
    //* доделать сортировку!!!
  }

  const pizzas = displayPizzaCard(newPizzas);

  documentMainPage.pizzas_items.innerHTML = pizzas.join("");
});

function changeTypePizza(typeId, pizzaId) {
  let items = [];

  for (let i = 0; i < data_pizzas.length; i++) {
    let pizza = data_pizzas[i];
    if (pizza.id === pizzaId) {
      let newType = [];
      for (let k = 0; k < pizza.type.length; k++) {
        const type = pizza.type[k];
        if (type.id === typeId) {
          newType.push({ ...type, isActive: true });
        } else {
          newType.push({ ...type, isActive: false });
        }
      }
      pizza.type = newType;
      items.push(pizza);
    } else {
      items.push(pizza);
    }
  }

  const pizzas = displayPizzaCard(items);

  documentMainPage.pizzas_items.innerHTML = pizzas.join("");
}

function buyPizza(id, price) {
  let priceHTML = +documentMainPage.totalPrice.innerHTML;
  documentMainPage.totalPrice.innerHTML = +priceHTML + +price;

  let countHTML = +documentMainPage.totalCount.innerHTML;
  documentMainPage.totalCount.innerHTML = +countHTML + 1;

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

  if (isCookie === true) {
    document.cookie = `pizza=${cookieIDPizza},${id}; max-age=100000`;
  } else {
    document.cookie = `pizza=${id}; max-age=100000`;
  }
}
