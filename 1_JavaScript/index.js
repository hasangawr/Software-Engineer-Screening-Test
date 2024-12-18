// 1.1.
// Extend JS Date object with a method daysTo() which returns number of complete days between any pair of JS date objects:
// d1.daysTo(d2) should return quantity of complete days from d1 to d2.

Date.prototype.daysTo = function (date) {
  if (!(date instanceof Date)) {
    throw new TypeError("Argument must be an instance of Date");
  }

  const completeDays = Math.floor(
    (date.getTime() - this.getTime()) / (1000 * 60 * 60 * 24)
  );

  return completeDays;
};

const d1 = new Date("1995-12-17T03:24:00");
const d2 = new Date("2024-12-17T03:24:00");

const numOfCompleteDays = d1.daysTo(d2);

console.log("Number of complete days: ", numOfCompleteDays);

// 1.2.
// Please order by Total
// Develop a program which produces ordered array of sales.
// Input: array of objects with the following structure {amount: 10000, quantity: 10}.
// Output: new array of ordered sales. Array element structure should be: {amount: 10000, quantity: 10, Total: 100000},
// where Total = amount * quantity. Please order by Total and note that input array shall remain intact.

const getOrderedArrayOfSales = (salesArray) => {
  const totalsCalculated = salesArray.map((sale) => {
    return { ...sale, total: sale.amount * sale.quantity };
  });

  return totalsCalculated.sort((a, b) => a.total - b.total);
};

const sales = [
  { amount: 10000, quantity: 10 },
  { amount: 5000, quantity: 15 },
  { amount: 20000, quantity: 5 },
];

const orderedSales = getOrderedArrayOfSales(sales);

console.log("ordered sales: ", orderedSales);
console.log("sales: ", sales);

// 1.3.
// Develop a program “Object Projection”. Input: any JSON object; prototype object.
// Output: projected object. Projected object structure shall be intersection of source object and prototype object structures.
// Values of properties in projected object shall be the same as values of respective properties in source object.

const src = {
  prop11: {
    prop21: 21,
    prop22: {
      prop31: 31,
      prop32: 32,
    },
  },
  prop12: 12,
};

const proto = {
  prop11: {
    prop22: null,
  },
};

const objectProjection = (sourceObject, prototypeObject) => {
  if (prototypeObject === null || typeof sourceObject !== "object") {
    return sourceObject;
  }

  const protoKeys = Object.keys(prototypeObject);

  const projectObj = {};

  protoKeys.forEach((protoKey) => {
    if (Object.hasOwn(sourceObject, protoKey)) {
      projectObj[protoKey] = objectProjection(
        sourceObject[protoKey],
        prototypeObject[protoKey]
      );
    }
  });

  return projectObj;
};

console.log("projected object: ", objectProjection(src, proto));
