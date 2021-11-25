addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */

const options = {
  include: {
    numbers: true,
    upper: false,
    lower: true,
    special: false,
  },
  digits: 6,
};
const ld = {
  numbers: 3,
  upper: 2,
  lower: 1.5,
  special: 2.5,
};
const lists = {
  numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  upper: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  lower: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  special: ["!", "#", "$", "%", "@", "*", "?"],
};

function grand(list) {
  const o = Math.floor(Math.random() * list.length);
  return list[o];
}

function generate() {
  const amount = {
    numbers: 0,
    upper: 0,
    lower: 0,
    special: 0,
  };
  let digits = options.digits;
  for (i in options.include) {
    if (options.include[i]) {
      amount[i] = 1;
      digits--;
    }
  }
  for (i in options.include) {
    if (digits < 0) {
      break;
    } else if (options.include[i]) {
      amount[i] += Math.floor((Math.random() * digits) / ld[i]);
      digits -= amount[i] - 1;
    }
  }
  for (i in options.include) {
    if (options.include[i]) {
      amount[i] += digits;
      break;
    }
  }
  const olist = ["numbers", "upper", "lower", "special"];
  let output = "";
  let r = 4;
  for (let digits = options.digits; digits > 0; digits--) {
    const o = olist[Math.floor(Math.random() * r)];
    if (amount[o] > 0) {
      output += grand(lists[o]);
      amount[o]--;
    } else {
      olist.splice(olist.indexOf(o), 1);
      r--;
      digits++;
    }
  }
  return output;
}
async function handleRequest(request) {
  const response = new Response(generate());
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
