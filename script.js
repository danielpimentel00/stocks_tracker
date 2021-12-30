const apiKey = "4f21f23c9b7c4535bc0cb685f9f93d68";
const interval = "15min";
const maxRequestNum = 2;

const item_list = document.getElementById("item_list");
const refresh_btn = document.getElementById("refresh-btn");

async function getData() {
  try {
    const data = [];

    //Criptocurrencies
    const results = await (
      await fetch(
        `https://api.twelvedata.com/cryptocurrencies?apikey=${apiKey}`
      )
    ).json();

    //Base request
    let request = `https://api.twelvedata.com/time_series?interval=${interval}&outputsize=1&apikey=${apiKey}&symbol=`;

    //Appends symbols for a batch request
    for (let i = 0; i < maxRequestNum; i++) {
      const rand = Math.floor(Math.random() * results.data.length);

      const symbol = results.data[rand].symbol;

      request += `${symbol}`;

      if (i !== maxRequestNum - 1) request += ",";
    }

    //Batch request
    const content = await (await fetch(request)).json();

    data.push(content);

    const cryptos = Object.keys(data[0]);

    //Clear results
    item_list.innerHTML = "";

    cryptos.forEach((crypto) => {
      const li = document.createElement("li");

      const currency_base = data[0][crypto].meta.currency_base;
      const currency_quote = data[0][crypto].meta.currency_quote;
      const symbol = data[0][crypto].meta.symbol;
      const open_price = data[0][crypto].values[0].open;
      const close_price = data[0][crypto].values[0].close;

      if (open_price == 0 && close_price == 0) {
        li.innerHTML = `
      <h4 class="base">Currency base: ${currency_base}</h4>
      <h5 class="quote">Currency quote: ${currency_quote}</h5>
      <h5 class="symbol">Symbol: ${symbol}</h5>
      <small class="price open-price">Open: ${open_price}</small>
      <small class="price close-price">Close: ${close_price}</small>
      <small class="price price-increase">Increase: 0%</small>
    `;
      } else if (close_price >= open_price) {
        li.innerHTML = `
      <h4 class="base">Currency base: ${currency_base}</h4>
      <h5 class="quote">Currency quote: ${currency_quote}</h5>
      <h5 class="symbol">Symbol: ${symbol}</h5>
      <small class="price open-price">Open: ${open_price}</small>
      <small class="price close-price">Close: ${close_price}</small>
      <small class="price price-increase">Increase: ${(
        ((close_price - open_price) / open_price) *
        100
      ).toFixed(2)}%</small>
    `;
      } else {
        li.innerHTML = `
      <h4 class="base">Currency base: ${currency_base}</h4>
      <h5 class="quote">Currency quote: ${currency_quote}</h5>
      <h5 class="symbol">Symbol: ${symbol}</h5>
      <small class="price open-price">Open: ${open_price}</small>
      <small class="price close-price">Close: ${close_price}</small>
      <small class="price price-decrease">Decrease: ${Math.abs(
        ((close_price - open_price) / open_price) * 100
      ).toFixed(2)}%</small>
    `;
      }

      item_list.appendChild(li);
    });

    console.log(results);
  } catch (error) {
    console.error(error);

    //Clear results
    item_list.innerHTML = "";

    const li = document.createElement("li");

    li.innerHTML = `
      <h4 class="message">Try again later</h4>
    `;

    item_list.appendChild(li);
  }
}

function handleRefresh() {
  window.location.reload();
}

refresh_btn.addEventListener("click", handleRefresh);

getData();
