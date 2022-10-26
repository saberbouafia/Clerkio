/* Set global site settings */

// detect if office open
(function () {
  var now = new Date();
  var day = now.getUTCDay();
  var hour = now.getUTCHours();

  if (day >= 1 && day <= 5 && hour >= 7 && hour < 15) {
    document.body.className += " office-open";
  } else {
    document.body.className += " office-closed";
  }
})();

// detect country/language
(function () {
  if (!window.navigator) return;
  if (!document.body.className) return;

  var languages = [];

  if (window.navigator.languages) {
    languages = window.navigator.languages;
  } else if (window.navigator.userLanguage || window.navigator.language) {
    languages = [window.navigator.userLanguage || window.navigator.language];
  }

  var language = null;
  var language_idents = ["da", "it", "uk"];

  for (var i = 0; i < languages.length; i++) {
    if (!languages[i]) continue;
    if (language) break;

    for (var j = 0; j < language_idents.length; j++) {
      if (languages[i].toLowerCase().indexOf(language_idents[j]) != -1) {
        language = language_idents[j];
        break;
      }
    }
  }

  if (language == null) language = "int";

  document.body.className += " lang-" + language;

  if (language == "da") {
    window.currency = "DKK";
  } else {
    window.currency = "USD";
  }
})();

/* Site tools */

