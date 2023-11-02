var fc = $.gstfrm_agenda = { version: "1.0.0" };
(function( $ ){
    $.fn.gstfrm_agenda = function() {
        return true;
    };
})( jQuery );

// Variáveis Públicas
var pub_caminho = "";
var pub_caminhoupload = "";
var pub_login = "";
var pub_passw = "";
var pub_tecnico = "";
var pub_tptecnico = "";
var pub_tecnnm = "";
var pub_name = "";
var pub_email = "";
var pub_eadm = false;
var pub_ecranini = "";
var pub_nomeapp = "";
var pub_FileUpload = "";
var pub_EmpFlt = "";
var pub_logo = "";
var pub_altlogo = "";	
var podealterar = false;
var corFeriados = "coral";
var m_chinis = "WWW";
var encontro = false;


var jsonTema =[{"val":"1","valor":"default","descricao":"Normal"},{"val":"2","valor":"classic","descricao":"Cor"},{"val":"3","valor":"dark","descricao":"Escuro"}
	,{"val":"4","valor":"4","descricao":"Aqua"},{"val":"5","valor":"5","descricao":"Glaciar"},{"val":"6","valor":"6","descricao":"Anil"}
	,{"val":"7","valor":"7","descricao":"Coral"},{"val":"8","valor":"8","descricao":"Prado"},{"val":"9","valor":"9","descricao":"Branco"}];
var jsonTecnico = [];
var jsonFref = [];
var jsonClientes = [];
var jsonProjetos = [];
var jsonTarefas = [];

function validou_cl(json){
	for(var i in json.TbPhc){ 
        if(json.TbPhc[i].nome!=="!#NA#!SEMDADOS"){			
			jsonClientes.push({
                no: json.TbPhc[i].no,
                nome: json.TbPhc[i].nome,
                estab: json.TbPhc[i].estab,
                nome2: json.TbPhc[i].nome2,
              	vazio:'',
                value: json.TbPhc[i].nome+"."+json.TbPhc[i].no.toString()+"+"+json.TbPhc[i].estab.toString()+json.TbPhc[i].nome2
            });			
		}
	}				
}

function get_calendar_height() {
      return $(window).height() - 30;
}


$(document).ready(function() {

	$(".input_date").datepicker({
		dateFormat: 'dd/mm/yy',
		dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
		dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab','Dom'],
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
		nextText: 'Próximo',
		prevText: 'Anterior'
	}); 
	
	var valcookie = getCookie("mostrafs");
	
	if ((valcookie!==undefined) & (valcookie!==null) & (valcookie!=="")){
		if (valcookie.trim().toLowerCase()==="true"){
			mostrafs = true;
		}else{
			mostrafs = false;
		}
	}	
	
	mytooltip();
	
	valida_filtros();

});

function mytooltip(){

	$('.form-control').tooltip();  				

}	


// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("");
  span.className = "close fa fa-trash";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
  
  var span2 = document.createElement("SPAN");
  var txt2 = document.createTextNode("");
  span2.className = "edit fa fa-edit";
  span2.appendChild(txt2);
  myNodelist[i].appendChild(span2);


}



// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
	ev.target.classList.toggle('checked');
		console.log(ev.target.classList.value);
	var fechar = ev.target.classList.value.toString().toLowerCase();
	var uStamp = ev.target.getAttribute("data-stamp");
	var query			
		console.log(fechar);
	if (fechar === "checked"){
		query = "Update u_tdl set fechada = 1 Where u_tdlstamp='" + uStamp + "'"
	}else{
		query = "Update u_tdl set fechada = 0 Where u_tdlstamp='" + uStamp + "'"		
	}
	console.log(query);
	if (query!==""){
		waitwindow("A Abrir/Fechar o registo !!!");

		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				alertify.success("Registo Aberto/Fechado!!!")
				fechawaitwindow();
			}else{
				alertify.error("Erro ao Abrir/Fechar!!!")
				fechawaitwindow();
			}
		});				
	}
  }
}, false);

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
	var div = this.parentElement;
	div.style.display = "none";
	
	console.log(div);
	
	//query = "insert into u_tdl(u_tdlstamp,tarefa,datac,tecnico,tecnnm,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)" + 		
	//" Values (left(replace(newid(),'-',''),25),'" + inputValue + "','" + dtoshoje() + "'," + pub_tecnico + ",'" + pub_tecnnm + "'" +
	//",'" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "')"
	
	//if (query!==""){
	//	waitwindow("A Guardar o registo !!!");

	//	CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
	//		if (json!==""){
	//			alertify.success("Registo guardado!!!")
	//			fechawaitwindow();
	//		}else{
	//			alertify.error("Erro ao guardar!!!")
	//			fechawaitwindow();
	//		}
	//	});				
	//}
	
	
  }
}

// Click on a close button to hide the current list item
var edit = document.getElementsByClassName("edit");
var i;
for (i = 0; i < edit.length; i++) {
  edit[i].onclick = function() {
	var div = this.parentElement;
	console.log(div);

  }
}


// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  var uStamp = u_Stamp();
  
  li.appendChild(t);
  if (inputValue === '') {
	alertify.error("Tem de preencher o texto!");
  } else {
	document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

	var att = document.createAttribute("data-stamp");
	att.value = json.TbPhc[i].u_tdlstamp;
	li.setAttributeNode(att);

  
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("");
  span.className = "close fa fa-trash";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
	close[i].onclick = function() {
	  var div = this.parentElement;
	  div.style.display = "none";
	  	console.log(div);
	}
  } 
  
  var span2 = document.createElement("SPAN");
  var txt2 = document.createTextNode("");
  span2.className = "edit fa fa-edit";
  span2.appendChild(txt);
  li.appendChild(span2);

  for (i = 0; i < edit.length; i++) {
	edit[i].onclick = function() {
	  var div = this.parentElement;
	console.log(div);
	}
  }
  
  	var query			

	query = "insert into u_tdl(u_tdlstamp,tarefa,datac,tecnico,tecnnm,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)" + 		
	" Values ('" + uStamp + "','" + inputValue + "','" + dtoshoje() + "'," + pub_tecnico + ",'" + pub_tecnnm + "'" +
	",'" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "')"
	
	if (query!==""){
		waitwindow("A Guardar o registo !!!");

		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				alertify.success("Registo guardado!!!")
				fechawaitwindow();
			}else{
				alertify.error("Erro ao guardar!!!")
				fechawaitwindow();
			}
		});				
	}
	
}

function carregar(){
	


	
	setTimeout(function(){ 
		
		waitwindow("A ler os dados do servidor !!!");
				
		var query			
		query = "select tema,u_alteramx as podealterar,iniciais,tecnico,tecnnm from us (nolock) where usercode='"+username.toString()+"'";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_user(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});

		query = "select no,nome,estab,nome2"
		query += " From cl (nolock) Where inactivo=0 order by nome";

		console.log(query);

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
			//console.log(json);
			if (json!==""){
				validou_cl(json);
			}else{
			}
		});
					
		query = "Select fref.fref,fref.nmfref "
			+	" From bo (nolock) "
			+	" Inner join fref (nolock) on fref.fref = bo.fref"
			+	" Where bo.ndos = 15 and bo.fechada = 0"
			+	" And fref.u_fechado = 0"
			+	" Order by fref.fref";

		console.log(query);

				
		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_fref(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});	
	
	}, 200); 

	$("#versao").html("Versão da aplicação: " + pub_versaoapp.trim());
	
	var data = hoje();

}


