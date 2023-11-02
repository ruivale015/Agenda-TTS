// Variáveis Públicas
var pub_app = "tts/analisesphc.html";

var pub_login = "";
var tipo = "";
var ecran = ""; 
var tabela = ""; 
var tabstamp = ""; 
var bdados = ""; 
var url_origem = "";
var documento = $(document);
var pub_EmpFlt = "";
var pub_eadm = "false";
var jsonTema = [];


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

function getCookie(cname) {
	 var name = cname.toLowerCase().trim() + "=";
	 var ca = document.cookie.split(';');
	 for(var i=0; i<ca.length; i++) {
		var c = ca[i].toLowerCase().trim();
		while (c.charAt(0)==' ') c = c.substring(1);
		if(c.indexOf(name) == 0)
		   return c.substring(name.length,c.length);
	 }
	 return "";
}	

function getUrl(){
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

 function load(){
	getUrlParameters();
}

function getUrlParameters(){
	Parameters = {};
	var url   = window.location.search.replace("?", "");
	if (url!==""){
		var ParametersList = url.split("&")
		for(var i = 0; i < ParametersList.length; i++){
			var parameter = ParametersList[i].split("=");
			var mkey = parameter[0];
			var mval = parameter[1];
			Parameters[mkey] = mval;
		}
		FldDataObj(Parameters);
	}
}

function FldDataObj(DataObj){				

	var nomeparametro = ""; 
	for(var mfield in DataObj){
		nomeparametro = mfield.toString().toUpperCase().trim();
		switch(nomeparametro) {
		    case "URLO":
				url_origem = DataObj[mfield].toString();
		        break;
		    default:
		        break;
		} 
	}    
}    

$(document).ready(function() {
	getUrl();
	carregar();
	load();	
});

function carregar(){		
	$.getScript(pub_url+'tts/js/ttsjs.js', function(){
		pub_login = getCookie("intranetlogin_username");
		alert(pub_login);
		
		setTimeout(function(){ 
			
			waitwindow("A ler os dados do servidor !!!");
					
			var query			
			query = "select tema from us (nolock) where usercode='"+pub_login.toString()+"'";
console.log(query);
			CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

				if (json!==""){
					validou_user(json);
				}else{
					alert("Erro ao ler os dados!!");
					fechawaitwindow();
				}
			});
		},200);
		
		valida_Analises_bdados();
	});
}	


function validou_user(json){

	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].tema!=="!#NA#!SEMDADOS"){
			
			var encontro = false;
			for(var j in jsonTema){
				if (jsonTema[j].val == json.TbPhc[i].tema.toString().trim()){
					loadCSS(pub_url+"css/theme-"+jsonTema[j].valor.toString().trim()+".min.css");
					loadCSS(pub_url+"pimages/user"+jsonTema[j].val.toString().trim()+".css");
					encontro = true;
				}
			}
			if (encontro == false){
				loadCSS(pub_url+"css/theme-default.min.css");
				loadCSS(pub_url+"pimages/user1.css");
			}
			//loadCSS(pub_url+"tts/css/tts.css");
		}
	}	

	fechawaitwindow();
	
}
	
var jsonBdados = [];
var query = "";	
var Empresa = "";
var VdEmpresa = "";
var currDate = new Date();
var uAno = currDate.getFullYear();
var jsonAnalises = [];
var jsonGrupo = [];
var jsonVariaveis = [];
var Variaveis = "";
var DescrAn = "";
var CondicoesAn = "";

function valida_Analises_bdados(){

	Validar_Grupos();

}

function Validar_Variaveis_Analises(){
	
	waitwindow("A verificar variáveis!!!");
	
	var Stamp=$("#Analise_cmdAnalise").val();	
	DescrAn=$("#Analise_cmdAnalise option:selected").text();		
	
	if (Stamp!==""){	
		query = "select no,tipo,nome,lordem,tbval from "+pub_bdados+"..usqlv (nolock) where usqlstamp='" + Stamp + "' order by lordem";
		console.log(query);
		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				fechawaitwindow();
				validou_variaveis(json);
			}else{
				alertify.error("Erro ao verificar variáveis!!!");	
				fechawaitwindow();
			}
		});
	}else{
		alertify.error("Tem de escolher uma análise!");		
		fechawaitwindow();
	};	 
}
			
function validou_variaveis(json){
	
	jsonVariaveis = json.TbPhc;
	//console.log(jsonVariaveis);
	//console.log(jsonVariaveis.length);
	
	if ((jsonVariaveis.length===1) & (jsonVariaveis[0].nome==="!#NA#!SEMDADOS")) {
		Variaveis = "";		
		ExecutarAn();
	}else{
		mostra_variaveis();
	}	
}


