//*******************************************************************
//** JavaScript para o ecrã de Lista de tarefas (ToDoList) do cliente
//** 
//** Criado por: Rui Vale  
//** Criado em : 24/10/2019
//*******************************************************************

//*******************************************************************
//** VARIÁVEIS
//*******************************************************************

//Variável necessária para comunicação segura com o webservice
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

//Variável com o caminho do WebService
var pub_urlws = "http://totalsoft.ddns.net/ttsws/service.asmx?wsdl";
var documento = $(document);
var username = "";
var pub_tecnnm = 'rui vale'
var pub_tecnico = "15";
var pub_login = "rui.vale"
var nocliente = "";
var m_chinis = "TTS"
var pub_eadm = false;
var pub_app = "";
var _numJseCssCarregados = 0;
var pub_versaoapp= "";
var datahora = dtoshoje() + time().replace(/[:]/g,"");
pub_versaoapp = datahora;

var jsonTema =[{"val":"1","valor":"default","descricao":"Normal"},{"val":"2","valor":"classic","descricao":"Cor"},{"val":"3","valor":"dark","descricao":"Escuro"}
	,{"val":"4","valor":"4","descricao":"Aqua"},{"val":"5","valor":"5","descricao":"Glaciar"},{"val":"6","valor":"6","descricao":"Anil"}
	,{"val":"7","valor":"7","descricao":"Coral"},{"val":"8","valor":"8","descricao":"Prado"},{"val":"9","valor":"9","descricao":"Branco"}];
var jsonTecnico = [];
var jsonFref = [];
var jsonClientes = [];
var jsonProjetos = [];
var jsonTarefas = [];

var st = [];


// Retorna data de hoje em formato sql
function dtoshoje(){
	var uhoje = new Date();
	var dd = uhoje.getDate();
	var mm = uhoje.getMonth()+1;
	var yyyy = uhoje.getFullYear().toString();

	if(dd<10){
		dd='0'+dd.toString()
	}else{
		dd=dd.toString()		
	}
	if(mm<10){
		mm='0'+mm.toString()
	}else{
		mm=mm.toString()		
	}

	return yyyy+mm+dd;	
}


// Retorna Hora actual
function time(){
	var uhoje = new Date();
	var hh=uhoje.getHours();
	var mm=uhoje.getMinutes();
	var ss=uhoje.getSeconds();
	
	if(hh<10){
		hh='0'+hh.toString()
	}else{
		hh=hh.toString()		
	}
	if(mm<10){
		mm='0'+mm.toString()
	}else{
		mm=mm.toString()
	}
	if(ss<10){
		ss='0'+ss.toString()
	}else{
		ss=ss.toString()
	} 	
	return hh+':'+mm+':'+ss;
}