function validou_user(json){

	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].tema!=="!#NA#!SEMDADOS"){
			
			m_chinis = json.TbPhc[i].iniciais;			
			pub_tecnico = json.TbPhc[i].tecnico;
			pub_tecnnm = json.TbPhc[i].tecnnm;

			if (json.TbPhc[i].podealterar.toString().trim().toLowerCase()==="true"){
				podealterar = true
			}else{
				$("#assistencia_btNova").hide();
			}
			
			if (encontro == false){
				loadCSS(pub_url+"css/theme-default.min.css");
				loadCSS(pub_url+"pimages/user1.css");
			}
			loadCSS(pub_url+"tts/css/tts.css");
	
		}
	}	


	var query			
	query = "Select cmdesc,cm "
		+	" From cm4 (nolock) "
		+	" Where inactivo = 0 And u_nagenda = 0 "
		+	" Order by u_ordem,cmdesc";

	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

		if (json!==""){
			validou_tecnicos(json);
		}else{
			alertify.error("Erro ao ler os dados!!");
			fechawaitwindow();
		}
	});		
}

function getUrl(){
	Parameters = {};
	var url   = window.location.href
	pub_url = url.replace(pub_app,"");
}

getUrl();

function loadCSS(url){
	if(document.createStyleSheet) {
	  document.createStyleSheet(url);
	}
	else {
	  var styles = "@import url(' " + url +" ');";
	  var newSS=document.createElement('link');
	  newSS.rel='stylesheet';
	  newSS.href='data:text/css,'+escape(styles);
	  document.getElementsByTagName("head")[0].appendChild(newSS);
	}
}	
																																
												
function valida_filtros(){
	
	var uObjFlt = $("#Flt_Calendario");
	PercorreFlt(uObjFlt,function(){
		setTimeout(function(){_Preenche_FLT();},100);		
	});
	
}

function _Preenche_FLT(){
	var uObjFlt = $("#Flt_Calendario");		
	Calendar_Filtros = "";
	uFiltros = [];	
}

function Calendar_CorrerFiltros(){
	
	var uObjFlt = $("#Flt_Calendario");
	Calendar_Filtros = "";
	uFiltros = [];
	
	CorrerFlts(uObjFlt);

	if (uFiltros.length !== 0){
		for (i=0;i<uFiltros.length;i++){
			Calendar_Filtros = 	Calendar_Filtros + uFiltros[i];
		}
	}			
}

var myVar = setInterval(filtrar_agenda, 300000);

$('body').mousemove(function() {
	clearInterval(myVar);
	myVar = setInterval(filtrar_agenda, 300000);
});
			
function refrescar_agenda(){
	
	filtrar_agenda();

}


//Filtrar
documento.on("click", "#abrirfiltros", function () {

	$(".Flt_Calendario").slideToggle();			
	//$('.Flt_Calendario').hide(300);

});    


//Filtrar
documento.on("click", "#Calendar_Flt", function () {
			
	filtrar_agenda();

});    


function filtrar_agenda(){
	
	//console.log("Inicio Filtrar : "+hoje().toString()+" "+time())
	
	Calendar_CorrerFiltros();
	
	uFiltro = Calendar_Filtros;		

	//console.log("uFiltro -> "+uFiltro)
	AtualizarCalendarioInternecoes(uFiltro);

}

//Limpar filtros
documento.on("click", "#Calendar_LimpaFlt", function () {
	solivres = false;
	$('#lblSoLivres').html("");
	dtinilivres = "01-01-1900";
	dtfimlivres = "01-01-1900";
	
	var uObjFlt = $("#Flt_Calendario");

	LimpaFiltros(uObjFlt);	

	$("#txtdias").val(uNdias);
	$("#chkSoSuporte").prop('checked', false);
	
	var cbTecnico=$("#Calendar_cmdTecnico");
	PopularComboVal(cbTecnico,jsonTecnico,"","Seleccionar Técnico...")
	var cbFref=$("#Calendar_cmdFref");
	PopularComboVal(cbFref,jsonFref,"","Seleccionar Projeto...")
	
	var uFiltro = "";
	
	AtualizarCalendarioInternecoes("");
});        
  