function mostra_variaveis(){
	$("#analises").html("");
		
	if ( $(".variaveis").length ){
		$( "#variaveis-window-ok" ).trigger('click');	
	}
			
	var uTxtHtml="	<div class='variaveis text-center' style='display: none;'>";
		uTxtHtml+="		<button id='variaveis-window-lanch' class='demo btn btn-primary btn-lg' data-toggle='modal' href='#variaveis-window'></button>";
		uTxtHtml+="	</div>";
		uTxtHtml+="	<div tabindex='-1' class='variaveis modal fade' id='variaveis-window' data-keyboard='true' data-backdrop='static'>";
		uTxtHtml+="		<div class='modal-body'>";
        uTxtHtml+="		<form class='login-form' action='' method='post'>"
		uTxtHtml+="		<div class='form-group'>";
		uTxtHtml+="			<h2><i id='variaveis-window-spinner' class='fa fa-area-chart'></i></h2>" ;
		uTxtHtml+="			<h4>Variáveis</h4>" ;
		uTxtHtml+="			<br>";

		for(var i in jsonVariaveis){ 
			if (jsonVariaveis[i].nome!=="!#NA#!SEMDADOS"){				
				uTxtHtml+="				<div class='row has-feedback'>";
				switch(jsonVariaveis[i].tipo.trim().toUpperCase()) {
					 case "L":
                        uTxtHtml+="                 <div class='col-sm-8 col-sm-offset-4 checkbox'>" 
                        uTxtHtml+="                 	<label>"
                        uTxtHtml+="                     	<input data-render='true' type='checkbox' id='chk" +jsonVariaveis[i].nome+ "' name='chk" +jsonVariaveis[i].nome+ "' class='NewWapp_txt' placeholder='" +jsonVariaveis[i].nome+ "' data-toggle='tooltip' data-placement='top' title='" +jsonVariaveis[i].nome+ "'>" +jsonVariaveis[i].nome 
                        uTxtHtml+="                         <i class='fa fa-square-o small'></i>"
                        uTxtHtml+="                     </label>"
						uTxtHtml+="					</div>"	;
						break;
					 case "N":
						uTxtHtml+="					<label class='col-sm-4 control-label'>"+jsonVariaveis[i].nome+"</label>";
						uTxtHtml+="					<div class='col-sm-4'>";
						uTxtHtml+="						<input type='text' id='txt"+jsonVariaveis[i].nome+"' name='txt"+jsonVariaveis[i].nome+"' value='0.00' class='form-control NewWapp_txt'  pattern='[0-9]' placeholder='"+jsonVariaveis[i].nome+"' data-toggle='tooltip' data-placement='top' title='"+jsonVariaveis[i].nome+"'>";
						uTxtHtml+="					</div>"	;
						break;
					 case "I":
						uTxtHtml+="					<label class='col-sm-4 control-label'>"+jsonVariaveis[i].nome+"</label>";
						uTxtHtml+="					<div class='col-sm-4'>";
						uTxtHtml+="						<input type='text' id='txt"+jsonVariaveis[i].nome+"' name='txt"+jsonVariaveis[i].nome+"' value='0' class='form-control NewWapp_txt'  pattern='[0-9]' placeholder='"+jsonVariaveis[i].nome+"' data-toggle='tooltip' data-placement='top' title='"+jsonVariaveis[i].nome+"'>";
						uTxtHtml+="					</div>"	;
						break;
					 case "D":
						uTxtHtml+="					<label class='col-sm-4 control-label'>"+jsonVariaveis[i].nome+"</label>";
						uTxtHtml+="					<div class='col-sm-4'>";
						uTxtHtml+="						<input type='text' id='txt"+jsonVariaveis[i].nome+"' name='txt"+jsonVariaveis[i].nome+"' value='"+hoje()+"' onkeypress='TeclasDatas(event)' class='datepicker form-control NewWapp_txt'  pattern='(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}' placeholder='"+jsonVariaveis[i].nome+"' data-toggle='tooltip' data-placement='top' title='"+jsonVariaveis[i].nome+"'>";
						uTxtHtml+="					</div>"	;
						break;
					 default:
						uTxtHtml+="					<label class='col-sm-4 control-label'>"+jsonVariaveis[i].nome+"</label>";
						uTxtHtml+="					<div class='col-sm-8'>";
						uTxtHtml+="						<input type='text' id='txt"+jsonVariaveis[i].nome+"' name='txt"+jsonVariaveis[i].nome+"' class='form-control NewWapp_txt' placeholder='"+jsonVariaveis[i].nome+"' data-toggle='tooltip' data-placement='top' title='"+jsonVariaveis[i].nome+"'>";
						uTxtHtml+="					</div>"	;
				 } 				
				uTxtHtml+="				</div>"	;
			}
		}  
		
		//uTxtHtml+="		</div>";
		uTxtHtml+="		</form>";
		uTxtHtml+="		</div>";
		uTxtHtml+="		<div id='variaveis-window-group' class='modal-footer'>";
		uTxtHtml+="			<br>";
		uTxtHtml+="    		<button id='variaveis-novo' type='button' class='btn btn-default btn-label-left' data-dismiss='modal'>";
		uTxtHtml+="        		<span><i class='fa fa-check txt-white'></i></span>";
		uTxtHtml+="        		Executar";
		uTxtHtml+="    		</button>";
		uTxtHtml+="    		<button id='variaveis-window-ok' type='button' class='btn btn-danger btn-label-left' data-dismiss='modal'>";
		uTxtHtml+="        		<span><i class='fa fa-sign-out txt-white'></i></span>";
		uTxtHtml+="        		Fechar";
		uTxtHtml+="    		</button>";
		uTxtHtml+="		</div>";
		uTxtHtml+="</div> ";
		//console.log(uTxtHtml);
		$("#analises").append(uTxtHtml);

		$('.form-control').tooltip();  
			
		$( "#variaveis-window-lanch" ).trigger('click');	
				
		var uObj = document.getElementById('variaveis-novo');
		console.log(uObj);
		uObj.addEventListener('click', TratarVariaveis, false);		
	
}


