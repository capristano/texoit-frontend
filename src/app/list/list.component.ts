import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { Router, NavigationEnd } from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public products: Product[];
  public thereIsProduct: boolean = false;
  public msgs: Message[] = [];

  constructor(private productService: ProductService
    , private router: Router
    , private confirmationService: ConfirmationService) { }

  ngOnInit() {
    //inicializa a lista de produtos
    this.products = this.productService.getProducts();
    //verifica se a lista de produtos está vazia
    if(this.products.length > 0) {
      this.thereIsProduct = true;
    } else {
      this.thereIsProduct = false;
    }
  }

  //método chamado pelo botão de adicionar
  add(){
    this.router.navigate(['register']);
  }

  //método chamado pelo botão de alterar
  change(id){
    this.router.navigate(['register/'+id]);
  }

  //método chamado pelo botão de deletar
  delete(id){
    //verifica se o usuário deseja realmente excluir o registro
    this.confirmationService.confirm({
      message: "Deseja realmente excluir?",
      accept: () => {
        try {
          //remove o produto e atualiza a lista dos mesmo   
          this.products = this.productService.removeProduct(id);
          if(this.products.length > 0) {
            this.thereIsProduct = true;
          } else {
            this.thereIsProduct = false;
          }
          this.msgs.push({severity:"success", summary:"Sucesso:", detail:"Cadastro excluído."});          
        } catch (error) {
          this.msgs.push({severity:"error", summary:"Erro:", detail:"Não foi possível excluir o registro."});
          console.log(error);
        }
      },
      acceptLabel: "Sim",
      rejectLabel: "Não"        
    });
  }

}