function AtualizarCalendarioInternecoes(filtro){

	waitwindow("A Ler os técnicos, Aguarde!!");
	
	if (solivres===false){

		var uProjeto = "";
		var uFltProjeto = "";
		uProjeto = $("#Calendar_cmdFref").val();

		if ((uProjeto!==undefined) && (uProjeto!==null) && (uProjeto.toString().trim()!=="") && (uProjeto.toString().trim()!=="-1")){
			if ($("#chkSoSuporte").is(":checked")){
				uFltProjeto = " And cm4.cm in (select tecnico from mx (nolock) where mx.u_fref like '" + uProjeto + "' And mx.u_tipomx = '05 SUPORTE')"			
			}else{	
				uFltProjeto = " And cm4.cm in (select tecnico from mx (nolock) where mx.u_fref like '" + uProjeto + "')"			
			} 
		}else{
			if ($("#chkSoSuporte").is(":checked")){
				uFltProjeto = " And cm4.cm in (select tecnico from mx (nolock) where mx.u_tipomx = '05 SUPORTE')"			
			} 		
		}

		query = "Select cm4.cm as id,cm4.cmdesc as title From cm4 (nolock) Where cm4.inactivo = 0  and cm4.u_nagenda = 0 " + uFltProjeto + filtro + " Order by cm4.u_ordem,cm4.cmdesc "
			
		console.log(query);
		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
			//console.log(json);
			if (json!==""){
			
				for(var i in dados_resources){ 
					$('#calendar').fullCalendar('removeResource',dados_resources[i].id);
				}				
								
				ReCarrega_resources(json);
				
				carregarquerycalendario()
				
				var query = "";

				if (filtro!==""){
					if (uTipo.trim()==="1")
					{
						query = querycalendarmx + filtro.replace(/mh/g,"mx");	
					}else{
						query = querycalendar + filtro + "   Union All	  " + querycalendarmx + filtro.replace(/mh/g,"mx");	
					}						
				}else{
					if (uTipo.trim()==="1")
					{
						query = querycalendarmx;	
					}else{
						query = querycalendar + "   Union All	  " + querycalendarmx ;	
					}						
				}
			
				/*waitwindow("A Ler as marcações, Aguarde!!");
				
				console.log("querycalendar -> " + querycalendar);
				console.log("filtro -> " + filtro);
				console.log("querycalendarmx -> " + querycalendarmx);
				console.log("pub_tecnico -> " + pub_tecnico);
				console.log("query -> " + query);
				*/
				CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
					//console.log(json);
					if (json!==""){
						ReDesenharCalendario(json);
					}else{
					}
				});
							
			}else{
			}
		});
	}else{
		
		var uTipoTec = "";
		uTipoTec = $("#Calendar_cmdTipoTecnico").val();
		var uTecnico = "";
		uTecnico = $("#Calendar_cmdTecnico").val();
		
		if ((uTipoTec===undefined) || (uTipoTec===null) || (uTipoTec==="") || (uTipoTec.toString().trim()==="-1")){
			uTipoTec = "";
		}
		if ((uTecnico===undefined) || (uTecnico===null) || (uTecnico==="") || (uTecnico.toString().trim()==="-1")){
			uTecnico = 0;
		}
	
		waitwindow("A Ler os técnicos, Aguarde!!");
	
		query = "exec Tts_tecnicos_livres '" + dtinilivres.substring(0, 4)+dtinilivres.substring(5, 7)+dtinilivres.substring(8, 10) + "','" + dtfimlivres.substring(0, 4)+dtfimlivres.substring(5, 7)+dtfimlivres.substring(8, 10) + "'," + uTecnico + ",'" + uTipoTec + "'"
		
		//console.log(query);
		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
			
				for(var i in dados_resources){ 
					$('#calendar').fullCalendar('removeResource',dados_resources[i].id);
				}				
										
				dados_resources=[];
				for(var i in json.TbPhc){ 
					if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){			
						dados_resources.push({
							title: json.TbPhc[i].cmdesc,
							id: json.TbPhc[i].cm		
						});	
						$('#calendar').fullCalendar( 'addResource', {
								id:json.TbPhc[i].cm,
								title: json.TbPhc[i].cmdesc
						}); 
								
					}
				}	
				
				Calendar_CorrerFiltros();
	
				filtro = Calendar_Filtros;	
				
				carregarquerycalendario(dtinilivres.substring(0, 4)+dtinilivres.substring(5, 7)+dtinilivres.substring(8, 10),dtfimlivres.substring(0, 4)+dtfimlivres.substring(5, 7)+dtfimlivres.substring(8, 10));
				
				var query = "";

				if (filtro!==""){
					if (uTipo.trim()==="1")
					{
						query = querycalendarmx + filtro.replace(/mh/g,"mx");	
					}else{
						query = querycalendar + filtro + "   Union All	  " + querycalendarmx + filtro.replace(/mh/g,"mx");	
					}						
				}else{
					if (uTipo.trim()==="1")
					{
						query = querycalendarmx;	
					}else{
						query = querycalendar + "   Union All	  " + querycalendarmx ;	
					}						
				}
			
				/*waitwindow("A Ler as marcações, Aguarde!!");
				
				console.log("querycalendar -> " + querycalendar);
				console.log("filtro -> " + filtro);
				console.log("querycalendarmx -> " + querycalendarmx);
				console.log("pub_tecnico -> " + pub_tecnico);
				console.log("query -> " + query);
				*/
				CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
					//console.log(json);
					if (json!==""){
						ReDesenharCalendario(json);
					}else{
					}
				});
							
			}else{
			}
		});
	}


	
	
} 