function Tratar_Variaveis(callback){
	Variaveis = "";
	for(var i in jsonVariaveis){ 
		switch(jsonVariaveis[i].tipo.trim().toUpperCase()) {
			 case "L":
					var uID = "chk" +jsonVariaveis[i].nome
					var txtValor = $("[id='"+uID+"']");					
					var uValor = txtValor.is(':checked');
					if (uValor===true){
						uValor="1"
					}else{
						uValor="0"
					}
					if (Variaveis===""){						
						Variaveis= uValor;
					}else{
						Variaveis= Variaveis+";"+uValor;						
					}
				break;
			 case "N":
					var uID = "txt" +jsonVariaveis[i].nome
					var uValor = $("[id='"+uID+"']").val();					
					if (Variaveis===""){						
						Variaveis= uValor.replace(",",".");
					}else{
						Variaveis= Variaveis+";"+uValor.replace(",",".");						
					}
				break;
			 case "I":
					var uID = "txt" +jsonVariaveis[i].nome
					var uValor = $("[id='"+uID+"']").val();					
					if (Variaveis===""){						
						Variaveis= uValor.replace(",",".");
					}else{
						Variaveis= Variaveis+";"+uValor.replace(",",".");						
					}
				break;
			 case "D":
					var uID = "txt" +jsonVariaveis[i].nome
					var uValor = $("[id='"+uID+"']").val();	
					uValor = uValor.substring(6, 10)+uValor.substring(3, 5)+uValor.substring(0, 2);					
					if (Variaveis===""){						
						Variaveis= uValor;
					}else{
						Variaveis= Variaveis+";"+uValor;						
					}
				break;
			 default:
					var uID = "txt" +jsonVariaveis[i].nome
					var uValor = $("[id='"+uID+"']").val();					
					if (uValor===""){
						uValor= " ";							
					}
					if (Variaveis===""){
						Variaveis= uValor;						
					}else{
						Variaveis= Variaveis+";"+uValor;						
					}
		 } 	
	}
	callback("");
}		

function TratarVariaveis(){
	Tratar_Variaveis(function(){
		ExecutarAn();	
		if ( $(".variaveis").length ){
			$( "#variaveis-window-ok" ).trigger('click');	
		}		
	});
}		

function jsonToTable(json){	
	var Retorno = "";
	var Aux = "";

    for(var numReg in json){ 
        Aux = "<tr>";
        for (var prop in json[numReg]) {
            if (json[numReg].hasOwnProperty(prop)) {
                var uCampo = prop;            
                var valor=eval('json[numReg].' + uCampo) ;

                if (uCampo!=="") {
					Aux += "<td>"+valor+"</td>";
                }                    
            }            
        }
		Retorno += Aux + "</tr>";
	}
	return Retorno;	
}

