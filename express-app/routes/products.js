var express = require("express");
var router = express.Router();

var { write } = require("../helpers/fileHelper");
const products = require("../data/products.json");
const fileName = "./data/products.json";

/* GET */
router.get("/", function (req, res, next) {
  res.send(products);
});

router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  const found = products.find((p) => {
    return p.id == id;
  });

  if (!found) {
    return res.status(404).json({ message: "product is not found" });
  }
  console.log("id = ", id);
  res.send(found);
});

// GET nhiều Param
router.get("/:id/:name/:description", function (req, res, next) {
  // const { id, name, description } = req.params;
  //  const id = req.params.id;
  //  const name = req.params.name;
  //  const description = req.params.description;
  res.send("OK");
});

/* POST */
router.post("/", function (req, res, next) {
  const data = req.body;
  console.log("Data =", data);
  products.push(data);
  //Lưu file
  write(fileName, products);

  res.status(201).json({ message: "creat product is successful" });
});

/* PATCH */
router.patch("/:id", function (req, res, next) {
  const { id } = req.params;
  const data = req.body;
  // Tìm data để sửa
  let found = products.find((p) => {
    return p.id == id;
  });

  if (found) {
    // Cập nhật data gì?
    for (let x in found) {
      if (data[x]) {
        found[x] = data[x];
      }
    }
    // Lưu file
    write(fileName, products);

    return res.status(200).json({ message: "Update product is susscessful!" });
  }
  return res.sendStatus(404).json({ message: "product is not found" });
});

/* DELETE */
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  const found = products.find((p) => {
    return p.id == id;
  });

  if (!found) {
    return res.status(404).json({ message: "product is not found" });
  }

  let remainProducts = products.filter((p) => {
    return p.id != id;
  });

  // Lưu file
  write(fileName, remainProducts);

  res.sendStatus(200);
});

module.exports = router;