//Função WaitWindow
function waitwindow(Texto){	
	jQuery.blockUI({message: "<h3><i class='fa fa-spinner fa-spin'></i>  " + Texto + "</h3>"},{baseZ: 9000});
}
					
										
var varmyTmptdl = "<tr data-type=jsonTarefas'>"
		+ '<td class="center" style="width: 50px;">'
		+ '		<div id="bt_apagar" onclick="click_btapagar(jQuery(this))" class="bt_apagar btn btn-danger btn-sm bt_small {{:(fechada.toString().toLowerCase().trim()==="true" ? "invisible" : "")}}" title="Apagar"  data-original-title="Apagar" data-placement="top" data-toggle="tooltip" data-stamp="{{:u_tdlstamp}}">'
		+ '			<span><i class="fa fa-trash-o txt-default"></i></span>'
		+ '		</div>'
		+ '</td>'
		+ '<td class="center">'
		+ '		<div id="bt_alterar" onclick="click_btalterar(jQuery(this))" class="bt_alterar btn btn-info btn-sm bt_small {{:(fechada.toString().toLowerCase().trim()==="true" ? "invisible" : "")}}" title="Alterar"  data-original-title="Alterar" data-placement="top" data-toggle="tooltip" data-stamp="{{:u_tdlstamp}}" >'
		+ '			<span><i class="fa fa-edit txt-default"></i></span>'
		+ '		</div>'
		+ '</td>'
		+ '<td class="center" style="width: 50px;">'
		+ '		<div id="bt_fechar" onclick="click_{{:(fechada.toString().toLowerCase().trim()==="true" ? "btabrir" : "btfechar")}}(jQuery(this))" class="btfechar btn btn-primary btn-sm bt_small " title="{{:(fechada.toString().toLowerCase().trim()==="true" ? "Reabrir" : "Fechar")}}"  data-original-title="{{:(fechada.toString().toLowerCase().trim()==="true" ? "Reabrir" : "Fechar")}}" data-placement="top" data-toggle="tooltip" data-stamp="{{:u_tdlstamp}}">'
		+ '			<span><i class="fa {{:(fechada.toString().toLowerCase().trim()==="true" ? "fa-folder-open" : "fa-thumbs-up")}} txt-default"></i></span>'
		+ '		</div>'
		+ '</td>'
		+ '<td><input type="numeric" name="txtid" id="txtid" class="form-control" value="{{:id}}" data-campo="id" style="width: 50px;" readonly></input></td>'
		+ '<td><input type="text" name="txtdatac" id="txtdatac" class="form-control" value="{{:datac}}" data-campo="datac" style="width: 90px;" readonly></input></td>'
		+ '<td><input type="date" name="txtdatap" id="txtdatap" class="form-control podealterar" value="{{:datap.substring(6, 10)+"-"+datap.substring(3, 5)+"-"+datap.substring(0, 2)}}" data-campo="datap" style="width: 140px;" readonly></input></td>'
		+ '<td>'
		+ '		<div data-role="fieldcontain" class="ui-field-contain">	'
		+ ' 		<div id="btQtdmenos" onclick="qtdmenos()" data-theme="a" class="bt_qtdmenos btQtd btn btn-default btn-sm bt_small podealterar invisible" data-stamp="{{:u_tdlstamp}}"><span><i class="fa fa-minus"></i></span></div>'
		+ '				<input type="numeric" name="prioridade" id="prioridade" onchange="alterou_Qtd()" class="Qtd podealterar" value="{{:prioridade}}" data-campo="prioridade" readonly>'
		+ '			<div id="btQtdmais" onclick="qtdmais()" data-theme="a" class="bt_qtdmais btQtd btn btn-default btn-sm bt_small podealterar invisible" data-stamp="{{:u_tdlstamp}}"><span><i class="fa fa-plus"></i></span></div>'
		+ ' 	</div>'
		+ '</td>'
		+ '<td><input type="text" name="txtquempediu" id="txtquempediu" class="form-control podealterar" value="{{:pquem}}" data-campo="pquem" style="width: 90px;" readonly></input></td>'
		+ '<td><input type="text" name="txtequipamento" id="txtequipamento" class="form-control podealterar" value="{{:equipamento}}" data-campo="equipamento" style="width: 90px;" readonly></input></td>'
		+ '<td><textarea data-campo="txttarefa" rows="3" id="txttarefa" class="form-control podealterar" placeholder="Tarefa" style="width: 200px;" readonly>{{:tarefa}}</textarea></td>'
		+ '<td><input type="text" name="txtdatai" id="txtdatai" class="form-control" value="{{:datai}}" data-campo="datai" style="width: 90px;" readonly></input></td>'
		+ '<td><input type="text" name="txttecnnm" id="txttecnnm" class="form-control" value="{{:tecnnm}}" data-campo="tecnnm" style="width: 120px;" readonly></input></td>'
		+ '<td><input type="text" name="txtstatus" id="txtstatus" class="form-control" value="{{:txtstatus}}" data-campo="datai" style="width: 100px;" readonly></input></td>'
		+ '<td><textarea data-campo="txtrel" rows="2" id="txtrel" class="form-control" placeholder="Relatório" style="width: 150px;" readonly>{{:rel}}</textarea></td>'
		+ '<td class="center" style="font-size: 20px!important;">'
		+ '		<span><i class="fa fa-square-o small {{:(fechada.toString().toLowerCase().trim()==="true" ? "invisible" : "")}}"></i></span>'
		+ '		<span><i class="fa fa-check-square-o {{:(fechada.toString().toLowerCase().trim()==="true" ? "" : "invisible")}}"></i></span>'
		+ '</td>'
		+ '<td class="center" style="font-size: 20px!important;">'
		+ '		<span><i class="fa fa-square-o small {{:(clfechada.toString().toLowerCase().trim()==="true" ? "invisible" : "")}}"></i></span>'
		+ '		<span><i class="fa fa-check-square-o {{:(clfechada.toString().toLowerCase().trim()==="true" ? "" : "invisible")}}"></i></span>'
		+ '</td>'
		//+ '<td>{{:fechada}}</td>'
		//+ '<td>{{:clfechada}}</td>'
		+ '<td><input type="text" name="txtdataf" id="txtdataf" class="form-control" value="{{:dataf}}" data-campo="dataf" style="width: 90px;" readonly></input></td>'
		+ "<td style='display:none;'>{{:fechada}}</td>"
		+ "<td style='display:none;'>{{:u_tdlstamp}}</td>"
		+ "</tr>";



function click_btapagar(linha){
	var uStamp = linha.attr("data-stamp");
	var query			

	alertify.confirm("Quer mesmo apagar o registo ?", function (e,str) {
	
		if (e){

			query = "Delete From u_tdl Where u_tdlstamp='" + uStamp + "'"
			
			console.log(query);
			
			if (query!==""){
				waitwindow("A Eliminar o registo !!!");

				CorreNewWs("QueryJson",query,function(json){
					if (json!==""){
						alertify.success("Registo Eliminado!!!")
						refrescarecran();
						fechawaitwindow();
					}else{
						alertify.error("Erro ao Eliminar!!!")
						fechawaitwindow();
					}
				});				
			}
		}else{
			alertify.error("Cancelado pelo utilizador!!!")
		}
	}, "Apagar Registo");
}	