function ExecutarAn(){

	waitwindow("A chamar os dados!!!");
		
	var Stamp=$("#Analise_cmdAnalise").val();
	var values = { 
			'Key'     : sftkey("MAIN")
			,'Login'     : changeE(pub_login)
			,'Chave'	:changeE("ttt")
			,'StampAnalise'     : changeE(Stamp)
			,'BaseDados'     : changeE(pub_bdados)
			,'Variaveis'     : changeE(Variaveis)
			,'OriVar'     : changeE("xxx")
		};

		CorreWs("CorreAnalise",values,function(json){    
		console.log(json);
		if (json!==""){
			Correu_an(json);
		}else{
			fechawaitwindow(); 
			$('.input_date').datepicker({setDate: new Date()});
			$('.form-control').tooltip();  
			$.datepicker.setDefaults( $.datepicker.regional[ "pt" ] );			
		}
	});   
	
}


function Validar_Grupos(){

	if (pub_eadm.toString().toLowerCase().trim() === "true"){
		CondicoesAn = "";
	}else{
		CondicoesAn = " And (usql.tacesso=0 or usql.tacesso=1 or ";
		CondicoesAn += " ('NULL'<> ";
		CondicoesAn += " (Case When usql.tacesso=2 then ";
		CondicoesAn += " 	isnull((select cast(usercode as char(10)) from "+pub_bdados+"..us us (nolock) where us.userno=usql.userno and us.usercode = '"+pub_login+"'),'NULL') ";
		CondicoesAn += " else ";
		CondicoesAn += " 	(Case When usql.tacesso=4 then ";
		CondicoesAn += " 		isnull((Select top 1 cast(pf.codigo as char(10))";
		CondicoesAn += " 			from "+pub_bdados+"..pf (nolock) ";
		CondicoesAn += " 			left join "+pub_bdados+"..pfu (nolock) on pf.pfstamp = pfu.pfstamp";
		CondicoesAn += " 			left join "+pub_bdados+"..pfg (nolock) on pf.pfstamp = pfg.pfstamp";
		CondicoesAn += " 			where pf.codigo=usql.pfcod";
		CondicoesAn += " 			and (pfu.usstamp in (select usstamp from "+pub_bdados+"..us (nolock) where us.usercode = '"+pub_login+"')";
		CondicoesAn += " 			or pfg.ugstamp in (select ugstamp from "+pub_bdados+"..us (nolock) where us.usercode = '"+pub_login+"'))";
		CondicoesAn += " 			),'NULL')";
		CondicoesAn += " 	else";
		CondicoesAn += " 		'NULL'";
		CondicoesAn += " 	end)";
		CondicoesAn += " end)))";
	}		
		 
	query = "Select Distinct Case when grupo='' then '...Sem grupo' else grupo end as valor from "+pub_bdados+"..usql (nolock) where (idecran='' or temecran=0) " + CondicoesAn;
console.log(query)
	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

	if (json!==""){
		validou_grupos(json);
	}else{
		}
	});

}

function validou_grupos(json){
	jsonGrupo=[];
	
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].valor!=="!#NA#!SEMDADOS"){
			jsonGrupo.push({
				valor: json.TbPhc[i].valor,
				descricao: json.TbPhc[i].valor
			});
		}
	}
		
	var cbGrupo=$("#Analise_cmdGrupo");
	PopularComboVal(cbGrupo,jsonGrupo,"","Seleccionar Grupo...")		
}

var jsonUsql = [];
 
function Validar_Analises(){
		
	var Grupo = $("#Analise_cmdGrupo").val();
	
	if (Grupo==="...Sem grupo"){
		Grupo="";
	}

	if (pub_eadm.toString().toLowerCase().trim() === "true"){
		CondicoesAn = "";
	}else{
		CondicoesAn = " And (usql.tacesso=0 or usql.tacesso=1 or ";
		CondicoesAn += " ('NULL'<> ";
		CondicoesAn += " (Case When usql.tacesso=2 then ";
		CondicoesAn += " 	isnull((select cast(usercode as char(10)) from "+pub_bdados+"..us us (nolock) where us.userno=usql.userno and us.usercode = '"+pub_login+"'),'NULL') ";
		CondicoesAn += " else ";
		CondicoesAn += " 	(Case When usql.tacesso=4 then ";
		CondicoesAn += " 		isnull((Select top 1 cast(pf.codigo as char(10))";
		CondicoesAn += " 			from "+pub_bdados+"..pf (nolock) ";
		CondicoesAn += " 			left join "+pub_bdados+"..pfu (nolock) on pf.pfstamp = pfu.pfstamp";
		CondicoesAn += " 			left join "+pub_bdados+"..pfg (nolock) on pf.pfstamp = pfg.pfstamp";
		CondicoesAn += " 			where pf.codigo=usql.pfcod";
		CondicoesAn += " 			and (pfu.usstamp in (select usstamp from "+pub_bdados+"..us (nolock) where us.usercode = '"+pub_login+"')";
		CondicoesAn += " 			or pfg.ugstamp in (select ugstamp from "+pub_bdados+"..us (nolock) where us.usercode = '"+pub_login+"'))";
		CondicoesAn += " 			),'NULL')";
		CondicoesAn += " 	else";
		CondicoesAn += " 		'NULL'";
		CondicoesAn += " 	end)";
		CondicoesAn += " end)))";
	}		
		 
	query = "select usqlstamp as valor,descricao from "+pub_bdados+"..usql (nolock) where (idecran='' or temecran=0) and grupo='" + Grupo + "'" + CondicoesAn;

	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

	if (json!==""){
		validou_analises(json);
	}else{
		}
	});

}