var dados_resources = [];

function validou_fref(json){
	
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].fref!=="!#NA#!SEMDADOS"){	
			jsonFref.push({
				descricao: json.TbPhc[i].nmfref,
				valor: json.TbPhc[i].fref		
			});				
		}
	}		
	
	var cbFref=$("#Calendar_cmdFref");
	PopularComboVal(cbFref,jsonFref,"","Seleccionar Projeto...")
	
}

function validou_tecnicos(json){
	
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].cmdesc!=="!#NA#!SEMDADOS"){	
			jsonTecnico.push({
				descricao: json.TbPhc[i].cmdesc,
				valor: json.TbPhc[i].cmdesc		
			});				
		}
	}		
	
	var cbTecnico=$("#Calendar_cmdTecnico");
	PopularComboVal(cbTecnico,jsonTecnico,pub_tecnnm,"Seleccionar Técnico...")
	
	
	var query			
	query = "Select u_tdlstamp,clstamp,no,estab,nome,tarefa,obs,status,fechada,clfechada,datac,dataf,tecnico,tecnnm,dataalt,pquem,datap" 
		+	" From u_tdl (nolock) "
		+	" Where tecnnm = '" + pub_tecnnm + "' "
		//+	" Where fechada = 0 And tecnnm = '" + pub_tecnnm + "' "
		+	" Order by dataalt,cast(tarefa as varchar(max))";
	
	console.log(query);
	
	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

		if (json!==""){
			validou_tarefas(json);
		}else{
			alertify.error("Erro ao ler os dados!!");
			fechawaitwindow();
		}
	});	
	
	fechawaitwindow();
}