function click_btalterar(linha){
	setTimeout(function(){
		var Stamp = linha.attr("data-stamp");
		var  modoedicao = linha.attr("modoedicao");

		if ((modoedicao===undefined) || (modoedicao===null)) { 
			linha.attr("modoedicao","");
			linha.removeClass("btn-info");
			linha.addClass("btn-primary");
			linha.find("span").find("i").removeClass("fa-edit");
			linha.find("span").find("i").addClass("fa-floppy-o");
			linha.attr("title","Gravar");

			setTimeout(function(){
				jQuery("#tabtdl tr.selected td:nth-child(n) > .podealterar").removeAttr("readonly");	
				jQuery("#tabtdl tr.selected td:nth-child(n) > div:nth-child(n) .podealterar").removeAttr("readonly");	
				jQuery("#tabtdl tr.selected td:nth-child(n) > div:nth-child(n) .podealterar").removeClass("invisible");				
			},10);

		}else{
			if ((Stamp!==undefined) && (Stamp!==null) && (Stamp!=="")){
				var _datap = jQuery("#tabtdl tr.selected td:eq(5) > input").val();
				var _prioridade = jQuery("#tabtdl tr.selected td:eq(6) > div:nth-child(n) input").val();
				var _pquem = jQuery("#tabtdl tr.selected td:eq(7) input").val();
				var _equipamento = jQuery("#tabtdl tr.selected td:eq(8) input").val();
				var _tarefa = jQuery("#tabtdl tr.selected td:eq(9) textarea").val();

				waitwindow("A guardar!!")
				
				var query = "Update u_tdl set datap='" + _datap.toString().replace(/[-]/g,"") + "' "
				query += " ,prioridade=" + _prioridade.toString() + ",pquem='" + _pquem + "',equipamento='" + _equipamento+ "',tarefa='" + _tarefa + "' \n"			
				query += " ,usrdata='" + dtoshoje() + "',usrhora='" + time() + "',usrinis='" + m_chinis+ "' Where u_tdlstamp='" + Stamp + "'"			

				//Vou correr o query no servidor
				if (query!==""){
					waitwindow("A guardar o registo !!!");

					CorreNewWs("QueryJson",query,function(json){
						if (json!==""){
							alertify.success("Registo Alterado!!!");
							for(var i in jsonTarefas){ 
								if(jsonTarefas[i].u_tdlstamp===Stamp){
									jsonTarefas[i].datap = _datap;
									jsonTarefas[i].prioridade = _prioridade;
									jsonTarefas[i].pquem = _pquem;
									jsonTarefas[i].equipamento = _equipamento;
									jsonTarefas[i].tarefa = _tarefa;
								}
							}
							linha.removeAttr("modoedicao");			
							linha.addClass("btn-info");
							linha.removeClass("btn-primary");
							linha.attr("title","Alterar");

							linha.find("span").find("i").addClass("fa-edit");
							linha.find("span").find("i").removeClass("fa-floppy-o");
							
							setTimeout(function(){
								jQuery("#tabtdl tr.selected td:nth-child(n) > .podealterar").attr("readonly","");	
								jQuery("#tabtdl tr.selected td:nth-child(n) > div:nth-child(n) .podealterar").attr("readonly","");	
								jQuery("#tabtdl tr.selected td:nth-child(n) > div:nth-child(n) > div:nth-child(n)").addClass("invisible");				
							},10);						
							//atualizagrelha();
							fechawaitwindow();
						}else{
							alertify.error("Erro ao Alterar!!!")
							fechawaitwindow();
						}
					});				
				}
			}	
		}
	},10);
	
}

function editarTodas(){
	$("#tabtdl tbody tr").each(function( index ){
		var Stamp = $(this).find("#bt_alterar").attr("data-stamp");
		var modoedicao = $(this).find("#bt_alterar").attr("modoedicao");
		if ((modoedicao===undefined) || (modoedicao===null)) { 
			$(this).find("#bt_alterar").attr("modoedicao","");
			$(this).find("#bt_alterar").removeClass("btn-info");
			$(this).find("#bt_alterar").addClass("btn-primary");
			$(this).find("#bt_alterar").find("span").find("i").removeClass("fa-edit");
			$(this).find("#bt_alterar").find("span").find("i").addClass("fa-floppy-o");
			$(this).find("#bt_alterar").attr("title","Gravar");

		setTimeout(function(){
				jQuery("#tabtdl tr td:nth-child(n) > .podealterar").removeAttr("readonly");	
				jQuery("#tabtdl tr td:nth-child(n) > div:nth-child(n) .podealterar").removeAttr("readonly");	
				jQuery("#tabtdl tr td:nth-child(n) > div:nth-child(n) .podealterar").removeClass("invisible");				
			},10); 
		}	
	})	
}