var jsonUsql = [];
 
function validou_analises(json){
	jsonUsql=[];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].valor!=="!#NA#!SEMDADOS"){
			jsonUsql.push({
				valor: json.TbPhc[i].valor,
				descricao: json.TbPhc[i].descricao
			});
		}
	}
		
	var cbAna=$("#Analise_cmdAnalise");
	PopularComboVal(cbAna,jsonUsql,"","Seleccionar Análise...");
		
}

documento.on("change", "#Analise_cmdGrupo", function () {
	Validar_Analises();
	$("#Analise_cmdAnalise").html("");	
});

documento.on("click", "#btGrupo", function () {
	Validar_Analises();
	$("#Analise_cmdAnalise").html("");	
});

documento.on("change", "#Analise_cmdAnalise", function () {
	Validar_Variaveis_Analises();
});

documento.on("click", "#btCorrer", function () {
	Validar_Variaveis_Analises();
});
				  
function Correu_an(json){

	$('#analise').html("");
	console.log(json);
	//console.log(json.TbPHC.length.toString().trim());
	
	try {
		if (json.TbPHC.length>0){
			var uStrHtml = "<div id='an_divtblAn' class='col-sm-12 box-content no-padding table-responsive'>";
				uStrHtml += "<table id='an_tblAn' class='display' cellspacing='0' width='100%'>";
				uStrHtml += "<thead>";
				uStrHtml += "<tr>";
					
			var colunas = [];
					
			for(var i in json.TbDic){ 
				if(json.TbDic[i].campo!=="!#NA#!SEMDADOS"){		
					if (json.TbDic[i].tipo === "N") {
						colunas.push({
							data:json.TbDic[i].campo.toLowerCase()
							,render: $.fn.dataTable.render.number( ',', '.', 2, '' )
							,className: "dt-head-center dt-body-right" 
						});						
					}else{
						colunas.push({
							data:json.TbDic[i].campo.toLowerCase()
						});												
					}					
					uStrHtml += "<th>"+json.TbDic[i].campo+"</th>";  
				}
			}	

			uStrHtml += "</tr>";
			uStrHtml += "</thead>";
			uStrHtml += "<tfoot>";
			uStrHtml += "</tfoot>";
			uStrHtml += "<tbody>";
			
			uStrHtml += jsonToTable(json.TbPHC);	
			
			uStrHtml += "</tbody>";
			uStrHtml += "</table>";
			uStrHtml += "</div>";		

			$('#analise').append(uStrHtml);
			
			var table = $('#an_tblAn').DataTable({
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
				"columns": colunas,				
				"scrollX": true,
				stateSave: true,
				dom: 'Bfrtip',
				buttons: [
					{
						extend:    'copyHtml5',
						text:      '<i class="fa fa-files-o"></i>',
						titleAttr: 'Copy',
						title:  DescrAn
					},
					{
						extend:    'excelHtml5',
						text:      '<i class="fa fa-file-excel-o"></i>',
						titleAttr: 'Excel',
						title:  DescrAn
					},
					{
						extend:    'csvHtml5',
						text:      '<i class="fa fa-file-text-o"></i>',
						titleAttr: 'CSV',
						title:  DescrAn
					},
					{
						extend:    'pdfHtml5',
						text:      '<i class="fa fa-file-pdf-o"></i>',
						titleAttr: 'PDF',
						title:  DescrAn
					}
				]				
			});
		}else{
			alertify.error("Não retornou valores!");
		}
	}catch (e) { // non-standard
		alertify.error("Não retornou valores!");
	}
				
	fechawaitwindow(); 
}