function validou_tarefas(json){

	  var li = document.createElement("li");
	  var inputValue = "";
	  var t = "";

	  
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].u_tdlstamp!=="!#NA#!SEMDADOS"){	
			jsonTarefas.push({
				u_tdlstamp: json.TbPhc[i].u_tdlstamp,
				clstamp: json.TbPhc[i].clstamp,
				no: json.TbPhc[i].no,		
				estab: json.TbPhc[i].estab,		
				nome: json.TbPhc[i].nome,		
				tarefa: json.TbPhc[i].tarefa,		
				obs: json.TbPhc[i].obs,		
				status: json.TbPhc[i].status,		
				fechada: json.TbPhc[i].fechada,		
				clfechada: json.TbPhc[i].clfechada,		
				datac: json.TbPhc[i].datac,		
				dataf: json.TbPhc[i].dataf,		
				tecnico: json.TbPhc[i].tecnico,		
				tecnnm: json.TbPhc[i].tecnnm,		
				dataalt: json.TbPhc[i].dataalt,		
				pquem: json.TbPhc[i].pquem,		
				datap: json.TbPhc[i].datap		
			});

			console.log(json.TbPhc[i].fechada);
						
			li = document.createElement("li");
			inputValue = json.TbPhc[i].tarefa;
			t = document.createTextNode(inputValue);
			li.appendChild(t);
			if (inputValue !== '') {
				document.getElementById("myUL").appendChild(li);
			}
			inputValue = ""

			if (json.TbPhc[i].fechada.toString().toLowerCase().trim()==="true"){
				li.className = "checked";				
			}

			var att = document.createAttribute("data-stamp");
			att.value = json.TbPhc[i].u_tdlstamp;
			li.setAttributeNode(att);
	
			var span = document.createElement("SPAN");
			var txt = document.createTextNode("");
			span.className = "close fa fa-trash";
			span.appendChild(txt);
			li.appendChild(span);

			for (i = 0; i < close.length; i++) {
				close[i].onclick = function() {
					var div = this.parentElement;
					var uStamp = div.getAttribute("data-stamp");
					var query			

					query = "Delete From u_tdl Where u_tdlstamp='" + uStamp + "'"
					
					if (query!==""){
						waitwindow("A Eliminar o registo !!!");

						CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
							if (json!==""){
								alertify.success("Registo Eliminado!!!")
								div.style.display = "none";
								fechawaitwindow();
							}else{
								alertify.error("Erro ao Eliminar!!!")
								fechawaitwindow();
							}
						});				
					}
				}
			} 

			var span2 = document.createElement("SPAN");
			var txt2 = document.createTextNode("");
			span2.className = "edit fa fa-edit";
			span2.appendChild(txt);
			li.appendChild(span2);

			for (i = 0; i < edit.length; i++) {
				edit[i].onclick = function() {
					var div = this.parentElement;
					var uStr = div.getAttribute("data-stamp");
					console.log(uStr);
				}
			}
			  
		}
	}	

  //<li>Hit the gym</li>
  //<li class="checked">Pay bills</li>

	fechawaitwindow();

}

function OpenModalBox(header, inner, bottom){
	var modalbox = $('#modalbox');
	modalbox.find('.modal-header-name span').html(header);
	modalbox.find('.devoops-modal-inner').html(inner);
	modalbox.find('.devoops-modal-bottom').html(bottom);
	modalbox.fadeIn('fast');
	$('body').addClass("body-expanded");
}

function CloseModalBox(){
	var modalbox = $('#modalbox');
	modalbox.fadeOut('fast', function(){
		modalbox.find('.modal-header-name span').children().remove();
		modalbox.find('.devoops-modal-inner').children().remove();
		modalbox.find('.devoops-modal-bottom').children().remove();
		$('body').removeClass("body-expanded");
	});
}


var tooltip = [];

var mtop = 0;


// Função para percorrer e tratar os filtros
function elementotop(elemento){
	/* 
	console.log("elemento");
	console.log(elemento);
	console.log(elemento.offset());
		 */		
	var parentOffset = elemento.offset(); 
	var auxleft = parentOffset.left;
	//console.log(auxleft);
	var auxtop = parentOffset.top;
	//console.log(auxtop);

}	

	
// Função para percorrer e tratar os filtros
function somatopelementos(elemento,nomeelementofilho){
	
    //console.log("localName: "+this.localName);
    elemento.children().each(function() {
		var atributos = objatributos(this);        
        var uValor="";        
        var uMyObj=elemento;
		       
	    if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
			var txtValor = $("[id='"+atributos[0].id+"']");
		}else{
			var txtValor = $("[name='"+atributos[0].name+"']");			
		}

		uMyObj=txtValor;
		//console.log($(this));
		//console.log($(this).offset());
					
		var parentOffset = $(this).offset(); 
		var auxleft = parentOffset.left;
		//console.log(auxleft);
		mtop = mtop + auxleft;
		//console.log(mtop);
		
		if (txtValor !== nomeelementofilho){
			somatopelementos($(this));			
			//console.log($(this));
		}
    });   
	//console.log("2");
	
}	