/* Pricing */
(function () {
  window.changeCurrency = function (curr) {
    // set global currency
    window.currency = curr;

    // re-render pricing
    window.updatePricing();
  };

  window.updatePricing = function () {
    var currency = window.currency;
    var pricing = window.pricing;

    // load tiers
    var search = _getOptionValue(document.getElementById("search"));
    var recs = _getOptionValue(document.getElementById("recs"));
    var email = _getOptionValue(document.getElementById("email"));
    var audience = _getOptionValue(document.getElementById("audience"));

    var search_price = search > 0 ? pricing["search"][search][currency] : 0;
    var recs_price = recs > 0 ? pricing["recommendations"][recs][currency] : 0;
    var email_price = email > 0 ? pricing["email"][email][currency] : 0;
    var audience_price =
      audience > 0 ? pricing["audience"][audience][currency] : 0;

    var total = search_price + recs_price + email_price + audience_price;

    // update currency UI
    _updataCurrencyUI(window.currency);

    // update pricing UI
    _setPrice("search", search_price);
    _setPrice("recs", recs_price);
    _setPrice("email", email_price);
    _setPrice("audience", audience_price);

    _setPrice("search_unit", (search_price / search) * 1000);
    _setPrice("recs_unit", (recs_price / recs) * 1000);
    _setPrice("email_unit", (email_price / email) * 1000);
    _setPrice("audience_unit", (audience_price / audience) * 1000);

    _setPrice("total", total);
    _setPrice("roi", total * 12 * 10);

    // update benefit UI
    var total_dkk = 0;

    switch (window.currency) {
      case "EUR":
        total_dkk = total * 7.45;
        break;

      case "USD":
        total_dkk = total * 6.5;
        break;

      case "DKK":
        total_dkk = total;
        break;
    }

    _setBenefit("onboarding", total_dkk > 0);
    _setBenefit("setup", total_dkk > 1400);
    _setBenefit("roi", total_dkk > 5000);
  };

  function _getOptionValue(e) {
    return e.options[e.selectedIndex].value;
  }

  function _setPrice(product, price) {
    var e = document.getElementById("price_" + product);

    if (e) {
      e.innerHTML = _formatPrice(price);
    }
  }

  function _formatPrice(price) {
    if (price == 0 || isNaN(price)) {
      return "0";
    } else if (price < 1000) {
      return price.toFixed(2);
    } else {
      return price
        .toString()
        .split(".")[0]
        .split("")
        .reverse()
        .reduce(function (acc, num, i, orig) {
          return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, "");
    }
  }

  function _setBenefit(benefit, achieved) {
    var e = document.getElementById("benefit-" + benefit);

    if (e) {
      if (achieved) {
        setTimeout(function () {
          e.classList.add("achieved");
        }, 250);
      } else {
        e.classList.remove("achieved");
      }
    }
  }

  function _updataCurrencyUI(currency) {
    document.getElementById("currency-eur").classList.remove("selected");
    document.getElementById("currency-usd").classList.remove("selected");
    document.getElementById("currency-dkk").classList.remove("selected");

    var symbol = "";

    switch (currency) {
      case "EUR":
        document.getElementById("currency-eur").classList.add("selected");
        symbol = "&euro;";
        break;

      case "USD":
        document.getElementById("currency-usd").classList.add("selected");
        symbol = "$";
        break;

      case "DKK":
        document.getElementById("currency-dkk").classList.add("selected");
        symbol = "kr";
        break;
    }

    var currency_symbol_locations = document.getElementsByClassName("curr");
    for (var i = 0; i < currency_symbol_locations.length; i++) {
      currency_symbol_locations.item(i).innerHTML = symbol;
    }
  }

  window.pricing = {
    audience: {
      10000: { DKK: 749.0, EUR: 99.0, GBP: 99.0, USD: 119.0 },
      100000: { DKK: 3749.0, EUR: 499.0, GBP: 449.0, USD: 579.0 },
      1000000: { DKK: 8199.0, EUR: 1099.0, GBP: 999.0, USD: 1269.0 },
      10000000: { DKK: 23799.0, EUR: 3199.0, GBP: 2889.0, USD: 3660.0 },
      12500000: { DKK: 25549.0, EUR: 3399.0, GBP: 3089.0, USD: 4000.0 },
      150000: { DKK: 4449.0, EUR: 599.0, GBP: 539.0, USD: 689.0 },
      1500000: { DKK: 10739.0, EUR: 1439.0, GBP: 1299.0, USD: 1779.0 },
      15000000: { DKK: 30000.0, EUR: 4000.0, GBP: 3600.0, USD: 4600.0 },
      17500000: { DKK: 35000.0, EUR: 4800.0, GBP: 4200.0, USD: 5400.0 },
      200000: { DKK: 5199.0, EUR: 699.0, GBP: 629.0, USD: 799.0 },
      2000000: { DKK: 12932.0, EUR: 1749.0, GBP: 1549.0, USD: 1989.0 },
      20000000: { DKK: 40000.0, EUR: 5400.0, GBP: 4800.0, USD: 6150.0 },
      25000: { DKK: 1499.0, EUR: 199.0, GBP: 179.0, USD: 239.0 },
      250000: { DKK: 5949.0, EUR: 799.0, GBP: 719.0, USD: 919.0 },
      2500000: { DKK: 14927.0, EUR: 1999.0, GBP: 1799.0, USD: 2299.0 },
      25000000: { DKK: 50000.0, EUR: 6700.0, GBP: 6000.0, USD: 7700.0 },
      3000000: { DKK: 16799.0, EUR: 2299.0, GBP: 1999.0, USD: 2579.0 },
      30000000: { DKK: 60000.0, EUR: 8000.0, GBP: 7200.0, USD: 9250.0 },
      4000000: { DKK: 18549.0, EUR: 2499.0, GBP: 2249.0, USD: 2859.0 },
      40000000: { DKK: 80000.0, EUR: 10750.0, GBP: 9600.0, USD: 12350.0 },
      5000: { DKK: 599.0, EUR: 79.0, GBP: 79.0, USD: 99.0 },
      50000: { DKK: 2249.0, EUR: 299.0, GBP: 269.0, USD: 349.0 },
      500000: { DKK: 6699.0, EUR: 899.0, GBP: 799.0, USD: 1029.0 },
      5000000: { DKK: 20299.0, EUR: 2699.0, GBP: 2459.0, USD: 3119.0 },
      75000: { DKK: 2999.0, EUR: 399.0, GBP: 359.0, USD: 469.0 },
      750000: { DKK: 7449.0, EUR: 999.0, GBP: 899.0, USD: 1159.0 },
      7500000: { DKK: 22049.0, EUR: 2899.0, GBP: 2669.0, USD: 3399.0 },
    },
    email: {
      10000: { DKK: 749.0, EUR: 99.0, GBP: 99.0, USD: 119.0 },
      100000: { DKK: 3749.0, EUR: 499.0, GBP: 449.0, USD: 579.0 },
      1000000: { DKK: 8199.0, EUR: 1099.0, GBP: 999.0, USD: 1269.0 },
      10000000: { DKK: 23799.0, EUR: 3199.0, GBP: 2889.0, USD: 3660.0 },
      12500000: { DKK: 25549.0, EUR: 3399.0, GBP: 3089.0, USD: 4000.0 },
      150000: { DKK: 4449.0, EUR: 599.0, GBP: 539.0, USD: 689.0 },
      1500000: { DKK: 10739.0, EUR: 1439.0, GBP: 1299.0, USD: 1779.0 },
      15000000: { DKK: 30000.0, EUR: 4000.0, GBP: 3600.0, USD: 4600.0 },
      17500000: { DKK: 35000.0, EUR: 4800.0, GBP: 4200.0, USD: 5400.0 },
      200000: { DKK: 5199.0, EUR: 699.0, GBP: 629.0, USD: 799.0 },
      2000000: { DKK: 12932.0, EUR: 1749.0, GBP: 1549.0, USD: 1989.0 },
      20000000: { DKK: 40000.0, EUR: 5400.0, GBP: 4800.0, USD: 6150.0 },
      25000: { DKK: 1499.0, EUR: 199.0, GBP: 179.0, USD: 239.0 },
      250000: { DKK: 5949.0, EUR: 799.0, GBP: 719.0, USD: 919.0 },
      2500000: { DKK: 14927.0, EUR: 1999.0, GBP: 1799.0, USD: 2299.0 },
      25000000: { DKK: 50000.0, EUR: 6700.0, GBP: 6000.0, USD: 7700.0 },
      3000000: { DKK: 16799.0, EUR: 2299.0, GBP: 1999.0, USD: 2579.0 },
      30000000: { DKK: 60000.0, EUR: 8000.0, GBP: 7200.0, USD: 9250.0 },
      4000000: { DKK: 18549.0, EUR: 2499.0, GBP: 2249.0, USD: 2859.0 },
      40000000: { DKK: 80000.0, EUR: 10750.0, GBP: 9600.0, USD: 12350.0 },
      5000: { DKK: 599.0, EUR: 79.0, GBP: 79.0, USD: 99.0 },
      50000: { DKK: 2249.0, EUR: 299.0, GBP: 269.0, USD: 349.0 },
      500000: { DKK: 6699.0, EUR: 899.0, GBP: 799.0, USD: 1029.0 },
      5000000: { DKK: 20299.0, EUR: 2699.0, GBP: 2459.0, USD: 3119.0 },
      75000: { DKK: 2999.0, EUR: 399.0, GBP: 359.0, USD: 469.0 },
      750000: { DKK: 7449.0, EUR: 999.0, GBP: 899.0, USD: 1159.0 },
      7500000: { DKK: 22049.0, EUR: 2899.0, GBP: 2669.0, USD: 3399.0 },
    },
    recommendations: {
      100000: { DKK: 749.0, EUR: 99.0, GBP: 99.0, USD: 119.0 },
      1000000: { DKK: 4449.0, EUR: 599.0, GBP: 539.0, USD: 689.0 },
      10000000: { DKK: 13449.0, EUR: 1799.0, GBP: 1649.0, USD: 2069.0 },
      100000000: { DKK: 43449.0, EUR: 5799.0, GBP: 5194.0, USD: 6689.0 },
      12500000: { DKK: 14949.0, EUR: 1999.0, GBP: 1799.0, USD: 2299.0 },
      125000000: { DKK: 50000.0, EUR: 6749.0, GBP: 5994.0, USD: 7699.0 },
      1500000: { DKK: 5949.0, EUR: 799.0, GBP: 719.0, USD: 919.0 },
      15000000: { DKK: 16449.0, EUR: 2199.0, GBP: 1969.0, USD: 2529.0 },
      150000000: { DKK: 60000.0, EUR: 8049.0, GBP: 7169.0, USD: 9229.0 },
      17500000: { DKK: 17949.0, EUR: 2399.0, GBP: 2169.0, USD: 2759.0 },
      175000000: { DKK: 70000.0, EUR: 9399.0, GBP: 8419.0, USD: 10759.0 },
      2000000: { DKK: 7449.0, EUR: 999.0, GBP: 899.0, USD: 1149.0 },
      20000000: { DKK: 19449.0, EUR: 2699.0, GBP: 2324.0, USD: 2989.0 },
      200000000: { DKK: 80000.0, EUR: 10749.0, GBP: 9569.0, USD: 12339.0 },
      250000: { DKK: 1499.0, EUR: 199.0, GBP: 179.0, USD: 239.0 },
      2500000: { DKK: 8949.0, EUR: 1199.0, GBP: 1079.0, USD: 1379.0 },
      30000000: { DKK: 22449.0, EUR: 2999.0, GBP: 2684.0, USD: 3469.0 },
      40000000: { DKK: 25449.0, EUR: 3399.0, GBP: 3044.0, USD: 3919.0 },
      50000: { DKK: 599.0, EUR: 79.0, GBP: 79.0, USD: 99.0 },
      500000: { DKK: 2599.0, EUR: 349.0, GBP: 319.0, USD: 469.0 },
      5000000: { DKK: 10449.0, EUR: 1399.0, GBP: 1249.0, USD: 1609.0 },
      50000000: { DKK: 28449.0, EUR: 3799.0, GBP: 3434.0, USD: 4389.0 },
      60000000: { DKK: 31449.0, EUR: 4199.0, GBP: 3784.0, USD: 4844.0 },
      70000000: { DKK: 34449.0, EUR: 4699.0, GBP: 4134.0, USD: 5314.0 },
      750000: { DKK: 3749.0, EUR: 499.0, GBP: 449.0, USD: 579.0 },
      7500000: { DKK: 11949.0, EUR: 1599.0, GBP: 1449.0, USD: 1839.0 },
      80000000: { DKK: 37449.0, EUR: 4999.0, GBP: 4484.0, USD: 5764.0 },
      90000000: { DKK: 40449.0, EUR: 5399.0, GBP: 4834.0, USD: 6234.0 },
    },
    search: {
      10000: { DKK: 749.0, EUR: 99.0, GBP: 99.0, USD: 119.0 },
      100000: { DKK: 3749.0, EUR: 499.0, GBP: 449.0, USD: 579.0 },
      1000000: { DKK: 8199.0, EUR: 1099.0, GBP: 999.0, USD: 1269.0 },
      10000000: { DKK: 23799.0, EUR: 3199.0, GBP: 2889.0, USD: 3660.0 },
      12500000: { DKK: 25549.0, EUR: 3399.0, GBP: 3089.0, USD: 4000.0 },
      150000: { DKK: 4449.0, EUR: 599.0, GBP: 539.0, USD: 689.0 },
      1500000: { DKK: 10739.0, EUR: 1439.0, GBP: 1299.0, USD: 1779.0 },
      15000000: { DKK: 30000.0, EUR: 4000.0, GBP: 3600.0, USD: 4600.0 },
      17500000: { DKK: 35000.0, EUR: 4800.0, GBP: 4200.0, USD: 5400.0 },
      200000: { DKK: 5199.0, EUR: 699.0, GBP: 629.0, USD: 799.0 },
      2000000: { DKK: 12932.0, EUR: 1749.0, GBP: 1549.0, USD: 1989.0 },
      20000000: { DKK: 40000.0, EUR: 5400.0, GBP: 4800.0, USD: 6150.0 },
      25000: { DKK: 1499.0, EUR: 199.0, GBP: 179.0, USD: 239.0 },
      250000: { DKK: 5949.0, EUR: 799.0, GBP: 719.0, USD: 919.0 },
      2500000: { DKK: 14927.0, EUR: 1999.0, GBP: 1799.0, USD: 2299.0 },
      25000000: { DKK: 50000.0, EUR: 6700.0, GBP: 6000.0, USD: 7700.0 },
      3000000: { DKK: 16799.0, EUR: 2299.0, GBP: 1999.0, USD: 2579.0 },
      30000000: { DKK: 60000.0, EUR: 8000.0, GBP: 7200.0, USD: 9250.0 },
      4000000: { DKK: 18549.0, EUR: 2499.0, GBP: 2249.0, USD: 2859.0 },
      40000000: { DKK: 80000.0, EUR: 10750.0, GBP: 9600.0, USD: 12350.0 },
      5000: { DKK: 599.0, EUR: 79.0, GBP: 79.0, USD: 99.0 },
      50000: { DKK: 2249.0, EUR: 299.0, GBP: 269.0, USD: 349.0 },
      500000: { DKK: 6699.0, EUR: 899.0, GBP: 799.0, USD: 1029.0 },
      5000000: { DKK: 20299.0, EUR: 2699.0, GBP: 2459.0, USD: 3119.0 },
      75000: { DKK: 2999.0, EUR: 399.0, GBP: 359.0, USD: 469.0 },
      750000: { DKK: 7449.0, EUR: 999.0, GBP: 899.0, USD: 1159.0 },
      7500000: { DKK: 22049.0, EUR: 2899.0, GBP: 2669.0, USD: 3399.0 },
    },
  };
})();
