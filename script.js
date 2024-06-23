let rates;
const fetchExchangeRates = async () => {
  const url = `https://v6.exchangerate-api.com/v6/ad69d1d5b7a5216e43f9a6fd/latest/USD`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    rates = data.conversion_rates;
    populateSelectors();
  } catch (error) {
    console.error("Fetch error: ", error);
  }
};

const toSelector = document.querySelector(".to__selector");
const fromSelector = document.querySelector(".from__selector");
const resultText = document.querySelector(".exchange__result");
const amount = document.querySelector(".amount__input");
const countryFrom = document.querySelector(".from__flag");
const countryTo = document.querySelector(".to__flag");
const switchBtn = document.querySelector(".switch__btn");

const updateResult = () => {
  //calculate the currency rate
  const rate =
    (rates[toSelector.value] / rates[fromSelector.value]) * amount.value;

  //update the result
  resultText.textContent = `${Number(amount.value)} ${
    fromSelector.value
  } = ${rate.toFixed(2)} ${toSelector.value}`;
};

const populateSelectors = () => {
  for (const currency in rates) {
    const html = `<option value="${currency}">${currency}</option>`;
    toSelector.insertAdjacentHTML("beforeend", html);
    fromSelector.insertAdjacentHTML("beforeend", html);
  }

  // Make default value for selector
  toSelector.value = "EGP";
  // update the Currency Exchange Result
  updateResult();
};
fetchExchangeRates();
const handleSelectChange = (event) => {
  if (toSelector && fromSelector) {
    updateResult();

    countryFrom.src = `https://flagcdn.com/16x12/${fromSelector.value
      .toLowerCase()
      .slice(0, -1)}.png`;

    countryTo.src = `https://flagcdn.com/16x12/${toSelector.value
      .toLowerCase()
      .slice(0, -1)}.png`;
  }
};

const switchHandler = () => {
  const temp = fromSelector.value;
  fromSelector.value = toSelector.value;
  toSelector.value = temp;
  handleSelectChange();
};

toSelector.addEventListener("change", handleSelectChange);
fromSelector.addEventListener("change", handleSelectChange);
amount.addEventListener("change", updateResult);
switchBtn.addEventListener("click", switchHandler);
