import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Message, SelectItem } from 'primeng/api';
import { ProductService } from '../product.service';
import {ConfirmationService} from 'primeng/api';
import { ActivatedRoute } from '@angular/router'
import { Product } from '../product';
import { DatePipe } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

//enum de unidade de medida
export enum Option {
  LT = "LT",
  KG = "KG",
  UN = "UN"
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [DatePipe]
})

export class RegisterComponent implements OnInit {

  //valores usados em tela
  public unidadeMedidaUtilizada: string = "";
  public listUnidadeMedida: SelectItem[];  
  public perecivel: boolean = false;
  public produtoVencido: boolean = false;
  public dataFabricacaoInvalida: boolean = false;
  public pt: any;
  public msgs: Message[] = [];
  public form: FormGroup;
  //regex para bloquear tudo exceto letras e espaços
  public blockSpecialLE: RegExp = /[a-zA-ZàáâãäèéêëìíîïòóôõöùúûüçÇ\s]/;
  //regex para bloquear tudo exceto números e virgulas
  public blockSpecialNV: RegExp = /[0-9,]/;

  //atributos utilizados somente no controller
  private mDataValidade: Date = null;
  private mPreco: string = "";
  private mQuantidade: string = "";

  private productId$: Object;
  private product: Product;

  constructor(private fb: FormBuilder
    , private productService: ProductService
    , private confirmationService: ConfirmationService
    , public router: Router
    , private activatedRoute: ActivatedRoute
    , private datePipe: DatePipe) {
    
    //pega o id recebido da rota
    this.activatedRoute.params.subscribe(
      params => this.productId$ = params.id
    );
    
    //inicializa o form indicando os campos obrigatórios
    this.form = this.fb.group({
      'nome': new FormControl('', Validators.required),
      'unidade_medida': new FormControl('', Validators.required),
      'quantidade': new FormControl(''),
      'preco': new FormControl('', Validators.required),
      'perecivel': new FormControl(''),
      'data_validade': new FormControl(''),
      'data_fabricacao': new FormControl('', Validators.required)
    });
    
    //inicializa o "dropdown" de "unidade_medida"
    this.listUnidadeMedida = [
      {label:'Selecione...', value:null},
      {label:'Litro', value:Option.LT},
      {label:'Quilograma', value:Option.KG},
      {label:'Unidade', value:Option.UN},
    ];

    //atributos de idioma para os campos "p-calendar"
    this.pt = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"],
      monthNames: [ "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro" ],
      monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
      today: 'Hoje',
      clear: 'Limpar'
    };
    
  }

  ngOnInit() {

    //se a tela foi chamada para alteração, atribui os devidos valores aos campos
    this.product = this.productService.getProduct(this.productId$);
    let productTemp = this.productService.getProductTemp();

    try {
      //se cadastro pela metade a ser resgatado, sendo um produto já salvo ou não,
      //retoma-se o estado anterior da tela
      if(productTemp != null){
          
        if(productTemp.id != 0){
          this.product = productTemp;
        }

        this.form.get("nome").setValue(productTemp.nome);
        this.form.get("unidade_medida").setValue(productTemp.unidade_medida);
        this.unidadeMedidaUtilizada = productTemp.unidade_medida;
        this.form.get("quantidade").setValue(productTemp.quantidade);
        this.mQuantidade = productTemp.quantidade.toString();
        this.form.get("preco").setValue(productTemp.preco);
        this.mPreco = productTemp.preco.toString();
        this.perecivel = productTemp.perecivel;
        this.form.get("perecivel").setValue(productTemp.perecivel);

        //para evitar data NaN
        if(new Date(productTemp.data_validade).toString() != "Invalid Date"){
          this.form.get("data_validade").setValue(new Date(productTemp.data_validade));
          this.mDataValidade = productTemp.data_validade;
        }
        if(new Date(productTemp.data_fabricacao).toString() != "Invalid Date"){
          this.form.get("data_fabricacao").setValue(new Date(productTemp.data_fabricacao));
        }

        this.productService.removeProductTemp();

        //validações necessárias
        this.onSelectDataFabricacao();

      } else if(this.product != null){//edição de produto
        this.form.get("nome").setValue(this.product.nome);
        this.form.get("unidade_medida").setValue(this.product.unidade_medida);
        this.unidadeMedidaUtilizada = this.product.unidade_medida;
        this.form.get("quantidade").setValue(this.product.quantidade);
        this.mQuantidade = this.product.quantidade.toString();
        this.form.get("preco").setValue(this.product.preco);
        this.mPreco = this.product.preco.toString();
        this.perecivel = this.product.perecivel;
        this.form.get("perecivel").setValue(this.product.perecivel);

        //somente a data de fabricação é o brigatória, por isso neste caso só validamos
        //a data de validade
        if(new Date(this.product.data_validade).toString() != "Invalid Date"){
          this.form.get("data_validade").setValue(new Date(this.product.data_validade));
          this.mDataValidade = this.product.data_validade;
        }
        
        this.form.get("data_fabricacao").setValue(new Date(this.product.data_fabricacao));

        //validações necessárias
        this.onSelectDataValidade();
      }
    } catch (error) {
      this.msgs.push({severity:"error", summary:"Erro:", detail:"Não foi possível carregar a tela."});
      console.log(error);
    }
    
  }

  //metodo chamado ao alterar o dropdown "unidade_medida"
  onChangeUnidade(value){
    if(value != null){
      this.unidadeMedidaUtilizada = value.toString();
    } else {
      this.unidadeMedidaUtilizada = "";
    }
    
    //ao alterar o campo "unidade_medida", é zerado o valor do campo "quantidade"
    this.mQuantidade = "";
    this.form.get("quantidade").setValue("");
  }
  
  //validação do campo "quantidade"
  onChangeQuantidade() {
    let value = this.form.get("quantidade").value.toString();

    //validação dos valores inseridos no campo "quantidade",
    //quando a unidade de medida for LT, KG ou UN
    if(this.unidadeMedidaUtilizada == Option.LT || this.unidadeMedidaUtilizada == Option.KG){
      if (value.indexOf(",") != -1) { 
        let [int, dec, invalid] = value.split(",");
        if(int == "" || invalid != null || dec.length > 3){
          value = this.mQuantidade;
          this.form.get("quantidade").setValue(this.mQuantidade);
        }
      }
    } else if (this.unidadeMedidaUtilizada == Option.UN) {
      if (value.indexOf(",") != -1) {
        value = value.match(/\d+/);
        this.form.get("quantidade").setValue(value);
      }     
    }

    this.mQuantidade = value;
  }

  //efetua a mascara do campo preco
  precoMask(e) {

    let value = this.form.get("preco").value.toString();
    let tempValue = "";

    //acionado ao limpar o campo, limpa virgula desnecessária
    if(e.key == "Backspace"){
      if (value.length == 3) {
        if (value.indexOf(",") != -1) {
          this.form.get("preco").setValue(value.replace(",", ""));
          return;   
        }
      }
    }

    //acionado ao tentar inserir virgula antes que seja inserida automaticamente, limpa virgula desnecessária
    if (value.length <= 3) {
      if (value.indexOf(",") != -1) {
        this.form.get("preco").setValue(this.mPreco);
        return;   
      }
    }

    //trata valore de tamanho maior que 2, que foi o número máximo de casas decimais permitidas
    if (value.length > 2) {
      if (value.indexOf(",") != -1) {
        let [_, dec, invalid] = value.split(",");
        if(invalid != null){//retira vírgulas em excesso
          this.form.get("preco").setValue(this.mPreco);
          return;
        } if(dec.length == 2){//indica que o valor já está correto
          return;
        }
        value = value.replace(",", "");
      }

      //coloca a vírgula no devido lugar
      for(let i = 0; i < value.length; i++){
        if(i == value.length - 2){
          tempValue = tempValue.concat(",").concat(value[i]);
        } else {
          tempValue = tempValue.concat(value[i]);
        }
      }

      this.mPreco = tempValue;
      this.form.get("preco").setValue(tempValue);
      
    } else {
      this.mPreco = value;
    }

  }
  
  //metodo chamado ao alterar o campo "perecivel"
  onChangePerecivel(e) {
    this.perecivel = e.checked;
    //se o campo "perecivel" estiver checado, torna o campo "data_validade" obrigatório
    if(this.perecivel){
      this.form.get("data_validade").setValidators(Validators.required);
      this.form.get("data_validade").updateValueAndValidity({emitEvent:false, onlySelf:true});
    } else {
      this.form.get("data_validade").clearValidators();
      this.form.get("data_validade").updateValueAndValidity({emitEvent:false, onlySelf:true});
    }
    this.onSelectDataFabricacao();
  }

  //metodo chamado ao alterar o campo "data_validade"
  onSelectDataValidade(){
    let today = new Date();
    this.mDataValidade = this.form.get("data_validade").value;
    //verifica se o produto está vencido
    if(this.mDataValidade <= today){
      this.produtoVencido = true;
    } else {
      this.produtoVencido = false;
    }
    this.onSelectDataFabricacao();
  }

  //metodo chamado ao alterar o campo "data_fabricacao"
  onSelectDataFabricacao(){
    let dataFab = this.form.get("data_fabricacao").value;
    //verifica se a data de fabricação é superior a data de validade
    if(this.mDataValidade != null && this.perecivel && dataFab > this.mDataValidade){
      this.dataFabricacaoInvalida = true;
      this.form.get("data_fabricacao").setValue("");
    } else {
      this.dataFabricacaoInvalida = false;
    }
  }

  //metodo acionado ao clicar no botão de envio
  public onSubmit(value: string) {
    try {
      this.saveProduct();    
      this.msgs.push({severity:"success", summary:"Sucesso:", detail:"Cadastro Salvo."});
    } catch (error) {
      this.msgs.push({severity:"error", summary:"Erro:", detail:"Não foi possivel salvar o cadastro."});
      console.log(error);
    }
  }

  //adiciona um novo produto para o LocalStorage
  private saveProduct(): void {
    if(this.product != null){
      this.product = this.productService.changeProduct(this.product.id
        , this.form.get('nome').value
        , this.form.get('unidade_medida').value
        , this.form.get('quantidade').value
        , this.form.get('preco').value
        , this.form.get('perecivel').value
        , this.form.get('data_validade').value
        , this.form.get('data_fabricacao').value
        , this.datePipe.transform(this.form.get("data_validade").value, 'dd/MM/yyyy')
        , this.datePipe.transform(this.form.get("data_fabricacao").value, 'dd/MM/yyyy')
      );
    } else {
      this.product = this.productService.addProduct(this.form.get('nome').value
        , this.form.get('unidade_medida').value
        , this.form.get('quantidade').value
        , this.form.get('preco').value
        , this.form.get('perecivel').value
        , this.form.get('data_validade').value
        , this.form.get('data_fabricacao').value
        , this.datePipe.transform(this.form.get("data_validade").value, 'dd/MM/yyyy')
        , this.datePipe.transform(this.form.get("data_fabricacao").value, 'dd/MM/yyyy')
      );
    }
  }

  //metodo acionado ao clicar no botão cancelar
  public cancel() {
    this.confirmationService.confirm({
      message: "Deseja realmente cancelar?",
      accept: () => {
        this.router.navigate(['list']);
      },
      acceptLabel: "Sim",
      rejectLabel: "Não"        
    });
  }

  //acionado ao atualizar a página, salva as informações da tela para evitar trabalho
  @HostListener('window:beforeunload')
  doRefresh(e){    
    if(this.product != null){
      this.productService.addProductStatusTemp(this.product.id
        , this.form.get('nome').value
        , this.form.get('unidade_medida').value
        , this.form.get('quantidade').value
        , this.form.get('preco').value
        , this.form.get('perecivel').value
        , this.form.get('data_validade').value
        , this.form.get('data_fabricacao').value
        , this.datePipe.transform(this.form.get("data_validade").value, 'dd/MM/yyyy')
        , this.datePipe.transform(this.form.get("data_fabricacao").value, 'dd/MM/yyyy')
      );
    } else {
      this.productService.addProductTemp(this.form.get('nome').value
        , this.form.get('unidade_medida').value
        , this.form.get('quantidade').value
        , this.form.get('preco').value
        , this.form.get('perecivel').value
        , this.form.get('data_validade').value
        , this.form.get('data_fabricacao').value
        , this.datePipe.transform(this.form.get("data_validade").value, 'dd/MM/yyyy')
        , this.datePipe.transform(this.form.get("data_fabricacao").value, 'dd/MM/yyyy')
      );
    }
  }

  //acionado ao voltar a página
  @HostListener('window:popstate', ['$event'])
  onBack(e) {
    //history.go(1);//não permite voltar a página
  }

}