function validou_projetos(json,projeto){
	jsonProjetos = [];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].fref!=="!#NA#!SEMDADOS"){			
			jsonProjetos.push({
				valor: json.TbPhc[i].fref,			
				descricao: json.TbPhc[i].fref + " - " + json.TbPhc[i].nmfref		
			});			
		}
	}	
	var cbProjetos=$("#newevent_fref");
	PopularComboVal(cbProjetos,jsonProjetos,projeto,"Seleccionar Projeto...");
	
	fechawaitwindow();
}	  


		
function guardarevento(calEvent){
	//console.log(calEvent);
	var query = ""
	var tabela = calEvent.tabela.toString().toLowerCase().trim()

	if (tabela==="mx"){
		var uData = $('#newevent_datai').val();
		var uHorai = $('#newevent_horai').val();
		var uHoraf = $('#newevent_horaf').val();
		var uCliente = $('#newevent_cl').val();
		var uNomeTec = $('#newevent_tec').val();
		var uEmCasa = $('#chkemcasa').is(':checked').toString().trim().toLowerCase();
		var uNaoConf = $('#chknaoconf').is(':checked').toString().trim().toLowerCase();
		var uTipomx = $('#newevent_tipomx').val();
		var uProjeto = $('#newevent_fref').val();
		var uTitulo = $('#newevent_desc').val();
		var uTexto = $('#newevent_desc').val();
		var newstamp = u_Stamp();
		var auxtitle = ""
		var uNo = "0";
		var uEstab = "0";
		var uNome = "";
		var uNoTec = 0;
								
		for(var i in jsonClientes){ 					
			if ((jsonClientes[i].nome.trim()===uCliente) || (jsonClientes[i].nome2.trim()===uCliente)){			
				uNo = jsonClientes[i].no.toString().trim();
				uEstab = jsonClientes[i].estab.toString().trim();
				uNome = jsonClientes[i].nome.trim();
			}
		}						
		
		for(var i in jsonTecnico){ 					
			if (jsonTecnico[i].descricao.trim()===uNomeTec){			
				uNoTec = jsonTecnico[i].valor;
			}
		}						

		switch(uTipomx.trim().toUpperCase()) {
		    case "01 INTERNA":
		        uProjeto = "TTS"
				uNo = "1";
				uEstab = "0";
				uNome = "Cliente Genérico Totalsoft";
				uCliente= "Cliente Genérico Totalsoft";
		        break;
		    case "02 COMERCIAL":
		        uProjeto = "COMERCIAL"
				uNo = "1";
				uEstab = "0";
				uNome = "Cliente Genérico Totalsoft";
				uCliente= "Cliente Genérico Totalsoft";
		        break;
		    case "03 CONTRATO":
		        uProjeto = "CONTRATO"
		        break;
		    case "05 SUPORTE":
		        uProjeto = "CONTRATO"
				uNo = "1";
				uEstab = "0";
				uNome = "Cliente Genérico Totalsoft";
				uCliente= "Cliente Genérico Totalsoft";
		        break;
		    case "06 AUSENCIA":
		        uProjeto = ""
				uNo = "1";
				uEstab = "0";
				uNome = "Cliente Genérico Totalsoft";
				uCliente= "Cliente Genérico Totalsoft";
		        break;
		} 
		
		if ((uTipomx.trim().toUpperCase()==="04 PROJETO") && ((uProjeto==="") || (uProjeto==="-1"))){
			alertify.error("Desculpe, mas tem que preencher o campo projecto! Verifique.");
			return
		}	

		if ((uTipomx.trim().toUpperCase()==="04 PROJETO") && ((uProjeto==="TTS") || (uProjeto==="COMERCIAL") || (uProjeto==="CONTRATO"))){
			alertify.error("Desculpe, mas o projecto é inválido para este tipo de marcação! Verifique.");
			return
		}	
		
		calEvent.start= uData + " " + uHorai;
		calEvent.end= uData + " " + uHoraf;
		calEvent.resourceId= uNoTec;
		calEvent.tecnico= uNomeTec;
		calEvent.projeto= uProjeto;
		calEvent.tipo= uTipomx;
		calEvent.cliente= uCliente;
		calEvent.texto= uTexto;
		calEvent.naoconf= uNaoConf;
		calEvent.emcasa= uEmCasa;
		calEvent.tipomx= uTipomx;
		calEvent.description= uTexto;	
				
		for(var i in dadoscal){ 
			if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
				dadoscal[i].start= uData + " " + uHorai;
				dadoscal[i].end= uData + " " + uHoraf;
				dadoscal[i].texto= calEvent.texto;
				dadoscal[i].cliente=calEvent.cliente;
				dadoscal[i].title=calEvent.title;
				dadoscal[i].tecnico=calEvent.tecnico;
				dadoscal[i].resourceId=calEvent.resourceId;
				dadoscal[i].naoconf=uNaoConf;
				dadoscal[i].emcasa=uEmCasa;						
			}
		}
				
		$('#calendar').fullCalendar('updateEvent', calEvent);
		CloseModalBox()
		
		query = "update " + tabela + " set texto='" + calEvent.texto + "'" +
		",data='" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "'" +
		",inicio=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" + 
		",hinicio='" + uHorai + "'" +
		",fim=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')" + 
		",hfim='" + uHoraf + "'" +
		",clno=" + uNo +
		",clestab=" + uEstab +
		",clnome='" + uNome + "'" +
		" ,morada = isnull((select morada from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')" +
		" ,local = isnull((select local from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')" +
		" ,codpost = isnull((select codpost from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')" +
		",tecnnm='" + uNomeTec + "'" +
		",tecnico=" + uNoTec.toString().trim() +
		",vendedor=isnull((select vendedor from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')" +
		",vendnm=isnull((select vendnm from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')" +
		",username=isnull((select top 1 username from us (nolock) where us.tecnico=" + uNoTec.toString().trim() + "),'')" +
		",userno=isnull((select top 1 userno from us (nolock) where us.tecnico=" + uNoTec.toString().trim() + "),0)" +
		",tusername=isnull((select top 1 username from us (nolock) where us.tecnico=" + uNoTec.toString().trim() + "),'')" +
		",tuserno=isnull((select top 1 userno from us (nolock) where us.tecnico=" + uNoTec.toString().trim() + "),0)" + 
		",u_fref='" + uProjeto + "'" +
		",u_tipomx='" + uTipomx + "'" +
		",u_naoconf=" + (uNaoConf.toString().trim().toLowerCase() === "true" ? " 1 " : "0") +
		",u_emcasa=" + (uEmCasa.toString().trim().toLowerCase() === "true" ? " 1 " : "0") +					
		",usrdata=convert(char(10),getdate(),121)" +					
		",usrhora=convert(char(10),getdate(),108)" +					
		",usrinis='" + m_chinis + "'" + 					
		" where " + tabela + "stamp='" + calEvent.stamp + "'";	
	}else{
		alertify.error("Esse tipo de registo não pode ser alterado!!!")
		CloseModalBox()
	}
	
		//console.log(query);
	if (query!==""){
		waitwindow("A alterar o registo !!!");

		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				alertify.success("Registo alterado!!!")
				fechawaitwindow();
			}else{
				alertify.error("Erro ao alterar!!!")
				fechawaitwindow();
			}
		});				
	}
				
}