function click_btabrir(linha){
	var uStamp = linha.attr("data-stamp");

	if ((uStamp!==undefined) && (uStamp!==null) && (uStamp!=="")){

		waitwindow("A guardar!!")
		
		var query = "Update u_tdl set clfechada = 0,fechada = 0,dataf='19000101',usrdata='" + dtoshoje() + "',usrhora='" + time() + "',usrinis='" + m_chinis+ "' Where u_tdlstamp='" + uStamp + "'"			

		//Vou correr o query no servidor
		if (query!==""){
			waitwindow("A Abrir o registo !!!");

			CorreNewWs("QueryJson",query,function(json){
				if (json!==""){
					alertify.success("Registo Aberto!!!")
					for(var i in jsonTarefas){ 
						if(jsonTarefas[i].u_tdlstamp===uStamp){
							jsonTarefas[i].fechada = "False"
							jsonTarefas[i].clfechada = "False"
							jsonTarefas[i].dataf = "01-01-1900"
						}
					}
					atualizagrelha();
					fechawaitwindow();
				}else{
					alertify.error("Erro ao Abrir!!!")
					fechawaitwindow();
				}
			});				
		}
	}	
	
}

function atualizagrelha(){
	
	limpa_datatable("tabtdl");

	cria_datatable_nova("tabtdl",jsonTarefas,varmyTmptdl,true,10000);								
	
	setTimeout(function(){

		AjustaTabela("tabtdl");	
		
		$(function() {
			var tableContainer = $('.dataTables_scrollBody');
			var table = $("#tabtdl");
			var fakeContainer = $(".large-table-fake-top-scroll-container-3");
			var fakeDiv = $(".large-table-fake-top-scroll-container-3 div");

			var tableWidth = table.width();
			fakeDiv.width(tableWidth);

			fakeContainer.scroll(function() {
				tableContainer.scrollLeft(fakeContainer.scrollLeft());
				$('.fixedHeader-floating').scrollLeft(fakeContainer.scrollLeft());
			});
		  
			$('.dataTables_scrollBody').scroll(function(){
				fakeContainer.scrollLeft(tableContainer.scrollLeft());
				$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
			});		
		})
		
		
	},100)
}

function alterou_Qtd(){
	setTimeout(function(){
		var strqtd = jQuery("#tabtdl tr.selected td:eq(6) input").val();
		console.log(strqtd);
		strqtd = strqtd.toString();
		var qtd = 0;
		try{
			qtd = parseFloat(strqtd);	
			if ((qtd===NaN) || (qtd.toString()==="NaN")){
				qtd = 0;
			}		
		}catch(e){
			qtd = 0;
		}
		jQuery("#tabtdl tr.selected td:eq(6) input").val(qtd.toString());	
	},50)
}

function qtdmenos(){
	setTimeout(function(){
		var strqtd = jQuery("#tabtdl tr.selected td:eq(6) input").val();
		strqtd = strqtd.toString();
		var qtd = parseFloat(strqtd);	

		qtd = qtd - 1;
		if (qtd < 0){
			qtd = 0;
		}
		jQuery("#tabtdl tr.selected td:eq(6) input").val(qtd.toString());	
	},50)
}	

function qtdmais(){
	setTimeout(function(){
		var strqtd = jQuery("#tabtdl tr.selected td:eq(6) input").val();
		strqtd = strqtd.toString();
		var qtd = parseFloat(strqtd);	

		qtd = qtd + 1;
		jQuery("#tabtdl tr.selected td:eq(6) input").val(qtd.toString());	
	},50)
}	

function click_btfechar(linha){
	var uStamp = linha.attr("data-stamp");

	if ((uStamp!==undefined) && (uStamp!==null) && (uStamp!=="")){

		waitwindow("A guardar!!")
		
		var query = "Update u_tdl set clfechada = 1,fechada = 1,dataf='" + dtoshoje() + "',usrdata='" + dtoshoje() + "',usrhora='" + time() + "',usrinis='" + m_chinis+ "' Where u_tdlstamp='" + uStamp + "'"			
		
		//Vou correr o query no servidor
		if (query!==""){
			waitwindow("A Fechar o registo !!!");

			CorreNewWs("QueryJson",query,function(json){
				if (json!==""){
					alertify.success("Registo Fechado!!!")
					for(var i in jsonTarefas){ 
						if(jsonTarefas[i].u_tdlstamp===uStamp){
							jsonTarefas[i].fechada = "True"
							jsonTarefas[i].clfechada = "True"
							jsonTarefas[i].dataf = hoje()
						}
					}
					atualizagrelha();
					fechawaitwindow();
				}else{
					alertify.error("Erro ao Fechar!!!")
					fechawaitwindow();
				}
			});				
		}
	}	
	
}
	
	
// Criar uma nova tarefa, ao clicar em Adicionar
function novaTarefa() {

	var Tarefa = jQuery("#txtImpTarefa").val();
	jQuery("#txtImpTarefa").val("");
	var uStamp = u_Stamp();
	var query			
	
	if ((nocliente===undefined) || (nocliente===null) || (nocliente.toString().trim()==="") || (nocliente.toString().trim()==="0")){
		query = "insert into u_tdl(u_tdlstamp,id,tarefa,status,pquem,datac,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)" + 		
		" Values ('" + uStamp + "',[dbo].[tdlid](0),'" + Tarefa + "','Aberta','" + username + "','" + dtoshoje() + "','" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "')"
	}else{
		query = "insert into u_tdl(u_tdlstamp,id,clstamp,no,nome,tarefa,status,pquem,datac,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)" + 		
		" Select '" + uStamp + "',[dbo].[tdlid](" + nocliente.toString().trim() + "),cl.clstamp,cl.no,cl.nome,'" + Tarefa + "','Aberta','" + username + "','" + dtoshoje() + "'" +
		",'" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "'" +
		" From cl (nolock) Where no=" + nocliente.toString().trim() + " And estab = 0"
	}
	
	if (query!==""){
		waitwindow("A Guardar o registo !!!");

		CorreNewWs("QueryJson",query,function(json){
			if (json!==""){
				alertify.success("Registo guardado!!!")
				guardounovo();
			}else{
				alertify.error("Erro ao guardar!!!")
				fechawaitwindow();
			}
		});				
	}

}

