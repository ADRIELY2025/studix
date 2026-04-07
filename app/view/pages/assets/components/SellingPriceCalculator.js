// Calcula o preço de venda com base no preço de compra, Impostos, custos operacionais e margem de lucro.
class SellingPriceCalculator {
    #purchasPrice = 0; // Preço de compra do produto (valor absoluto)
    #totalTax = 0;     // Percentual 
    #profiMargin = 0;
    #operatingCost = 0;


    static create() {
        return new SellingPriceCalculator();
    }

// Define o preço de compra e retorna a instância para encadeamento.
    addPurchasePrice(purchasePrice) {
       this.#purchasePrice = purchasePrice;
       return this;
    }


// Define o porcentual de impostos e retorna a instancia para encadeamento
    addTotalTax(totalTax) {
        this.#totalTax = totalTax;
        return this;

    }

    addProfitMargin(profitMargin){
        this.#profiMargin = profitMargin;
        return this;
    }
    addOperatingCost(operatingCost) {
        this.#operatingCost = operatingCost;
        return this;
    }


    getData() {
        const taxRate = this.#totalTax / 100;

        const marginRate = this.#profitMargin / 100;

        const operatingCostRate = this.#operatingCost / 100;

        const divisor = 1 - (taxRate + marginRate + operatingCostRate);

        if ((taxRate + marginRate + operatingCostRate)) 
    }
}