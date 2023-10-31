function recebeString(texto) {
  const regex = /((?:R\$|\$)?[^\n]+)\n([^$]+)/g;
  let match;
  let products = []; // Store products and prices here

  while ((match = regex.exec(texto)) !== null) {
    let price = match[1].trim();
    let product = match[2].replace(/\n/g, ' ');

    // Check if the price already contains "R$" or "$". If not, add "R$". If it contains only "$", replace it with "R$".
    if (!price.includes("R$") && !price.includes("$")) {
      price = "R$" + price;
    } else if (price.includes("$")) {
      price = price.replace("$", "R$");
    }

    // Remove trailing " R" from the price.
    if (price.endsWith(" R")) {
      price = price.slice(0, -2);
    } else if (price.endsWith("R")) {
      price = price.slice(0, -1);
    }

    // Remove trailing " R" from the product.
    if (product.endsWith(" R")) {
      product = product.slice(0, -2);
    } else if (product.endsWith("R")) {
      product = product.slice(0, -1);
    }

    // Add checks to ignore unwanted texts and empty products.
    if (!product.includes("TODO DIA DIA DE PREMIO tricard") && !product.includes("R$500 todo dia e 1 moto todo mês.") && product.trim() !== "") {
      products.push(`Produto: ${product}, Preço: ${price}`);
    }
  }

  // Retorne o array de strings
  return products;
}

module.exports = recebeString;