//Se guardou, aplica as funcionalidades ao objecto
function guardounovo(){
	
	refrescarecran();

	fechawaitwindow();
}

jQuery(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();

	//Injeta ModalBox no body
	var uModalBox = "<div id='modalbox'>"
		uModalBox += "	<div class='devoops-modal'>"
		uModalBox += "		<div class='devoops-modal-header'>"
		uModalBox += "			<div class='modal-header-name'>"
		uModalBox += "				<span></span>"
		uModalBox += "			</div>"
		uModalBox += "		</div>"
						
		uModalBox += "		<div class='devoops-modal-inner'>"
		uModalBox += "		</div>"
		uModalBox += "		<div class='devoops-modal-bottom'>"
		uModalBox += "		</div>"
		uModalBox += "	</div>"
		uModalBox += "</div>"

	$( "body" ).append(uModalBox);
	
	pub_numJseCss = 15;
	var dt = new Date();
    dt.setDate(dt.getDate()-30);
		 
	$("#txtdtfecho").val(dt.toISOString().substring(0,10));
	$("#chkfechados").prop('checked', false);
		
	//Carrega a livraria jquery.blockUI
	jQuery.getScript( "../tts/js/plugins/jquery.blockUI.js", function() {
			
		//Aplica novos defaults no blockUI
		jQuery.blockUI.defaults = { 
			title: null,        
			draggable: true,    		 
			theme: false, 		 
			css: { 
				padding:        0, 
				margin:         0, 
				width:          '30%', 
				top:            '40%', 
				left:           '35%', 
				textAlign:      'center', 
				color:          '#fff', 
				border:         '0px solid #aaa', 
				backgroundColor:'#bfbfbf', 
				cursor:         'wait' 
			}, 		 
			themedCSS: { 
				width:  '30%', 
				top:    '40%', 
				left:   '35%' 
			}, 		 
			overlayCSS:  { 
				backgroundColor: '#000', 
				opacity:         0.6, 
				cursor:          'wait' 
			}, 		 
			cursorReset: 'default', 		 
			growlCSS: { 
				width:    '350px', 
				top:      '10px', 
				left:     '', 
				right:    '10px', 
				border:   'none', 
				padding:  '5px', 
				opacity:   0.6, 
				cursor:    null, 
				color:    '#fff', 
				backgroundColor: '#000'
			}, 			 
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank', 
			forceIframe: false, 		 
			baseZ: 2000, 		 
			centerX: true,
			centerY: true, 
			allowBodyStretch: true, 
			bindEvents: true, 
			constrainTabKey: true, 
			fadeIn:  200, 
			fadeOut:  400, 
			timeout: 0, 
			showOverlay: true, 
			focusInput: true, 
			onBlock: null, 
			onUnblock: null, 
			quirksmodeOffsetHack: 4, 
			blockMsgClass: 'blockMsg', 
			ignoreIfBlocked: false 
		}; 
		waitwindow("A carregar ecrã!!");
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});

	//Carrega livrarias DataTables
	jQuery.getScript( "../tts/DataTables/media/js/jquery.dataTables.min.js", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	jQuery.getScript( "../tts/DataTables/media/js/dataTables.jqueryui.min.js", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});	
	jQuery.getScript( "../tts/js/plugins/jquery.textareafullscreen.js", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});	
		
	//Carrega livrarias
	jQuery.getScript( "../tts/js/plugins/jquery.storageapi.js", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	jQuery.getScript( "../tts/js/plugins/jquery-idleTimeout.min.js", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	jQuery.getScript( "../tts/js/plugins/jsviews.js", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});	
	
	jQuery.getScript( "../tts/js/plugins/jquery.qtip.custom/jquery.qtip.js", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});	
		
	//Carrega a livraria jquery-ui
	jQuery.getScript( "../tts/js/plugins/jquery-ui.js", function() {

		//Carrega Widgets da TTS
		jQuery.getScript( "../tts/js/TtsWidget.js?"+pub_versaoapp, function() {
		});
		
		jQuery(".input_date").datepicker({
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
			dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab','Dom'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
			nextText: 'Próximo',
			prevText: 'Anterior'
		});
	
		_numJseCssCarregados = _numJseCssCarregados + 1;
	});

 
	jQuery.getScript( "https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js", function() {
	});
	
	jQuery.getScript( "https://cdn.datatables.net/fixedheader/3.1.5/js/dataTables.fixedHeader.min.js", function() {
	});
	
	//Carrega a livraria da TTS
	jQuery.getScript( "../tts/js/TtsjsPHC.js?"+pub_versaoapp, function() {
		Tts_lerconfiguracoes(function(){
			usercode = getCookie(pub_infologin);
			nocliente = getCookie("login_nocliente");
			
			query = "select username from uscl (nolock) where usercode='" + usercode + "'";

			CorreNewWs("ExecQueryJson",query,function(json){
				if (json!==""){
					validou_us(json);
				}else{
				}
			});				
		
		});

		_numJseCssCarregados = _numJseCssCarregados + 1;
		carrega_css();
	});
	
	setTimeout(function(){
		if (jacorreu===false){
			location.reload(); 	
		}
	},60000);	

});


