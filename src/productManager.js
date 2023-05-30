const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async updateProduct(id, content) {
    try {
      const products = await this.getProducts();
      const targetProduct = await this.getProductById(id);
      const productUpdated = { ...targetProduct, ...content };

      if (targetProduct) {
        const updatedList = products.map((obj) => {
          if (obj.id === productUpdated.id) {
            return productUpdated;
          } else {
            return obj;
          }
        });
        await fs.promises.writeFile(
          `./${this.path}`,
          JSON.stringify(updatedList)
        );
        return updatedList;
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async addProduct(product) {
    try {
      const data = await fs.promises.readFile(`./${this.path}`, "utf-8");
      const products = JSON.parse(data);
      let idNewProduct = 1;

      if (products.length >= 1) {
        let indexLastProduct = products.length - 1;
        let idLastProduct = products[indexLastProduct].id;
        idNewProduct = idLastProduct + 1;
      }

      const newProduct = { id: idNewProduct, ...product };
      products.push(newProduct);

      await fs.promises.writeFile(`./${this.path}`, JSON.stringify(products));
      return products;
    } catch (error) {
      console.log(error);
    }
  }


  async getProducts() {
    try {
      const data = await fs.promises.readFile(`./${this.path}`, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const data = await fs.promises.readFile(`./${this.path}`, "utf-8");
      const products = JSON.parse(data);
      const product = await products.find((product) => product.id === id);

      if (product) {
        return product;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(id) {
    try {
      const data = await fs.promises.readFile(`./${this.path}`, "utf-8");
      const products = JSON.parse(data);
      const newProducts = products.filter((product) => product.id !== id);
      await fs.promises.writeFile(
        `./${this.path}`,
        JSON.stringify(newProducts)
      );
      return newProducts;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAllProducts() {
    try {
      await fs.promises.writeFile(`./${this.path}`, []);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductManager;
