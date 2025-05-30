const paymentModel = require("../models/payment/payment.model");

module.exports.createTransId = async () => {
  let product = "scf";
  const date = new Date();
  const CurrentDateString =
    date.getFullYear() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");

  const lastTransDetail = await paymentModel
    .find({
      transId: { $exists: true },
      transId: { $regex: product },
    })
    .sort({ $natural: -1 })
    .limit(1);
  if (lastTransDetail.length !== 0) {
    const LastTransId = lastTransDetail[0].transId;
    if (LastTransId.slice(0, 8) === CurrentDateString) {
      const GetCount = LastTransId.slice(
        8 + product.length,
        LastTransId.length
      );
      const num = Number(GetCount);
      const add = (count) => {
        count += 1;
        return count.toString().padStart(2, "0");
      };
      return (transLastId =
        LastTransId.slice(0, 8 + product.length) + add(num));
    } else {
      return (transLastId = `${CurrentDateString}${product}0${1}`);
    }
  } else {
    return (transLastId = `${CurrentDateString}${product}0${1}`);
  }
};