function validou_us(json){
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].username!=="!#NA#!SEMDADOS"){			
			username = json.TbPhc[i].username;
		}
	}	
}

function carrega_css(){

	var url = window.location.href;
	var n = url.indexOf("programs/genform.aspx?");
	if (n>0){
		url = url.substring(0,n)
	}		
	loadCSS("https://cdn.datatables.net/fixedheader/3.1.5/css/fixedHeader.bootstrap.min.css", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	loadCSS(url+"tts/DataTables/media/css/dataTables.jqueryui.css", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	loadCSS(url+"tts/DataTables/media/css/jquery.dataTables.min.css", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});	
	loadCSS(url+"tts/css/jquery-ui.css", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	loadCSS(url+"tts/css/jquery-ui.structure.css", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	loadCSS(url+"tts/css/tts_dt.css?"+pub_versaoapp, function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});
	
	loadCSS("https://cdn.datatables.net/fixedheader/3.1.5/css/fixedHeader.dataTables.min.css", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});

	loadCSS(url+"tts/css/textareafullscreen.css", function() {
		_numJseCssCarregados = _numJseCssCarregados + 1;
		getUrl();
	});

	arranca_ecra();

}

function refrescarecran(){
	jQuery('#ttsmain').addClass("invisible");
	
	limpa_datatable("tabtdl");

	alterar = true;
	arranca_ecra();	
}


function limpa_filtros(){
	var dt = new Date();
    dt.setDate(dt.getDate()-30);
	
	$("#txtdtfecho").val(dt.toISOString().substring(0,10));
	$("#chkfechados").prop('checked', false);
	
	refrescarecran();

}

function cria_datatable_nova(idtabela,json,_template,procura,numlinhas,colunaordenacao){
	
	if ((procura===undefined) || (procura===null) || (procura==="") || (procura!==false)){
		procura = true;
	}
	if ((numlinhas===undefined) || (numlinhas===null) || (numlinhas==="") || (numlinhas==="0") || (numlinhas===0)){
		numlinhas = 10;
	}
	if ((colunaordenacao===undefined) || (colunaordenacao===null) || (colunaordenacao==="") || (colunaordenacao==="0") || (colunaordenacao===0)){
		colunaordenacao = 0;
	}

	var _tbl = $("#"+idtabela);
	var tblBody = $("tbody", _tbl);

	jQuery.each(json, function (indice, _json) {
		var myTmpl = $.templates(_template);
		var auxnovaLinha = myTmpl.render(_json);
		tblBody.append(auxnovaLinha);	
	});

	var table = jQuery("#"+idtabela).DataTable({
		fixedHeader: {
			headerOffset: 50
		},
        //paging: false,
		destroy: true,
		"searching": procura,
		"language": {
			"paginate": {
							"first": "Primeiro",
							"last": "Último",
							"next": "Seguinte",
							"previous": "Anterior"
						},				
			"emptyTable": "Sem dados",
			"lengthMenu": "Mostra _MENU_ registos por página",
			"zeroRecords": "Sem dados",
			"info": "Mostra página _PAGE_ de _PAGES_",
			"infoEmpty": "Sem dados",	
			"search": "Procurar: _INPUT_"			
		},
		"autoWidth": true,
		"order": [[colunaordenacao,'desc']],
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (( aData[14].toString().toLowerCase().trim() === "true" ) || ( aData[9].toString().toLowerCase().trim() === "true" ))
			{
				$('td', nRow).css('background-color', 'green');
			}
			else if ( aData[5] == "1" )
			{
				$('td', nRow).css('background-color', 'Orange');
			}
		},			
		
		
		stateSave: true,
		dom: 'Bfrtip',
		"scrollX": true,
		buttons: [
			{
				extend:    'copyHtml5',
				text:      '<i class="fa fa-files-o"></i>',
				titleAttr: 'Copy'
			},
			{
				extend:    'excelHtml5',
				text:      '<i class="fa fa-file-excel-o"></i>',
				titleAttr: 'Excel'
			},
			{
				extend:    'csvHtml5',
				text:      '<i class="fa fa-file-text-o"></i>',
				titleAttr: 'CSV'
			},
			{
				extend:    'pdfHtml5',
				text:      '<i class="fa fa-file-pdf-o"></i>',
				titleAttr: 'PDF'
			}
		]	
	});

	table.page.len(numlinhas).draw();		
	
	 jQuery("#" + idtabela + ' tbody').on( 'click', 'tr', function () {
		table.$('tr.selected').removeClass('selected');
		jQuery(this).addClass('selected');
	}); 
		
	$('.dataTables_scrollBody').scroll(function(){
		$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());		
	});
	
	$(function() {
		var tableContainer = $('.dataTables_scrollBody');
		var table = $("#"+idtabela);
		var fakeContainer = $(".large-table-fake-top-scroll-container-3");
		var fakeDiv = $(".large-table-fake-top-scroll-container-3 div");

		var tableWidth = table.width();
		fakeDiv.width(tableWidth);

		fakeContainer.scroll(function() {
			tableContainer.scrollLeft(fakeContainer.scrollLeft());
			$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
		});
	  
		$('.dataTables_scrollBody').scroll(function(){
			fakeContainer.scrollLeft(tableContainer.scrollLeft());
			$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
		});		
	});




