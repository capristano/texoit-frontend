import { Injectable } from '@angular/core';
import { Product } from './product'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private nextId: number;

  constructor() {
    let products = this.getProducts();
    
    //define o número do próximo id
    if(products.length == 0){
      this.nextId = 1;
    } else {
      let maxId = products[products.length -1].id;
      this.nextId = maxId + 1;
    }

  }

  //adiciona um produto
  public addProduct(nome: string
    , unidade_medida: string
    , quantidade: number
    , preco: number
    , perecivel: boolean
    , data_validade: Date
    , data_fabricacao: Date
    , data_validade_frt: string
    , data_fabricacao_frt): Product {
      
    let product = new Product(this.nextId, nome, unidade_medida, quantidade, preco, perecivel, data_validade, data_fabricacao, data_validade_frt, data_fabricacao_frt);
    let products = this.getProducts();
    products.push(product);

    this.setLocalStorageProducts(products);
    this.nextId++;

    return product;
  }

  //altera um produto
  public changeProduct(id: number
    , nome: string
    , unidade_medida: string
    , quantidade: number
    , preco: number
    , perecivel: boolean
    , data_validade: Date
    , data_fabricacao: Date
    , data_validade_frt: string
    , data_fabricacao_frt): Product {
    
    let product = new Product(id, nome, unidade_medida, quantidade, preco, perecivel, data_validade, data_fabricacao, data_validade_frt, data_fabricacao_frt);
    let products = this.getProducts();
    products = products.filter((product)=> product.id != id);
    products.push(product);
    this.setLocalStorageProducts(products);

    return product;
  }

  //retorna a lista com todos os produtos
  public getProducts(): Product[] {
    let localStorageItem = JSON.parse(localStorage.getItem('products'));
    return localStorageItem == null ? [] : localStorageItem.products;
  }

  //retorno produto por id
  public getProduct(id): Product {        
    let products = this.getProducts();
    products = products.filter((product)=> product.id == id);
    return products[0];
  }

  //remove produto por id
  public removeProduct(id: number): Product[] {
    let products = this.getProducts();
    products = products.filter((product)=> product.id != id);
    this.setLocalStorageProducts(products);
    return products;
  }

  //substitui a lista de produtos no local storage
  private setLocalStorageProducts(products: Product[]): void{
    localStorage.setItem('products', JSON.stringify({products: products}));
  }

  //adiciona produto temporário
  public addProductTemp(nome: string
    , unidade_medida: string
    , quantidade: number
    , preco: number
    , perecivel: boolean
    , data_validade: Date
    , data_fabricacao: Date
    , data_validade_frt: string
    , data_fabricacao_frt): void {
      
    let product_temp = new Product(0, nome, unidade_medida, quantidade, preco, perecivel, data_validade, data_fabricacao, data_validade_frt, data_fabricacao_frt);
    localStorage.setItem('product_temp', JSON.stringify({product_temp: product_temp}));
  }

  //adiciona state de produto já existente
  public addProductStatusTemp(id: number
    , nome: string
    , unidade_medida: string
    , quantidade: number
    , preco: number
    , perecivel: boolean
    , data_validade: Date
    , data_fabricacao: Date
    , data_validade_frt: string
    , data_fabricacao_frt): void {
      
    let product_temp = new Product(id, nome, unidade_medida, quantidade, preco, perecivel, data_validade, data_fabricacao, data_validade_frt, data_fabricacao_frt);
    localStorage.setItem('product_temp', JSON.stringify({product_temp: product_temp}));
  }

  //retorna produto temporário
  public getProductTemp(): Product {     
    let localStorageItem = JSON.parse(localStorage.getItem('product_temp'));
    return localStorageItem == null ? null : localStorageItem.product_temp;
  }

  //remove produto temporário
  public removeProductTemp(): void {
    localStorage.removeItem('product_temp');
  }

}