/* 


	var table = jQuery("#"+idtabela).DataTable({
		destroy: true,
		"searching": procura,
		"language": {
			"paginate": {
							"first": "Primeiro",
							"last": "Último",
							"next": "Seguinte",
							"previous": "Anterior"
						},				
			"emptyTable": "Sem dados",
			"lengthMenu": "Mostra _MENU_ registos por página",
			"zeroRecords": "Sem dados",
			"info": "Mostra página _PAGE_ de _PAGES_",
			"infoEmpty": "Sem dados",	
			"search": "Procurar: _INPUT_"			
		},
		"autoWidth": true,
		"order": [[colunaordenacao,'desc']],
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (( aData[14].toString().toLowerCase().trim() === "true" ) || ( aData[9].toString().toLowerCase().trim() === "true" ))
			{
				$('td', nRow).css('background-color', 'green');
			}
			else if ( aData[5] == "1" )
			{
				$('td', nRow).css('background-color', 'Orange');
			}
		},		
		stateSave: true,
		dom: 'Bfrtip',
		"scrollX": true,
		buttons: [
			{
				extend:    'copyHtml5',
				text:      '<i class="fa fa-files-o"></i>',
				titleAttr: 'Copy'
			},
			{
				extend:    'excelHtml5',
				text:      '<i class="fa fa-file-excel-o"></i>',
				titleAttr: 'Excel'
			},
			{
				extend:    'csvHtml5',
				text:      '<i class="fa fa-file-text-o"></i>',
				titleAttr: 'CSV'
			},
			{
				extend:    'pdfHtml5',
				text:      '<i class="fa fa-file-pdf-o"></i>',
				titleAttr: 'PDF'
			}
		]	
	});

	table.page.len(numlinhas).draw();		
	
	 jQuery("#" + idtabela + ' tbody').on( 'click', 'tr', function () {
		table.$('tr.selected').removeClass('selected');
		jQuery(this).addClass('selected');
	});  */
};

/* fakeContainer.scroll(function() {
	tableContainer.scrollLeft(fakeContainer.scrollLeft());
	$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
});

$('.dataTables_scrollBody').scroll(function(){
	$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
}); */

function arranca_ecra(){
	
	setTimeout(function(){

		waitwindow("A ler os dados do servidor !!!");

		//Adiciona ao html a ul onde valos carregar as tarefas
		//var modalbox = jQuery('#sumario');
		//modalbox.append("<ul id='myUL'></ul>");
		
		var FiltroFechados = "And fechada = 0"
		//alertify.success("UI");

		uData = $("#txtdtfecho").val().replace("/","").replace("/","").replace(/-/g,"");
		var Fechados = ( jQuery("#chkfechados").is(':checked') ? true : false );
		
		if ((Fechados!==undefined) && (Fechados!==null) && (Fechados===true)){
			FiltroFechados = "And (fechada = 0 Or (fechada = 1 And dataf >= '" + uData + "'))"
		}

		if ((nocliente===undefined) || (nocliente===null) || (nocliente.toString().trim()==="") || (nocliente.toString().trim()==="0")){
			uFiltroCl = "no=no"
		}else{
			uFiltroCl = "no=" + nocliente.toString().trim()			
		}

		//vamos ler as tarefas a BD 
		var query			
		query = "Select *" 
			+	" From u_tdl (nolock) "
			+	" Where " + uFiltroCl 
			+	FiltroFechados
			+	" Order by prioridade desc,id,datac,cast(tarefa as varchar(max))";

		CorreNewWs("ExecQueryJson",query,function(json){

			if (json!==""){
				//Se não deu erro, vamos carregar os dados
				validou_tarefas(json,function(){

					limpa_datatable("tabtdl");
		
					var columnDefsSt = [{ "data": "datac"}
									,{ "data": "datap"}
									,{ "data": "datai"}
									,{ "data": "tecnnm"}
									,{ "data": "status"}
									,{ "data": "prioridade"}
									,{ "data": "tarefa"}
									,{ "data": "obs"}
									,{ "data": "fechada"}
									,{ "data": "clfechada"}
									,{ "data": "dataf"}
									,{ "data": "ststamp"}
									,{ "data": "ststamp"}
									,{ "data": "ststamp"}
									,{ "data": "ststamp"}
								] 

					cria_datatable_nova("tabtdl",jsonTarefas,varmyTmptdl,true,10000);						
					
					setTimeout(function(){

						AjustaTabela("tabtdl");	
						
						$(function() {
							var tableContainer = $('.dataTables_scrollBody');
							var table = $("#tabtdl");
							var fakeContainer = $(".large-table-fake-top-scroll-container-3");
							var fakeDiv = $(".large-table-fake-top-scroll-container-3 div");

							var tableWidth = table.width();
							fakeDiv.width(tableWidth);

							fakeContainer.scroll(function() {
								tableContainer.scrollLeft(fakeContainer.scrollLeft());
								$('.fixedHeader-floating').scrollLeft(fakeContainer.scrollLeft());
							});
						  
							$('.dataTables_scrollBody').scroll(function(){
								fakeContainer.scrollLeft(tableContainer.scrollLeft());
								$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
							});		
						})
						
						
					},100)
	
					
				});
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});	
		
		fechawaitwindow();

	},1000);

}
	
function getUrl(){

	if (_numJseCssCarregados >= pub_numJseCss){
					
		Parameters = {};
		var url = window.location.href;
		var n = url.indexOf("?");
		if (n<=0){
			pub_url = url.replace(pub_app,"");
		}else{
			url = url.substring(0,n)
			pub_url = url.replace(pub_app,"");		
		}	
	}	
}

//Cria novo elemento e aplica as funcionalidades ao novo elemento
function createnewelement(data,tecnico,_status,inputValue,fechada,stamp){
	
	var li = document.createElement("li");
	var t = "";

	var span = document.createElement("SPAN");
	var txt = document.createTextNode(data.replace("/", ".").replace("/", ".").replace(/-/g, ".")+" | ");
	span.className = "";
	span.appendChild(txt);
	li.appendChild(span);

	var span = document.createElement("SPAN");
	var txt = document.createTextNode(tecnico+" | ");
	span.className = "";
	span.appendChild(txt);
	li.appendChild(span);

	var span = document.createElement("SPAN");
	var txt = document.createTextNode(_status+" | ");
	span.className = "";
	span.appendChild(txt);
	li.appendChild(span);
	
	t = document.createTextNode(inputValue);
	//t = document.createTextNode("<span>"+data+"</span><span>"+tecnico+"</span><span>"+inputValue+"</span>");
	li.appendChild(t);
	if (inputValue !== '') {
		document.getElementById("myUL").appendChild(li);
	}
	inputValue = ""

	console.log(fechada);
	
	if (fechada==="true"){
		li.className = "lilista checked";							
	}else{
		li.className = "lilista";											
	}

	var att = document.createAttribute("data-stamp");
	att.value = stamp;
	li.setAttributeNode(att);
	
	var span = document.createElement("SPAN");
	var txt = document.createTextNode("");
	span.className = "close fa fa-trash";
	span.appendChild(txt);
	li.appendChild(span);
	var close = document.getElementsByClassName("close");
	
	//Acrescenta o botão de fechar
	for (i = 0; i < close.length; i++) {
		close[i].onclick = function() {

			var div = this.parentElement;
			var uStamp = div.getAttribute("data-stamp");
			var query			
		
			alertify.confirm("Quer mesmo apagar o registo ?", function (e,str) {
			
				if (e){

					query = "Delete From u_tdl Where u_tdlstamp='" + uStamp + "'"
					
					console.log(query);
					
					if (query!==""){
						waitwindow("A Eliminar o registo !!!");

						CorreNewWs("QueryJson",query,function(json){
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
				}else{
					alertify.error("Cancelado pelo utilizador!!!")
				}
			}, "Apagar Registo");
			
		}
	} 

	var span2 = document.createElement("SPAN");
	var txt2 = document.createTextNode("");
	var edit = document.getElementsByClassName("edit");
	span2.className = "edit fa fa-edit";
	span2.appendChild(txt);
	li.appendChild(span2);

	//Acrescenta o botão de editar
	for (i = 0; i < edit.length; i++) {
		edit[i].onclick = function() {
			var div = this.parentElement;
			var uStr = div.getAttribute("data-stamp");
			console.log(uStr);
		}
	}
}			  

function validou_tarefas(json,callback){
	//console.log(json);
	jsonTarefas = [];
	 
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].u_tdlstamp!=="!#NA#!SEMDADOS"){	
			jsonTarefas.push(json.TbPhc[i]);

			//console.log(json.TbPhc[i].fechada.toLowerCase().trim());
						
			//Cria novo elemento
			//createnewelement(json.TbPhc[i].datac,json.TbPhc[i].tecnnm,json.TbPhc[i].status,json.TbPhc[i].tarefa,json.TbPhc[i].fechada.toString().toLowerCase().trim(),json.TbPhc[i].u_tdlstamp);			
			  
		}
	}	

	//console.log(jsonTarefas);

	//Fecha ecrã de Wait
	fechawaitwindow();
	callback("");
}