//*******************************************************************
//** JavaScript para o ecrã Detalhe de tarefas
//** 
//** Criado por: Rui Vale  
//** Criado em : 20.11.2018
//*******************************************************************

//*******************************************************************
//** VARIÁVEIS
//*******************************************************************

var documento = jQuery(document);

var pub_app = "";
var pub_urlws = "";
var pub_url = "";
var usercode = "";
var username = "";
var userno = "";
var userinis = "";
var pub_versaoapp= "";
var pub_bdados = "";
var pub_bdadosphc = "";
var pub_infologin = ""
var mnAutologout = 30;
var mnCookiesLogin = 480;					
var pub_mnAutologout = 30;
var pub_mnCookiesLogin = 480;
var pub_numJseCss = 0;
var validadecookies = 1;
var _numJseCssCarregados = 0;
var _jsPHCok = false;
var datahora = dtoshoje() + time().replace(/[:]/g,"");
var numerotentativas = 0;
var _paRegNum = 0;
pub_versaoapp = datahora;

var tecnico = "";
var tecnnm = "";
var refmo = "";
var _mxstamp = "";
var _qtdhoras = 0.00;
var _Serie = "";
var _nopat = "";
var diasorcamento = 0;
var diasprevistos = 0;
var diasreais = 0;
var saldoop = 0;
var saldopr = 0;
var saldoor = 0;
	
var query = "";
var jsonProjeto = [];
var jsonQuem = [];
var jsonSubProc = []; 
var jsonFase = [];
var jsonMaoObra = [];
var Tecnicos = [];
var jsonomh = [];
var jsonrh = [];
var jsonttapa = [];

var uObra = "9#9#9#9#9#9#9#9#9#9#9#9#9#9#9#";
var alterar = false;
var horasdia = 0.00;
var horaslancadas = 0.00;
var horasold = 0.00;
var a_query=[];

var jacorreu = false;
var jacorreu2 = false;
var _divtblhtml = $('#divtabPats').html();
var _tblpats = $("#tabPats");
var tblBody = $("tbody", _tblpats);
var _ColDef = [];
var abrepama = false;

//*******************************************************************
//** FUNÇÕES GERAIS
//*******************************************************************

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

/* _ColDef = [{
	"width": "5%",
	"targets": 0,	
	"data": "status",
	"render": function (data, type) {
		var img = "";
		if (data.toString().toLowerCase().trim() === "true"){
			img = '../pimages/bul2.gif'
		}else{
			img = '../pimages/bul4.gif'							
		};
		return type === 'display' ? '<img src="'+img+'">' : data;
	}
  }
] */		

//*******************************************************************
//** TEMPLATES DATATABLES
//*******************************************************************

var varmyTmpltpo = '<tr data-type="tpo" class="{{:(nivel.toString().trim()==="1" ? "nivel1" : "nivel0")}} {{:(status.toString().toLowerCase().trim()==="2.em curso" ? "emcurso" : "")}} {{:(status.toString().toLowerCase().trim()==="9.fechado" ? "fechado" : "")}}">'
		+ '<td class="center">'
		+ '		<div id="bt_alterar" onclick="click_btalterar(jQuery(this))" class="bt_alterar btn btn-primary btn-sm bt_small {{:(nivel.toString().trim()==="1" ? "invisible" : "default")}}" data-stamp="{{:ttapastamp}}">'
		+ '			<span><i class="fa fa-edit txt-default"></i></span>'
		+ '		</div>'
		+ '</td>'
		+ '<td class="center">'
		+ '		<div id="bt_apagar" onclick="click_btapagar(jQuery(this))" class="bt_apagar btn btn-danger btn-sm bt_small {{:(nivel.toString().trim()==="1" ? "invisible" : "default")}}" data-stamp="{{:ttapastamp}}">'
		+ '			<span><i class="fa fa-trash-o txt-default"></i></span>'
		+ '		</div>'
		+ '</td>'
		+ '<td>{{:ordem}}</td>'
		+ '<td>{{:fase}}</td>'
		+ '<td>{{:u_area}}</td>'
		+ '<td>{{:tarefa}}</td>'
		+ '<td>{{:passo}}</td>'
		+ '<td>{{:grupo}}</td>'
		+ '<td>{{:status}}</td>'
		+ '<td>{{:pctreal}}</td>'
		+ '<td>{{:responsavel}}</td>'
		+ '<td>{{:u_dtpini}}</td>'
		+ '<td>{{:u_dtpfim}}</td>'
		+ '<td>{{:horcbase}}</td>'		
		+ '<td>{{:dcbase}}</td>'		
		+ '<td>{{:hprev}}</td>'		
		+ '<td>{{:dprev}}</td>'		
		+ '<td class="center">'
		+ '		<div id="bt_hl" onclick="click_bt_hl(jQuery(this))" class="bt_hl btn btn-primary btn-sm bt_small default {{:(hreal.toString().trim()==="0,00" ? "invisible" : "")}} {{:(nivel.toString().trim()==="1" ? "invisible" : "")}}" data-stamp="{{:ttapastamp}}">{{:hreal}}'
		+ '		</div>'
		+ '		<p class="{{:(hreal.toString().trim()!=="0,00" ? "invis" : "p")}}{{:(nivel.toString().trim()!=="1" ? "ible" : "p")}}">{{:hreal}}</p>'
		+ '</td>'
		+ '<td>{{:dreal}}</td>'		
		+ "<td style='display:none;'>{{:ttastamp}}</td>"
		+ "</tr>";


var varmyTmplrh = "";

var varmyTmplrgmo = '<tr data-type="rgmo" class="{{:(status.toString().toLowerCase().trim()==="2.em curso" ? "emcurso" : "")}} {{:(status.toString().toLowerCase().trim()==="9.fechado" ? "fechado" : "")}}">'
			+ '<td>'
			+ '		<select data-campo="cmbstatus" data-value="{{:ttapastamp}}" id="cmbstatus" value="" name="cmbstatus" class="form-control" placeholder="Status" data-toggle="tooltip" data-placement="top" title="Status">'
			+ '			<option value="">Selecione Status...</option>'
			+ '			<option value="1.Aberto">1.Aberto</option>'
			+ '			<option value="2.Em curso">2.Em curso</option>'
			+ '			<option value="9.Fechado">9.Fechado</option>'
			+ '		</select>'
			+'</td>'
			+ '<td>'
			+ '		<select data-campo="cmbexec" data-value="{{:ttapastamp}}" id="cmbExec" value="Selecione Status" name="cmbExec" class="form-control" placeholder="% Execução" data-toggle="tooltip" data-placement="top" title="% Execução">'
			+ '			<option value="0">Selecione %...</option>'
			+ '			<option value="0">0</option>'
			+ '			<option value="5">5</option>'
			+ '			<option value="10">10</option>'
			+ '			<option value="15">15</option>'
			+ '			<option value="20">20</option>'
			+ '			<option value="25">25</option>'
			+ '			<option value="30">30</option>'
			+ '			<option value="35">35</option>'
			+ '			<option value="40">40</option>'
			+ '			<option value="45">45</option>'
			+ '			<option value="50">50</option>'
			+ '			<option value="55">55</option>'
			+ '			<option value="60">60</option>'
			+ '			<option value="65">65</option>'
			+ '			<option value="70">70</option>'
			+ '			<option value="75">75</option>'
			+ '			<option value="80">80</option>'
			+ '			<option value="85">85</option>'
			+ '			<option value="90">90</option>'
			+ '			<option value="95">95</option>'
			+ '			<option value="100">100</option>'
			+ '		</select>'
			+'</td>'
			+ '<td>'
			+ '		<div data-role="fieldcontain" class="ui-field-contain">	'
			+ ' 		<div id="btQtdmenos" data-theme="a" class="bt_qtdmenos btQtd btn btn-default btn-sm bt_small" data-stamp="{{:ststamp}}"><span><i class="fa fa-minus"></i></span></div>'
			+ '			<input type="numeric" name="Qtd" id="Qtd" class="Qtd" value="{{:qtt}}" data-campo="qtt">'
			+ '			<div id="btQtdmais" data-theme="a" class="bt_qtdmais btQtd btn btn-default btn-sm bt_small" data-stamp="{{:ststamp}}"><span><i class="fa fa-plus"></i></span></div>'
			+ ' 	</div>'
			+ '</td>'
			+ '<td>{{:fase}}</td>'
			+ '<td>{{:tarefa}}</td>'
			+ '<td>{{:resumo}}</td>'
			+ '<td style="width: 200px;"><textarea data-campo="txtdescricao" rows="5" id="txtdescricao" class="form-control" placeholder="Descrição">{{:descricao}}</textarea></td>'
			+ '<td data-campo="ttapastamp" style="display:none;">{{:ttapastamp}}</td>'


//*******************************************************************
//** CÓDIGO PARA O ARRANQUE DO ECRÃ
//*******************************************************************
	
jQuery(document).ready(function() {
	
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

function arranca_ecra(){
	
	setTimeout(function(){
		if ((_jsPHCok===true) && (pub_bdados!=="") && (_numJseCssCarregados >= pub_numJseCss)){
			
			jQuery("#txtdataini").val(dthoje());
			jQuery("#txtdatafim").val(dthoje());
			
			query = "select tecnico,tecnnm,username,userno,iniciais from us (nolock) where usercode='" + usercode + "'";

			CorreNewWs("ExecQueryJson",query,function(json){
				if (json!==""){
					validou_us(json);
				}else{
				}
			});	


		}else{
			if (((_jsPHCok===false) || (pub_bdados==="") || (_numJseCssCarregados < pub_numJseCss)) && (numerotentativas < 10)){
				numerotentativas = numerotentativas + 1;
				Tts_lerconfiguracoes();
				arranca_ecra();		
			}			
			if (((_jsPHCok===false) || (pub_bdados==="") || (_numJseCssCarregados < pub_numJseCss)) && (numerotentativas >= 10)){
				location.reload(); 				
			}			
		}
	},500);
}

function validou_us(json){
	jacorreu = true;
	
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].tecnnm!=="!#NA#!SEMDADOS"){			
			tecnico = json.TbPhc[i].tecnico;
			tecnnm = json.TbPhc[i].tecnnm;
			username = json.TbPhc[i].username;
			userno = json.TbPhc[i].userno;
			userinis = json.TbPhc[i].iniciais;
			//console.log(userno);
			
			varmyTmplrh = '<tr data-type="rh"  class="{{:(status.toString().toLowerCase().trim()==="2.em curso" ? "emcurso" : "")}} {{:(status.toString().toLowerCase().trim()==="9.fechado" ? "fechado" : "")}}">'
						+ '<td class="center">'
						+ '		<div id="bt_rhalterar" onclick="click_bt_alterar_rh(jQuery(this))" class="btn btn-primary btn-sm bt_small {{:(noresp.toLowerCase().trim()!=="' + userno.toLowerCase().trim() + '" ? "invisible" : "default")}}" data-stamp="{{:u_ttartstamp}}">'
						+ '			<span><i class="fa fa-edit txt-default"></i></span>'
						+ '		</div>'
						+ '</td>'
						+ '<td class="center">'
						+ '		<div id="bt_apagar" onclick="click_bt_apagar_rh(jQuery(this))" class="bt_apagar btn btn-danger btn-sm bt_small {{:(noresp.toLowerCase().trim()!=="' + userno.toLowerCase().trim() + '" ? "invisible" : "default")}}" data-stamp="{{:u_ttartstamp}}">'
						+ '			<span><i class="fa fa-trash-o txt-default"></i></span>'
						+ '		</div>'
						+ '</td>'
						+ '<td>{{:data}}</td>'
						+ '<td>{{:responsavel}}</td>'		
						+ '<td>{{:horas}}</td>'		
						+ '<td>{{:fase}}</td>'
						+ '<td>{{:tarefa}}</td>'
						+ '<td>{{:passo}}</td>'
						+ '<td>{{:descricao}}</td>'
						+ '<td>{{:status}}</td>'
						+ '<td>{{:pexec}}</td>'
						+ "<td style='display:none;'>{{:u_ttartstamp}}</td>"
						+ "</tr>";
		}
	}	

	query = "select distinct tpod,tpod as value from tpo (nolock) where fechado=0 order by 1"

	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_projetos(json);
		}else{
		}
	});	

	query = "Select cm4.cm,cm4.cmdesc,ltrim(rtrim(cm4.cmdesc))+'.'+ltrim(rtrim(cast(cm4.cm as char(10)))) as value  From cm4 (nolock) Where cm4.inactivo = 0  and cm4.u_nagenda = 0 Order by cm4.cmdesc "

	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_cm4(json);
		}else{
		}
	});	

}

function validou_cm4(json){
	
	Tecnicos=[];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){			
			Tecnicos.push(json.TbPhc[i]);	
		}
	}			
}

function validou_projetos(json){
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].tpod!=="!#NA#!SEMDADOS"){			
			jsonProjeto.push(json.TbPhc[i]);			
		}else{
			jsonProjeto.push();						
		}
	}	
	arranque_ecran();
}
		

function arranque_ecran(){
	
	waitwindow("A ler dados!!!");
	
	var query = "";

	//var datai = jQuery("#txtdataini").val().toString().replace(/[-]/g,"");
	//var dataf = jQuery("#txtdatafim").val().toString().replace(/[-]/g,"");
	var projeto = jQuery("#txtprojeto").val();
	uObra = projeto;
	var responsavel = jQuery("#txtresponsavel").val();
	var sominhas = ( jQuery("#chkSoMinhas").is(':checked') ? true : false );
	var soabertas = ( jQuery("#chkEmAberto").is(':checked') ? true : false );
		
	query = "Select tta.tfad as fase,tta.u_area"
	query += "		,tta.resumo as tarefa"
	query += "		,tta.grupo"
	query += "		,cast('' as varchar(120)) as passo"
	query += "		,1 as nivel"
	query += "		,cast(0 as bit) as aberto	"
	query += "		,tta.status"
	query += "		,tta.pctreal"
	query += "		,tta.usnaresp as responsavel"
	query += "		,tta.U_HORCBASE as horcbase"
	query += "		,Cast(tta.U_HORCBASE/8 as numeric(10,2)) as dcbase"
	query += "		,tta.hprev"
	query += "		,Cast(tta.hprev/8 as numeric(10,2)) dprev"
	query += "		,tta.hreal"
	query += "		,Cast(tta.hreal/8 as numeric(10,2)) dreal"
	query += "		,(case when year(tta.U_DTPINI)=1900 then '' else CONVERT(char(10),tta.U_DTPINI,120) end) as u_dtpini"
	query += "		,(case when year(tta.U_DTPFIM)=1900 then '' else CONVERT(char(10),tta.U_DTPFIM,120) end) as u_dtpfim"
	query += "		,tpo.tpostamp"
	query += "		,isnull(tfa.tfastamp,'') as tfastamp"
	query += "		,tta.ttastamp as ttastamp"
	query += "		,cast('' as varchar(25)) as ttapastamp"
	query += "		,tpo.U_DTPREVAR,datediff(dd,tpo.U_DTPREVAR,getdate()) as falta"
	query += "		,tpo.tpod,tpo.HREAL as TOTHREAL,tpo.HPREV as tothprev"
	query += "		,tta.u_lordem as ordem"
	query += "	from tta (nolock)  "
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp  "

	if ((projeto!==undefined) && (projeto!==null) && (projeto!=="")){
		query += "	left join tfa (nolock) on tta.tfastamp=tfa.tfastamp  "
		query += "	Where tpo.tpod= '" + projeto + "' "
	}else{
		query += "	inner join tfa (nolock) on tta.tfastamp=tfa.tfastamp  "
		query += "	Where 1=2 "		
	}
	if ((responsavel!==undefined) && (responsavel!==null) && (responsavel!=="")){
		query += "	And tta.usnaresp ='" + responsavel + "'"
	}
	if ((sominhas!==undefined) && (sominhas!==null) && (sominhas===true)){
		query += "	And tta.usnaresp ='" + username + "'"
	}
	if ((soabertas!==undefined) && (soabertas!==null) && (soabertas===true)){
		query += "	And tta.fechado=0"
	}
	
	query += "	union all"
	query += "	Select tta.tfad as fase,ttapa.u_area"
	query += "		,tta.resumo as tarefa"
	query += "		,tta.grupo"
	query += "		,TTAPA.resumo as passo"
	query += "		,2 as nivel"
	query += "		,cast(0 as bit) as aberto"
	query += "		,TTAPA.status"
	query += "		,ttapa.u_pexec pctreal"
	query += "		,ttapa.usnaresp as responsavel"
	query += "		,0 as horcbase"
	query += "		,0 as dcbase"
	query += "		,TTAPA.hprev"
	query += "		,Cast(TTAPA.hprev/8 as numeric(10,2)) dprev"
	query += "		,TTAPA.hreal"
	query += "		,Cast(TTAPA.hreal/8  as numeric(10,2)) dreal"
	query += "		,(case when year(TTAPA.U_DTPINI)=1900 then '' else CONVERT(char(10),TTAPA.U_DTPINI,120) end) as u_dtpini"
	query += "		,(case when year(TTAPA.U_DTPFIM)=1900 then '' else CONVERT(char(10),TTAPA.U_DTPFIM,120) end) as u_dtpfim"
	query += "		,tpo.tpostamp"
	query += "		,isnull(tfa.tfastamp,'') as tfastamp"
	query += "		,isnull(tta.ttastamp,'') as ttastamp"
	query += "		,TTAPA.TTAPAstamp as TTAPAstamp"
	query += "		,tpo.U_DTPREVAR,datediff(dd,tpo.U_DTPREVAR,getdate()) as falta"
	query += "		,tpo.tpod,tpo.HREAL as TOTHREAL,tpo.HPREV as tothprev"
	query += "		,ttapa.u_lordem as ordem"
	query += "	from TTAPA(nolock) "
	query += "	inner join tta (nolock) on TTAPA.ttastamp = tta.ttastamp"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp "

	if ((projeto!==undefined) && (projeto!==null) && (projeto!=="")){
		query += "	left join tfa (nolock) on tta.tfastamp=tfa.tfastamp  "
		query += "	Where tpo.tpod= '" + projeto + "' "
	}else{
		query += "	inner join tfa (nolock) on tta.tfastamp=tfa.tfastamp  "
		query += "	Where 1=2 "		
	}
	if ((responsavel!==undefined) && (responsavel!==null) && (responsavel!=="")){
		query += "	And ttapa.usnaresp ='" + responsavel + "'"
	}
	if ((sominhas!==undefined) && (sominhas!==null) && (sominhas===true)){
		query += "	And ttapa.usnaresp ='" + username + "'"
	}
	if ((soabertas!==undefined) && (soabertas!==null) && (soabertas===true)){
		query += "	And ttapa.fechado=0"
	}
	
	query += "	order by Ordem,Fase,Tarefa,Passo" 

	//console.log(query);
	CorreNewWs("ExecQueryJson",query,function(json){
	//console.log(json);
		if (json!==""){
			validou_frm(json);
		}else{
			fechawaitwindow(); 
			jQuery('.input_date').datepicker({setDate: new Date()});
			  
		}
	});
}

function validou_frm(json){
	carregadados_prj(json,function(){
		ler_registohoras();
	}); 
}

function carregadados_prj(json,callback){

	jsonMaoObra = [];
	_paRegNum = 0;
	diasorcamento = 0;
	diasprevistos = 0;
	diasreais = 0;
	saldoop = 0;
	saldopr = 0;
	saldoor = 0;
	
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].ttastamp!=="!#NA#!SEMDADOS"){
			if (json.TbPhc[i].nivel===2){
				diasprevistos = diasprevistos + parseFloat(json.TbPhc[i].dprev.replace(",","."));
				diasreais = diasreais + parseFloat(json.TbPhc[i].dreal.replace(",","."));
			}
			if (json.TbPhc[i].nivel===1){
				diasorcamento = diasorcamento + parseFloat(json.TbPhc[i].dcbase.replace(",","."));
			}			
			jsonMaoObra.push(json.TbPhc[i]);
		}else{
			jsonMaoObra.push();          
		}
	}   

	saldoop = (diasorcamento - diasprevistos);
	saldopr = (diasprevistos - diasreais);
	saldoor = (diasorcamento - diasreais);

	jQuery("#txtdiasorc").val(diasorcamento.toFixed(2));
	jQuery("#txtdiasprev").val(diasprevistos.toFixed(2));
	jQuery("#txtdiasreais").val(diasreais.toFixed(2));
	jQuery("#txtsaldoop").val(saldoop.toFixed(2));
	if (saldoop < 0){
		jQuery("#txtsaldoop").css("color", "red");		
	}else{
		jQuery("#txtsaldoop").css("color", "darkgreen");				
	}
	jQuery("#txtsaldopr").val(saldopr.toFixed(2));
	if (saldopr < 0){
		jQuery("#txtsaldopr").css("color", "red");		
	}else{
		jQuery("#txtsaldopr").css("color", "darkgreen");				
	}
	jQuery("#txtsaldoor").val(saldoor.toFixed(2));
	if (saldoor < 0){
		jQuery("#txtsaldoor").css("color", "red");		
	}else{
		jQuery("#txtsaldoor").css("color", "darkgreen");				
	}

	 
	callback("");     		
}	

function click_btapagar(linha){
	alertify.confirm("Quer mesmo apagar o registo ?", function (e,str) {		
		if (e){
			var Stamp = linha.attr("data-stamp");

			waitwindow("A eliminar o registo !!!");			
			
			query = "Delete From ttapa Where ttapastamp='" + Stamp + "'"
			CorreNewWs("QueryJson",query,function(json){
				if (json!==""){
					alertify.success("Registo Eliminado!!!");
					refrescarecran();
				}else{
					alertify.error("Erro ao eliminar o registo!!!");
				}
			});	
			return;
		}else{
			alertify.error("Cancelado pelo utilizador!!!");
			return;
		}
	}, "Eliminar registo");
}	

function click_btalterar(linha){
	var Stamp = linha.attr("data-stamp");
	//console.log(Stamp);
	
	query = "	Select tta.tfad as fase"
	query += "		,tta.resumo as tarefa"
	query += "		,tpo.tpod as processo"	
	query += "		,tpo.tpod as processo"	
	query += "		,convert(char(10),ttapa.dini,120) dtini	"
	query += "		,convert(char(10),ttapa.dfim,120) dtfim "
	query += "		,convert(char(10),ttapa.u_dtpini,120) dtpini "
	query += "		,convert(char(10),ttapa.u_dtpfim,120) dtpfim "
	query += "		,convert(char(10),ttapa.u_dtinclu,120) dtinclu "
	query += "		,ttapa.*"
	query += "	from ttapa (nolock) "
	query += "	inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp "
	query += "	Where ttapa.ttapastamp = '" + Stamp + "' "
	//console.log(query);

	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_ttapa(json);
		}else{
		}
	});
	
}
	
function validou_ttapa(json){
	carregadados_ttapa(json,function(){
		abre_ecra_tarefas();
	}); 
}

function carregadados_ttapa(json,callback){

	jsonttapa = [];

	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].ttapastamp!=="!#NA#!SEMDADOS"){
			jsonttapa.push(json.TbPhc[i]);
		}else{
			jsonttapa.push();          
		}
	}   
	
	callback("");     		
}	
	
function ler_registohoras(){
	var responsavel = jQuery("#txtresponsavel").val();
	var sominhas = ( jQuery("#chkSoMinhas").is(':checked') ? true : false );
	var soabertas = ( jQuery("#chkEmAberto").is(':checked') ? true : false );

	query = "	Select convert(char(10),u_ttart.data,120) data"
	query += "		,u_ttart.horas,u_ttart.status,u_ttart.pexec"
	query += "		,tta.tfad as fase"
	query += "		,tta.resumo as tarefa"
	query += "		,ttapa.resumo as passo"
	query += "		,ttapa.descricao"
	query += "		,ttapa.usnaresp as responsavel"
	query += "		,ttapa.usnoresp as noresp"
	query += "		,u_ttart.u_ttartstamp"
	query += "	from u_ttart"
	query += "	inner join ttapa (nolock) on ttapa.ttapastamp = u_ttart.ttapastamp"
	query += "	inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp "

	if ((uObra!==undefined) && (uObra!==null) && (uObra!=="")){
		query += "	Where tpo.tpod= '" + uObra + "' "
	}else{
		query += "	Where 1=2 "		
	}
	if ((responsavel!==undefined) && (responsavel!==null) && (responsavel!=="")){
		query += "	And ttapa.usnaresp ='" + responsavel + "'"
	}
	if ((sominhas!==undefined) && (sominhas!==null) && (sominhas===true)){
		query += "	And ttapa.usnaresp ='" + username + "'"
	}
	//if ((soabertas!==undefined) && (soabertas!==null) && (soabertas===true)){
	//	query += "	And ttapa.fechado=0"
	//}

	query += "	order by u_ttart.data,ttapa.usnaresp"	

	//console.log(query);
	
	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			console.log(json);
			validou_rh(json);
		}else{
		}
	});
}

function validou_rh(json){
	carregadados_rh(json,function(){
		renderiza_Ecran();
	}); 
}

function carregadados_rh(json,callback){

	jsonrh = [];
	
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].u_ttartstamp!=="!#NA#!SEMDADOS"){
			jsonrh.push(json.TbPhc[i]);
		}else{
			jsonrh.push();          
		}
	}   
	
	callback("");     		
}	


function cria_datatablehff(idtabela,json,_template,procura,numlinhas,colunaordenacao){
	
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
		var table = $("#tabmo");
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
	})
}

/* fakeContainer.scroll(function() {
	tableContainer.scrollLeft(fakeContainer.scrollLeft());
	$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
});

$('.dataTables_scrollBody').scroll(function(){
	$('.fixedHeader-floating').scrollLeft($(this).scrollLeft());
});
 */
function renderiza_Ecran(){	

	jQuery('#tabmo').removeClass("invisible");
	jQuery('#tabhr').removeClass("invisible");

	cria_datatablehff("tabmo",jsonMaoObra,varmyTmpltpo,true,25000,2);
	cria_datatable("tabhr",jsonrh,varmyTmplrh,true,15,2);

	jQuery('#globalSearch').addClass("invisible");
	jQuery('#ttsmain').removeClass("invisible");
	
	fechawaitwindow(); 

	var columnsProj = [{name: 'Projeto',valueField: 'tpod'}];
	
	$("#txtprojeto").ttsautocomplete({
		showHeader: false,
		columns: columnsProj,		
		source: jsonProjeto,
		select: function(event, ui) {
			$('#txtprojeto').val(ui.item.tpod);
			uObra = ui.item.tpod;
			refrescarecran();
			return false;
        }
	});

	var columnsTecn = [{name: 'Tecnico',valueField: 'cmdesc'}];
	
	$("#txtresponsavel").ttsautocomplete({
		showHeader: false,
		columns: columnsTecn,		
		source: Tecnicos,
		select: function(event, ui) {
			$('#txtresponsavel').val(ui.item.cmdesc);
			return false;
        }
	});
	
	jQuery('.ui-autocomplete').removeClass("ui-corner-all");
		 
	setTimeout(function(){
		AjustaTabela("tabmo");
		var table = $("#tabmo").dataTable();

		//new $.fn.dataTable.FixedHeader(table);
			
		$(function() {
			var tableContainer = $('.dataTables_scrollBody');
			var table = $("#tabmo");
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
		})
		
		AjustaTabela("tabhr");
		
		
	},100)

	jQuery('.input_date').datepicker({setDate: new Date()});
	  	
}
		
//*******************************************************************
//** CÓDIGO PARA OS BOTÕES DO ECRÃ
//*******************************************************************

jQuery('#tabdadoshl').on('click', function(){

	jQuery('.nav-tabs a[href="#dadoshl"]').tab('show');	
	setTimeout(function(){
		AjustaTabela("tabhr");
	},100)
			
});	
	
documento.on("click", ".btRefrescar", function () {
	refrescarecran();
});


documento.on("click", ".btTeste", function () {
	
	var dia = new Date();
	var ano = jsonrh[0].data.substring(0, 4)
	var mes = parseInt(jsonrh[0].data.substring(5, 7))-1
	var mdia = jsonrh[0].data.substring(8, 10)
	var diareg = new Date(ano,mes.toString(),mdia); 

	var t2 = dia.getTime();
	var t1 = diareg.getTime();
	var difdia = parseInt((t2-t1)/(24*3600*1000));
	//console.log(difdia);
		
});

function limpa_filtros(){

	jQuery("#txtprojeto").val("");
	uObra = "";
	jQuery("#txtresponsavel").val("");
	jQuery("#chkSoMinhas").prop('checked', false);
	jQuery("#chkEmAberto").prop('checked', false);
	jQuery("#cmbStatus").val("");
	jQuery("#cmbTipo").val("");
	
	refrescarecran();

}

function refrescarecran(){
	jQuery('#ttsmain').addClass("invisible");
	
	limpa_datatable("tabmo");
	limpa_datatable("tabhr");

	alterar = true;
	arranque_ecran();	
}
	
documento.on("click", "#btIntroduzir", function () {

	abre_ecra_registo();

});
	
documento.on("click", "#btCriaInt", function () {

	criar_intervencao()

});

//*******************************************************************
//** CÓDIGO PARA O ECRÃ DE TAREFAS
//*******************************************************************

 function abre_ecra_tarefas(){
	 
	var form = jQuery('<form id="event_form">'+
		'	<div class="form-group has-success has-feedback">'+
		'		</div>' + 	
	
		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Projeto :</label>'+
		'				<div class="col-lg-5 col-sm-4 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtlprojeto" name="txtlprojeto" value="' + jsonttapa[0].processo + '" class="form-control input-sm" placeholder="Projeto" data-toggle="tooltip" data-placement="top" title="Projeto" readonly>'+
		'				</div>	'+
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Tarefa :</label>'+
		'				<div class="col-lg-5 col-sm-4 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtltarefa" name="txtltarefa" value="' + jsonttapa[0].tarefa + '" class="form-control input-sm" placeholder="Tarefa" data-toggle="tooltip" data-placement="top" title="Tarefa" readonly>'+
		'				</div>	'+
		'			</div>' + 	

		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Status :</label>'+
		'				<div class="col-lg-5 col-sm-4 col-xs-9 control-label autocomplete">'+
		'					<select data-campo="status" data-value="' + jsonttapa[0].status + '" id="cmblstatus" value="" name="cmblstatus" class="form-control" placeholder="Status" data-toggle="tooltip" data-placement="top" title="Status">'+
		'						<option value="">Selecione Status...</option>'+
		'						<option ' + (jsonttapa[0].status.toLowerCase().trim()==="1.aberto" ? "selected" : "") + ' value="1.Aberto">1.Aberto</option>'+
		'						<option ' + (jsonttapa[0].status.toLowerCase().trim()==="2.em curso" ? "selected" : "") + ' value="2.Em curso">2.Em curso</option>'+
		'						<option ' + (jsonttapa[0].status.toLowerCase().trim()==="9.fechado" ? "selected" : "") + ' value="9.Fechado">9.Fechado</option>'+
		'						</select>'+
		'				</div>	'+
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Área :</label>'+
		'				<div class="col-lg-5 col-sm-4 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtarea" name="txtarea" value="' + jsonttapa[0].u_area + '" class="form-control input-sm" placeholder="Área" data-toggle="tooltip" data-placement="top" title="Área" readonly>'+
		'				</div>	'+
		'			</div>' + 	

		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Resumo :</label>'+
		'				<div class="col-lg-5 col-sm-4 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtlresumo" name="txtlresumo" value="' + jsonttapa[0].resumo + '" class="form-control input-sm" placeholder="Resumo" data-toggle="tooltip" data-placement="top" title="Resumo">'+
		'				</div>	'+
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Respons. :</label>'+
		'				<div class="col-lg-5 col-sm-4 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtlresponsavel" name="txtlresponsavel" value="' + jsonttapa[0].usnaresp + '" class="form-control input-sm" placeholder="Responsável" data-toggle="tooltip" data-placement="top" title="Responsável">'+
		'				</div>	'+
		'			</div>' + 	

		
		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Data Ini.:</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="date" id="txtdataini" name="txtdataini" value="' + jsonttapa[0].dtini + '" class="form-control input-sm _input_date" placeholder="Data Início" data-toggle="tooltip" data-placement="top" title="Data Início" readonly>'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Hora Ini.:</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="time" id="txthoraini" name="txthoraini" value="' + jsonttapa[0].hini + '" class="form-control input-sm _input_date" placeholder="Hora Início" data-toggle="tooltip" data-placement="top" title="Hora Início" readonly>'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Data Fim:</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="date" id="txtdatafim" name="txtdatafim" value="' + jsonttapa[0].dtfim + '" class="form-control input-sm _input_date" placeholder="Data Fim" data-toggle="tooltip" data-placement="top" title="Data Fim" readonly>'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Hora Fim:</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="time" id="txthorafim" name="txthorafim" value="' + jsonttapa[0].hfim + '" class="form-control input-sm _input_date" placeholder="Hora Fim" data-toggle="tooltip" data-placement="top" title="Hora Fim" readonly>'+
		'				</div>'+	
		'			</div>' + 	

		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Dt Ini Prev</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="date" id="txtdatainicprev" name="txtdatainicprev" value="' + jsonttapa[0].dtpini + '" class="form-control input-sm _input_date" placeholder="Data Início Previsto" data-toggle="tooltip" data-placement="top" title="Data Início Previsto">'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Dt Fim Prev</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="date" id="txtdatafimprev" name="txtdatafimprev" value="' + jsonttapa[0].dtpfim + '" class="form-control input-sm _input_date" placeholder="Data Fim Previsto" data-toggle="tooltip" data-placement="top" title="Data Fim Previsto">'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Dt Inclus.</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="date" id="txtdatainclus" name="txtdatainclus" value="' + jsonttapa[0].dtinclu + '" class="form-control input-sm _input_date" placeholder="Data Inclusão" data-toggle="tooltip" data-placement="top" title="Data Inclusão" readonly>'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 col-sm-offset-1 control-label titulobig pull-right"></label>'+
		'			</div>' + 	

		'			<div class="row has-feedback">'+
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Descrição :</label>'+
		'				<div class="col-lg-8 col-sm-6 col-xs-3 control-label autocomplete">'+
		'					<textarea rows="3" id="txtdescricao" class="form-control" placeholder="Descrição">'+ jsonttapa[0].descricao +'</textarea>'+
		'				</div>	'+
		'				<label class="col-lg-1 col-sm-2 col-xs-3 col-sm-offset-1 control-label titulobig pull-right"></label>'+
		'			</div>' + 	

		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Hr Previst.</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="numeric" id="txthorasprev" name="txthorasprev" value="' + jsonttapa[0].hprev + '" class="form-control input-sm" placeholder="Horas Previstas" data-toggle="tooltip" data-placement="top" title="Horas Previstas">'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Hr Reais</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="numeric" id="txthorasreais" name="txthorasreais" value="' + jsonttapa[0].hreal + '" class="form-control input-sm" placeholder="Horas Reais" data-toggle="tooltip" data-placement="top" title="Horas Reais" readonly>'+
		'				</div>'+	
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">% Exec.</label>'+
		'				<div class="col-lg-2 col-sm-4 col-xs-9 control-label">'+
		'					<input type="text" id="txtExecucao" name="txtExecucao" value="' + jsonttapa[0].u_pexec + '" class="form-control input-sm _input_date" placeholder="% Execução" data-toggle="tooltip" data-placement="top" title="% Execução" readonly>'+
		'				</div>'+	
		'			</div>' + 	
			
		'		</div>'+
		'	</div>'+
		'</form>');
		
		var buttons = jQuery('<div class="pull-right">'+
						'<button id="event_duplicar" class="btn btn-primary btn-label-left">'+
						'<span><i class="fa fa-paste txt-default"></i></span>'+
						' Duplicar'+							
						'</button>'+																
						'<button id="event_guardar" class="btn btn-primary btn-label-left">'+
						'<span><i class="fa fa-save txt-default"></i></span>'+
						' Guardar'+							
						'</button>'+																
						'<button id="event_apagar" class="btn btn-danger btn-label-left">'+
						'<span><i class="fa fa-trash txt-default"></i></span>'+
						' Apagar'+							
						'</button>'+																
						'</div>');

	OpenModalBox('Tarefas', form, buttons);

	var columnsTecn = [{name: 'Tecnico',valueField: 'cmdesc'}];
	
	$("#txtlresponsavel").ttsautocomplete({
		showHeader: false,
		columns: columnsTecn,		
		source: Tecnicos,
		select: function(event, ui) {
			$('#txtlresponsavel').val(ui.item.cmdesc);
			return false;
        }
	});

	jQuery('.ui-autocomplete').removeClass("ui-corner-all");

	jQuery('#event_apagar').on('click', function(){
		alertify.confirm("Quer mesmo apagar o registo ?", function (e,str) {		
			if (e){
				var Stamp = jsonttapa[0].ttapastamp;

				waitwindow("A eliminar o registo !!!");			
				
				query = "Delete From ttapa Where ttapastamp='" + Stamp + "'"
				CorreNewWs("QueryJson",query,function(json){
					if (json!==""){
						alertify.success("Registo Eliminado!!!");
						CloseModalBox();
						refrescarecran();						
					}else{
						alertify.error("Erro ao eliminar o registo!!!");
					}
				});	
				return;
			}else{
				alertify.error("Cancelado pelo utilizador!!!");
				CloseModalBox();
			}
		}, "Eliminar registo");
	});
				
	jQuery('#event_duplicar').on('click', function(){
		var horasprev = $('#txthorasprev').val();
		var valhrprev = parseFloat(horasprev);
		var horasprevact = jsonttapa[0].hprev;
		var valhrprevact = parseFloat(horasprevact);
		
		if (valhrprev >= valhrprevact){
			alertify.error("As horas previstas não podem ser superiores ou iguais às originais!");
			return
		}else{
			alertify.confirm("Quer mesmo duplicar o registo ?", function (e,str) {		
				if (e){		
					var stamp = jsonttapa[0].ttapastamp;
					
					waitwindow("A guardar!!");
					
					query = "update ttapa set hprev=" + (valhrprevact-valhrprev).toString().replace(",",".") 
					query += " Where ttapastamp = '" + stamp + "'"
					
					//console.log(query);
					
					CorreNewWs("QueryJson",query,function(json){

						if (json!==""){
							duplica_registo(function(semerro){
								if (semerro===true){
									alertify.success("Dados guardados!!");
									CloseModalBox();
									refrescarecran();									
								}else{
									alertify.error("Erro a guardar, verifique!!");	
									query = "update ttapa set hprev=" + valhrprevact.toString().replace(",",".") 
									query += " Where ttapastamp = '" + stamp + "'"
																		
									CorreNewWs("QueryJson",query,function(json){
									});
								}
							});
						}else{
							alertify.error("Erro a guardar, verifique!!");							
						}
					});
					return;
				}else{
					alertify.error("Cancelado pelo utilizador!!!");
				}
			}, "Guardar registo");	
		}	
	});	
			
	function duplica_registo(callback){
		var dtpini = $('#txtdatainicprev').val().toString().replace(/[-]/g,"");
		var dtpfim = $('#txtdatafimprev').val().toString().replace(/[-]/g,"");
		var responsavel = $('#txtlresponsavel').val();
		var resumo = $('#txtlresumo').val();
		var descricao = $('#txtdescricao').val();
		var horasprev = $('#txthorasprev').val();
		var auxstatus = $('#cmblstatus').val();
		var stamp = jsonttapa[0].ttapastamp;
				
		query = "insert into ttapa (apriv,ccontrolo,coddiv,descricao,dfecho,dfim,dini,div,dlimite,dopen,estab,fechado,hfecho,hfim,hini"
		query += "	,hopen,hprev,hreal,marcada,nadia,no,nome,ousrdata,ousrhora,ousrinis,pucliente,resumo,status,tagenda,tdar,tdastamp"
		query += "	,tipo,tpod,tpoid,tpostamp,ttaid,ttapastamp,ttar,ttastamp,u_area,u_dtinclu,u_dtpfim,u_dtpini,u_lordem,u_pexec"
		query += "	,usnafecho,usnaopen,usnaresp,usnofecho,usnoopen,usnoresp,usrdata,usrhora,usrinis)"
		query += " Select apriv,ccontrolo,coddiv,'" + descricao + "','19000101',dfim,dini,div,dlimite,dopen,estab,0,'',hfim,hini"
		query += "		,hopen," + horasprev.replace(",",".") + ",hreal,marcada,nadia,no,nome,cast(getdate() as date),convert(char(5),getdate(),108),'" + userinis + "',pucliente,'" + resumo + "','1.Aberto',tagenda,tdar,tdastamp"
		query += "		,tipo,tpod,tpoid,tpostamp,ttaid,'" + u_Stamp() + "',ttar,ttastamp,u_area,cast(getdate() as date),'" + dtpfim + "','" + dtpini + "',u_lordem,0"
		query += "		,usnafecho,'" + username + "','" + responsavel + "',usnofecho"
		query += "		,isnull((select userno from us (nolock) where username = '" + username + "'),0)"
		query += "		,isnull((select userno from us (nolock) where username = '" + responsavel + "'),0)"
		query += "		,cast(getdate() as date),convert(char(5),getdate(),108),'" + userinis + "'"		
		query += " From ttapa (nolock)"
		query += " Where ttapastamp = '" + stamp + "'"
		
		//console.log(query);
		
		CorreNewWs("QueryJson",query,function(json){

			if (json!==""){
				callback(true)
			}else{
				callback(false)
			}
		});
	}	
	
	jQuery('#event_guardar').on('click', function(){	
		var dtpini = $('#txtdatainicprev').val().toString().replace(/[-]/g,"");
		var dtpfim = $('#txtdatafimprev').val().toString().replace(/[-]/g,"");
		var responsavel = $('#txtlresponsavel').val();
		var descricao = $('#txtdescricao').val();
		var resumo = $('#txtlresumo').val();
		var horasprev = $('#txthorasprev').val();
		var auxstatus = $('#cmblstatus').val();
		var stamp = jsonttapa[0].ttapastamp;
		
		waitwindow("A guardar!!");
		
		query = "update ttapa set usnaresp='" + responsavel + "',resumo='" + resumo + "'"
		query += ",usnoresp=isnull((select userno from us (nolock) where username = '" + responsavel + "'),0)"
		query += ",u_dtpini='" + dtpini + "',u_dtpfim='" + dtpfim+ "',descricao='" + descricao + "'"
		query += ",hprev=" + horasprev.replace(",",".") + ",status='" + auxstatus + "'"
		query += " Where ttapastamp = '" + stamp + "'"
		
		//console.log(query);
		
		CorreNewWs("QueryJson",query,function(json){

			if (json!==""){
				alertify.success("Dados guardados!!");
				CloseModalBox();
				refrescarecran();
			}else{
				alertify.error("Erro a guardar, verifique!!");							
			}
		});
	});	
	
	
	jQuery('#event_cancel').on('click', function(){
		CloseModalBox();
	});	
	
	fechawaitwindow(); 
 }	















//*******************************************************************
//** CÓDIGO PARA O ECRÃ DE REGISTO
//*******************************************************************

 function abre_ecra_registo(){
	 
	var soleitura = "";
	var totlinhas = 0;
	var linha = 0;

	var form = jQuery('<form id="event_form">'+
		'	<div class="form-group has-success has-feedback">'+
		'		</div>' + 	
	
		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Projeto :</label>'+
		'				<div class="col-lg-5 col-sm-10 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtlprojeto" name="txtlprojeto" class="form-control input-sm" placeholder="Projeto" data-toggle="tooltip" data-placement="top" title="Projeto">'+
		'				</div>	'+
		'			</div>' + 	

		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Data :</label>'+
		'				<div class="col-lg-2 col-sm-3 col-xs-9 control-label">'+
		'					<input type="date" id="txtdata" name="txtdata" class="form-control input-sm _input_date" placeholder="Data" data-toggle="tooltip" data-placement="top" title="Data">'+
		'				</div>'+	
		'				<label id="horaslc" class="col-lg-4 col-sm-4 col-xs-9 col-sm-offset-3 control-label titulobig pull-right"></label>'+
		'				<div class="col-sm-3 col-xs-12 _checkbox">'+
		'					<label>'+
		'						<input type="checkbox" id="chkFechadas" name="chkFechadas" class="chkinvfiltro" placeholder="Mostra Tarefas Fechadas" data-toggle="tooltip" data-placement="top" title="Mostra Tarefas Fechadas"> Mostra Tarefas Fechadas ?'+
		'						<!--<i class="fa fa-square-o small"></i>-->'+
		'					</label>'+
		'				</div>'+
		'			</div>' + 	

		'			<div class="row">'+	
		'				<div class="btn-group ">'+
		'					<a accesskey="G" class="btn btn-primary saveReleasePersist btn-block" data-mainpagebutton="base" data-tooltip="true" id="btActualizar" title="Actualizar"><span class="fa fa-search"></span></a>'+
		'				</div>'+
		'			</div>'+
			
		'			<br>'+
		'			<div class="row has-feedback">'+		
		'				<div class="row has-feedback">'+
		'					<table cellspacing="0" class="table table-striped table-bordered nowrap" id="tabrgmo" width="100%">'+
		'						<thead>'+ 
		'							<tr>'+
		'								<th>Status</th>'+
		'								<th>% Execução</th>'+
		'								<th>Horas</th>'+
		'								<th>Fase</th>'+
		'								<th>Tarefa</th>'+
		'								<th>Passo</th>'+
		'								<th>Descricao</th>'+
		'								<th data-campo="ttapastamp" style="display:none;">ttapastamp</th>'+
		'							</tr>'+
		'						</thead>'+
		'						<tbody>'+	

		'						</tbody>'+
		'					</table>'+
		'				</div>'+
		'			</div>'+


		'		</div>'+
		'	</div>'+
		'</form>');
		
		var buttons = jQuery('<div class="pull-right">'+
						'<button id="event_guardar" class="btn btn-primary btn-label-left">'+
						'<span><i class="fa fa-pencil txt-default"></i></span>'+
						' Guardar'+							
						'</button>'+																
						'</div>');

	OpenModalBox('Registar Horas', form, buttons);

	$("#txtdata").val(dthoje());					
	$("#txtlprojeto").val(uObra);					
	
	if ((uObra!==undefined) && (uObra!==null) && (uObra!=="")){
		actualizar();
	}
			
	var columnsObra = [{name: 'Projeto',valueField: 'tpod',minWidth: '250px'}];
	
	$("#txtlprojeto").ttsautocomplete({
		showHeader: false,
		columns: columnsObra,		
		source: jsonProjeto,
		select: function(event, ui) {
			$('#txtlprojeto').val(ui.item.tpod);
			actualizar();

			return false;
        }
	});
	
	jQuery('.ui-autocomplete').removeClass("ui-corner-all");

	cria_datatable("tabrgmo",jsonomh,varmyTmplrgmo,true,jsonomh.length);

		
	jQuery('#event_guardar').on('click', function(){	
		var dataaux = $('#txtdata').val().toString();
			
		alertify.confirm("<div style='color:red;'>ATENÇÃO:</div> - A Data dos registos é <b>" + dataaux + "</b>, confirma a gravação ?", function (e,str) {		
			if (e){
				var processo = $('#txtlprojeto').val();
				var data = $('#txtdata').val().toString().replace(/[-]/g,"");
				var tabela = $('#tabrgmo');
				var status = "";
				var descr = "";
				var exec = "";
				var qtt = "";
				var ttapastamp = "";
				
				waitwindow("A guardar!!");
				//Vou calcular o nº de linhas a guardar (com base na qtd) 
				tabela.find('tr').each(function (rowIndex, r) {
					if (rowIndex!==0){
						$(this).find('th,td').each(function (colIndex, c) {
							ValorElemento($(this),"qtt",function(_nqtt){
								try{
									qtt = _nqtt.toString();	
									nqtt = parseFloat(qtt);
									if ((nqtt!==NaN) && (nqtt.toString()!=="NaN")){
										qtt = nqtt.toString();								
									}else{
										qtt = "0";
										nqtt = 0;
									} 
								}catch(ex){
									qtt = "0";
									nqtt = 0;
								}
							})
						});
					
						if (nqtt!==0){
							totlinhas = totlinhas + 1;
						}
					}
				});
				a_query=[];
				
				tabela.find('tr').each(function (rowIndex, r) {
					if (rowIndex!==0){
						$(this).find('th,td').each(function (colIndex, c) {
							
							ValorElemento($(this),"ttapastamp",function(_ttapastamp){
								ttapastamp = _ttapastamp;					
							})
							ValorElemento($(this),"cmbstatus",function(_status){
								status = _status;					
							})
							ValorElemento($(this),"cmbexec",function(_exec){
								exec = _exec;					
							})
							ValorElemento($(this),"txtdescricao",function(_descr){
								descr = _descr;					
							})
							ValorElemento($(this),"qtt",function(_nqtt){
								try{
									qtt = _nqtt.toString();	
									nqtt = parseFloat(qtt);
									if ((nqtt!==NaN) && (nqtt.toString()!=="NaN")){
										qtt = nqtt.toString();								
									}else{
										qtt = "0";
										nqtt = 0;
									} 
								}catch(ex){
									qtt = "0";
									nqtt = 0;
								}					
							})			
						});
					
						if (qtt!=="0"){
							
							if (status===""){
								alertify.error("Tem de preencher o Status!!")
								return
							}
							if ((exec==="") || (exec==="0")){
								alertify.error("Tem de preencher a % Execução!!")
								return
							}
							
							query = "Insert into u_ttart (u_ttartstamp,ttapastamp,data,horas,dias,pexec,status,fechado,descr)"
							query += "values (left('"+rowIndex.toString().trim()+"'+replace(newid(),'-',''),25),'" + ttapastamp + "','" + data + "'," + qtt + "," + qtt + "/8,'" + exec + "','" + status + "'," + (exec.toString().trim()==="100" ? "1" : "0") + ",'" + descr + "')" 

							a_query.push(query);
							
						}	
					}
				});
				guarda_lancamento();
				return;
			}else{
				alertify.error("Cancelado pelo utilizador!!!");
				return;
			}
		}, "Guardar registo");
		
	});	
	
	function guardar_lancamento(numreg) {
		setTimeout(function(){
			var d = new Date();
			query = a_query[numreg];
			//console.log(d);
			//console.log(query);
			
			CorreNewWs("QueryJson",query,function(json){
				if (json!==""){
					alertify.success("Dados guardados!!");
					termina_introducao();
				}else{
					linha = linha + 1;
					alertify.error("Erro a guardar, verifique!!");
					termina_introducao();							
				}
			});
		},numreg*500);
	}

	function guarda_lancamento(){
		for(var i in a_query){ 
			guardar_lancamento(i);
		}
	}
	
	function termina_introducao(){
		linha = linha + 1;
		
		if (linha===totlinhas){
			fechawaitwindow(); 		
			CloseModalBox();	
			refrescarecran();			
		}
	}
	
	jQuery('#event_cancel').on('click', function(){
		CloseModalBox();
	});			
	
	jQuery('#txtlprojeto').on('change', function(){
		processo = $('#txtlprojeto').val();
		actualizar();
	});	

	jQuery('#txtdata').on('change', function(){
		processo = $('#txtlprojeto').val();
		var data = $('#txtdata').val().toString().replace(/[-]/g,"");
		var fechadas = ( jQuery("#chkFechadas").is(':checked') ? true : false );

		verificar_horas(processo,data,fechadas);
	});	
	
	jQuery('#btActualizar').on('click', function(){
		actualizar();
	});			
	
	function actualizar(){
		processo = $('#txtlprojeto').val();
		var data = $('#txtdata').val().toString().replace(/[-]/g,"");
		var fechadas = ( jQuery("#chkFechadas").is(':checked') ? true : false );

		verificar_fases(processo,fechadas);
		verificar_horas(processo,data);
	}
		
	setTimeout(function(){
		AjustaTabela("tabrgmo");
	},10)
					
	fechawaitwindow(); 
 }	

function criar_intervencao(){
	var projeto = jQuery("#txtprojeto").val();
	if ((projeto===undefined) || (projeto===null) || (projeto==="")){
		alertify.error("Tem de escolher um projeto!!");
	}else{
	
		var datai = dthoje();
		var horai = "09:00";
		var horaf = "18:00";
		var horadesc = "00:00"
		if ((horai==="09:00") && (horaf==="18:00")){
			horadesc = "01:00"
		}
		uTipo = "1.Projecto";
		
		var form = $('<form id="event_form">'+
			'<div class="form-group has-success has-feedback">'+
			'</div>'+
			'<div class="row has-feedback">'+
			'<label class="col-lg-2 col-sm-2 control-label">Data:</label>'+
			'<div class="col-lg-2 col-sm-3">'+
			'<input maxlength="8" size="8" type="date" id="newevent_data" name="newevent_data" value="'+ datai +'" class="form-control NewWapp_txt"  placeholder="Data" data-toggle="tooltip" data-placement="top" title="Data">'+
			'</div>'+
			'</div>'+
			'<br/>'+
			'<div class="row has-feedback">'+
			'<label class="col-lg-2 col-sm-2 control-label">Hora Inicio:</label>'+
			'<div class="col-lg-2 col-sm-2">'+
			'<input maxlength="8" size="8" type="time" id="newevent_horai" name="newevent_horai" value="'+ horai +'" class="form-control NewWapp_txt"  placeholder="Hora Inicio" data-toggle="tooltip" data-placement="top" title="Hora Inicio">'+
			'</div>'+
			'<label class="col-lg-2 col-sm-2 control-label">Hora Fim:</label>'+
			'<div class="col-lg-2 col-sm-2">'+
			'<input maxlength="8" size="8" type="time" id="newevent_horaf" name="newevent_horaf" value="'+ horaf +'" class="form-control NewWapp_txt"  placeholder="Hora Fim" data-toggle="tooltip" data-placement="top" title="Hora Fim">'+
			'</div>'+
			'<label class="col-lg-2 col-sm-2 control-label hidden-lg">Tempo desc.:</label>'+
			'<label class="col-lg-2 col-sm-2 control-label hidden-sm">Tempo descontar:</label>'+
			'<div class="col-lg-2 col-sm-2">'+
			'<input maxlength="8" size="8" type="time" id="newevent_horadesc" name="newevent_horadesc" value="'+ horadesc +'" class="form-control NewWapp_txt"  placeholder="Tempo descontar" data-toggle="tooltip" data-placement="top" title="Tempo descontar">'+
			'</div>'+
			'</div>'+
			'<br/>'+
			'<div class="row has-feedback">'+
			'<label class="col-sm-2 control-label">Relatório :</label>'+
			'</div>'+
			'<div class="row has-feedback">'+
			'<div class="col-sm-12">'+
			'<textarea rows="8" id="newevent_relatorio" class="form-control" placeholder="Relatório" readonly></textarea>'+
			'</div>'+
			'</div>'+

			'</form>');
				
			var buttons = $('<div class="pull-right">'+
							'<button id="event_guardar" class="btn btn-primary btn-label-left">'+
							'<span><i class="fa fa-save txt-default"></i></span> '+
							'Guardar'+
							'</button>' +
							'</div>');
				
		ler_registomx(projeto,datai);
		
		function ler_registomx(projeto,data){
			query = "	select mx.mxstamp,mx.hinicio,mx.hfim"
			query += "		,isnull((select  COALESCE("
			query += "					(select '-Resumo: '+ltrim(rtrim(ttapa.resumo)) + char(13)+char(10)"
			query += "						+ '  -Área: '+ltrim(rtrim(ttapa.u_area)) + char(13)+char(10)"
			query += "						+ Case when cast(u_ttart.descr as varchar(max))<>'' "
			query += "							then '    ' + replace(ltrim(rtrim(cast(u_ttart.descr as varchar(max)))),char(10),char(10)+'    ') else '' end + char(13)+char(10) AS [text()]"
			query += "					 from u_ttart (nolock)"
			query += "					 inner join ttapa (nolock) on ttapa.ttapastamp = u_ttart.ttapastamp"
			query += "					 inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp"
			query += "					 Where tta.tpod = '" + projeto + "'"
			query += "					 and u_ttart.data = '" + data.replace(/[-]/g,"") + "'"
			query += "					 and ttapa.usnaresp = '" + username + "'"
			query += "					 ORDER BY u_ttart.data"
			query += "					 FOR XML PATH(''), TYPE).value('.[1]', 'VARCHAR(MAX)'), '') AS rel"
			query += "	),'') relatorio"
			query += "		,isnull((select sum(u_ttart.horas) qtdhoras"
			query += "					from u_ttart (nolock)"
			query += "					inner join ttapa (nolock) on ttapa.ttapastamp = u_ttart.ttapastamp"
			query += "					inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp"
			query += "					Where tta.tpod = '" + projeto + "'"
			query += "					and u_ttart.data = '" + data.replace(/[-]/g,"") + "'"
			query += "					and ttapa.usnaresp = '" + username + "'"
			query += "				),0) qtdhoras"
			query += "	from mx (nolock)" 
			query += "	inner join fref on fref.fref = mx.u_fref "
			query += "	where ltrim(rtrim(fref.fref)) + '-'+ ltrim(rtrim(fref.nmfref)) = '" + projeto + "'"
			query += "	and mx.data = '" + data.replace(/[-]/g,"") + "'"
			query += "	and tecnico=" + tecnico

			console.log(query);
			
			CorreNewWs("ExecQueryJson",query,function(json){
				if (json!==""){
					validou_mx(json);
				}else{
				}
			});
		}
		
		function validou_mx(json){
			for(var i in json.TbPhc){ 
				if(json.TbPhc[i].mxstamp!=="!#NA#!SEMDADOS"){
					_qtdhoras = parseFloat(json.TbPhc[i].qtdhoras);
					_mxstamp = json.TbPhc[i].mxstamp;
					var horai = json.TbPhc[i].hinicio;
					var horaf = json.TbPhc[i].hfim;
					if ((horai==="09:00") && (horaf==="18:00")){
						horadesc = "01:00"
					}else{
						horadesc = "00:00"						
					}
					jQuery("#newevent_horai").val(horai);
					jQuery("#newevent_horaf").val(horaf);
					jQuery("#newevent_horadesc").val(horadesc);
					jQuery("#newevent_relatorio").html(json.TbPhc[i].relatorio);
				}else{
					alertify.error("Não foram encontradas marcações!!");
					_mxstamp = "";
					_qtdhoras = 0;
					jQuery("#newevent_horai").val("00:00");
					jQuery("#newevent_horaf").val("00:00");
					jQuery("#newevent_horadesc").val("00:00");
					jQuery("#newevent_relatorio").html("");
				}
			}
		}
		
		OpenModalBox('Intervenção', form, buttons);

		$('#event_cancel').on('click', function(){
			CloseModalBox();
		});
					
		$('#newevent_data').on('change', function(){
			var data = jQuery("#newevent_data").val();
			ler_registomx(projeto,data);
		});

		 function Valida_Cria_Pat(){
			var projeto = jQuery("#txtprojeto").val();
			waitwindow("A ler intervenção!!!");

			var query			
			query = "select mx.u_mhstamp,mh.data,mh.hora,mh.horaf,mh.ptipo,mh.mhtipo,mh.nopat"
			query += " ,left(CONVERT(VARCHAR, DATEADD(SECOND, mh.tdh * 3600, '00:00:00'), 108),5) tempodesc,relatorio,pa.fechado "
			query += " from mx (nolock) "
			query += " inner join mh (nolock) on mx.u_mhstamp=mh.mhstamp ";
			query += " inner join pa (nolock) on mh.nopat=pa.nopat ";
			query += " where mx.mxstamp='" + _mxstamp + "'";

			console.log(query);
			CorreNewWs("ExecQueryJson",query,function(json){

				if (json!==""){
					fechawaitwindow();
					validou_mh(json);
				}else{
					alertify.error("Erro ao ler os dados!!");
					fechawaitwindow();
				}
			})		
		}

		function validou_mh(json){	
			for(var i in json.TbPhc){ 
				if(json.TbPhc[i].u_mhstamp!=="!#NA#!SEMDADOS"){
					if (json.TbPhc[i].fechado.toString().trim().toLowerCase()==="true"){
						alertify.error("O PAT já está fechado!!!")
					}else{
						alertify.error("Já existe relatório, deve ser alterado pela agenda!!!")
					}
				}else{
					guarda_criacao_pat();
				}
			}
		}

		function guarda_criacao_pat(){
		
			var uData = $('#newevent_data').val();
			var uHorai = $('#newevent_horai').val();
			var uHoraf = $('#newevent_horaf').val();
			var uHoradesc = $('#newevent_horadesc').val();
			var uStatus = "50 - TERMINADO"
			var uRelatorio = $('#newevent_relatorio').val();

			var qtdhorasi = valtime(uHorai);
			var qtdhorasf = valtime(uHoraf);
			var qtdhorasd = valtime(uHoradesc);
			
			var tothoras = (qtdhorasf - qtdhorasi) - qtdhorasd;

			if (tothoras!==_qtdhoras){
				alertify.error("A quantidade de horas lançadas (" +  _qtdhoras.toString().trim() + "), não coincide com o total de horas para o relatório (" +  tothoras.toString().trim() + ")!")
			}else{
	
				var query = "update mx set data='" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "'" +
				",inicio=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" + 
				",hinicio='" + uHorai + "'" +
				",fim=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')" + 
				",hfim='" + uHoraf + "'" +
				",usrdata=convert(char(10),getdate(),121)" +					
				",usrhora=convert(char(10),getdate(),108)" +					
				",usrinis='" + userinis + "'" + 					
				" where mxstamp='" + _mxstamp + "'";	
											
				console.log(query);
				if (query!==""){
					waitwindow("A alterar marcação!!!");		
					CorreNewWs("QueryJson",query,function(json){
						if (json!==""){
							query = "exec dbo.[tts_cria_pa_mh] '" + _mxstamp + "','" + uTipo + "','" + uStatus + "','" + uRelatorio + "','" + uHoradesc + "'"
							guarda_pat(query);
						}else{
							alertify.error("Erro ao guardar!!!")
							fechawaitwindow();
						}
					});				
				}
			}
		}
	
		$('#event_guardar').on('click', function(){
			if ((_mxstamp===undefined) || (_mxstamp===null) || (_mxstamp==="")){
				alertify.error("Não existe marcação para o Projecto para esta data!")
			}else{
				Valida_Cria_Pat();
			}
		}); 
	}
}


function guarda_pat(query){

	console.log(query);
	if (query!==""){
		waitwindow("A criar intervenção!!!");
		CorreNewWs("QueryJson",query,function(json){
			if (json!==""){
				alertify.success("Registo criado!!!")
				fechawaitwindow();
				CloseModalBox()		
			}else{
				alertify.error("Erro ao guardar!!!")
				fechawaitwindow();
			}
		});				
	}
	
}


function verificar_horas(processo,data){

	query = "	Select sum(u_ttart.horas) horas,tpo.tpod"
	query += "	from u_ttart (nolock)"
	query += "	inner join ttapa (nolock) on ttapa.ttapastamp = u_ttart.ttapastamp"	
	query += "	inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp	"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp 	"
	query += "	Where tpo.tpod= '" + processo + "'"	
	query += "	And u_ttart.data='" + data + "'"
	query += "	And ttapa.usnaresp ='" + username + "'"

	query += "	Group by tpo.tpod"

	//console.log(query);
	
	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_horas(json);
		}else{
		}
	});
}

function verificar_horas_alt(_u_ttartstamp,processo,data){

	query = "	Select sum(u_ttart.horas) horas,tpo.tpod"
	query += "	from u_ttart (nolock)"
	query += "	inner join ttapa (nolock) on ttapa.ttapastamp = u_ttart.ttapastamp"	
	query += "	inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp	"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp 	"
	query += "	Where tpo.tpod= '" + processo + "'"	
	query += "	And u_ttart.data='" + data + "'"
	query += "	And ttapa.usnaresp ='" + username + "'"
	query += "	And u_ttart.u_ttartstamp != '" + _u_ttartstamp + "'"
	query += "	Group by tpo.tpod"

	//console.log(query);
	
	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_horas(json);
		}else{
		}
	});
}



function validou_horas(json){
	for(var i in json.TbPhc){ 
        if(json.TbPhc[i].tpod!=="!#NA#!SEMDADOS"){	
			horasdia = parseFloat(json.TbPhc[i].horas.replace(",","."));
			mostrahoraslancadas();
		}else{
			horasdia = 0;
			mostrahoraslancadas();			
		}
	}
	 
}
	
function verificar_fases(processo,fechadas){

	query = "	Select tta.tfad as fase"
	query += "		,tta.resumo as tarefa"
	query += "		,TTAPA.resumo"
	query += "		,TTAPA.descricao"
	query += "		,TTAPA.status"
	query += "		,cast(0 as numeric(10)) as qtt"
	query += "		,ttapa.u_pexec pctreal"
	query += "		,ttapa.usnaresp as responsavel"
	query += "		,TTAPA.TTAPAstamp as ttapastamp"
	query += "	from TTAPA(nolock) "
	query += "	inner join tta (nolock) on TTAPA.ttastamp = tta.ttastamp"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp "
	query += "	Where tpo.tpod= '" + processo + "' "
	query += "	And ttapa.usnaresp ='" + username + "'"
	if (fechadas===false){
		query += "	And ttapa.fechado = 0"		
	}
	query += "	order by Fase,Tarefa,resumo" 
	
	//console.log(query);

	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_fase(json);
		}else{
		}
	});
	
	
}

function validou_fase(json){
	jsonFase = [];
	horaslancadas = 0;
	for(var i in json.TbPhc){ 
        if(json.TbPhc[i].fase!=="!#NA#!SEMDADOS"){			
			jsonFase.push(json.TbPhc[i]);			
		}
	}
	
	limpa_datatable("tabrgmo");
		
	cria_datatable("tabrgmo",jsonFase,varmyTmplrgmo,true,jsonFase.length);

	setTimeout(function(){
		var tabela = $('#tabrgmo');
		tabela.find('tr').each(function (rowIndex, r) {
			if (rowIndex!==0){
				$(this).find('th,td').each(function (colIndex, c) {
					var _ttapastamp = "";
					FindElement($(this),"cmbstatus",function(elemento){
						_ttapastamp = elemento.attr("data-value");
						var uStatus = ""
						for(var i in jsonFase){ 
							if(jsonFase[i].ttapastamp.toString().trim().toLowerCase()===_ttapastamp.toString().trim().toLowerCase()){	
								uStatus = jsonFase[i].status;
							}
						}
						elemento.find('option').each(function () {
							if (jQuery(this).val().toString().trim().toLowerCase()===uStatus.toString().trim().toLowerCase()){
								jQuery(this).prop('selected', true);
							}else{
								jQuery(this).prop('selected', false);			
							} 
						});
					});
					FindElement($(this),"cmbexec",function(elemento){
						_ttapastamp = elemento.attr("data-value");
						var uPctReal = ""
						for(var i in jsonFase){ 
							if(jsonFase[i].ttapastamp.toString().trim().toLowerCase()===_ttapastamp.toString().trim().toLowerCase()){	
								uPctReal = parseInt(jsonFase[i].pctreal.toString().trim());
							}
						}
						elemento.find('option').each(function () {
							var auxvalor = parseInt(jQuery(this).val().toString().trim())
							if (auxvalor===uPctReal){
								jQuery(this).prop('selected', true);
							}else{
								jQuery(this).prop('selected', false);			
							} 
						});


					});
				});		
			}
		});
		
	},100)

	jQuery('.Qtd').on('change', function(){				
		setTimeout(function(){
			var strqtd = jQuery("#tabrgmo tr.selected td:eq(2) input").val();
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
			jQuery("#tabrgmo tr.selected td:eq(2) input").val(qtd.toString());	
			mostrahoraslancadas();
		},50)
	});	
	
	jQuery('.bt_qtdmenos').on('click', function(){				
		setTimeout(function(){
			var strqtd = jQuery("#tabrgmo tr.selected td:eq(2) input").val();
			strqtd = strqtd.toString();
			var qtd = parseFloat(strqtd);	

			qtd = qtd - 0.5;
			if (qtd < 0){
				qtd = 0;
			}
			jQuery("#tabrgmo tr.selected td:eq(2) input").val(qtd.toString());	
			mostrahoraslancadas();
		},50)
	});		
	
	jQuery('.bt_qtdmais').on('click', function(){
		setTimeout(function(){
			var strqtd = jQuery("#tabrgmo tr.selected td:eq(2) input").val();
			strqtd = strqtd.toString();
			var qtd = parseFloat(strqtd);	

			qtd = qtd + 0.5;
			jQuery("#tabrgmo tr.selected td:eq(2) input").val(qtd.toString());	
			mostrahoraslancadas();
		},50)
	});		
}

function mostrahoraslancadas(){
	var tabela = $('#tabrgmo');
	var auxqtt = 0;
	tabela.find('tr').each(function (rowIndex, r) {
		if (rowIndex!==0){
			$(this).find('th,td').each(function (colIndex, c) {
				ValorElemento($(this),"qtt",function(_nqtt){
					try{
						qtt = _nqtt.toString();	
						nqtt = parseFloat(qtt);
						if ((nqtt!==NaN) && (nqtt.toString()!=="NaN")){
							qtt = nqtt.toString();								
						}else{
							qtt = "0";
							nqtt = 0;
						} 
					}catch(ex){
						qtt = "0";
						nqtt = 0;
					}
				})
			});
		
			if (nqtt!==0){
				auxqtt = auxqtt + nqtt;
			}
		}
	});	
	var horasl = horasdia + auxqtt;
	if (horasl===0){
		jQuery("#horaslc").html("");		
	}else{
		jQuery("#horaslc").html("Horas já lançadas: " + horasl.toString().trim());		
	}
}


//*******************************************************************
//** CÓDIGO PARA O ECRÃ DE ALTERAÇÃO DE REGISTO
//*******************************************************************

function click_bt_alterar_rh(linha){
	var Stamp = linha.attr("data-stamp");
	
	query = "	Select tta.tfad as fase"
	query += "		,tta.resumo as tarefa"
	query += "		,ttapa.resumo"
	query += "		,u_ttart.descr descricao"
	query += "		,Convert(char(10),u_ttart.data,120) data"
	query += "		,u_ttart.status"
	query += "		,u_ttart.horas as qtt"
	query += "		,u_ttart.pexec pctreal"
	query += "		,ttapa.usnaresp as responsavel"
	query += "		,u_ttart.u_ttartstamp as ttapastamp "
	query += "		,u_ttart.u_ttartstamp"
	query += "		,tpo.tpod as processo"	
	query += "	from u_ttart (nolock) "
	query += "	inner join ttapa (nolock) on ttapa.ttapastamp = u_ttart.ttapastamp"
	query += "	inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp "
	query += "	Where u_ttart.u_ttartstamp = '" + Stamp + "' "
	//console.log(query);

	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_alt_rh(json);
		}else{
		}
	});
	
}

function validou_alt_rh(json){
	jsonFase = [];
	//console.log(json);
	horaslancadas = 0;
	for(var i in json.TbPhc){ 
        if(json.TbPhc[i].fase!=="!#NA#!SEMDADOS"){			
			jsonFase.push(json.TbPhc[i]);	
			var data = 	jsonFase[0].data.toString().replace(/[-]/g,"");
			horaslancadas = - parseFloat(jsonFase[0].qtt);
			verificar_horas_alt(jsonFase[0].u_ttartstamp,jsonFase[0].processo,data);			
			
			abre_alteracao_registo();
		}
	}
}


function click_bt_apagar_rh(linha){
		
	alertify.confirm("Quer mesmo apagar o registo ?", function (e,str) {		
		if (e){
			var Stamp = linha.attr("data-stamp");

			waitwindow("A eliminar o registo !!!");			
			
			query = "Delete From u_ttart Where u_ttartstamp='" + Stamp + "'"
			CorreNewWs("QueryJson",query,function(json){
				if (json!==""){
					alertify.success("Registo Eliminado!!!");
					refrescarecran();
				}else{
					alertify.error("Erro ao eliminar o registo!!!");
				}
			});	
			return;
		}else{
			alertify.error("Cancelado pelo utilizador!!!");
			return;
		}
	}, "Eliminar registo");
}

 function abre_alteracao_registo(){
	 
	var soleitura = "";
	var totlinhas = 0;
	var linha = 0;

	var form = jQuery('<form id="event_form">'+
		'	<div class="form-group has-success has-feedback">'+
		'		</div>' + 	
	
		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Projeto :</label>'+
		'				<div class="col-lg-5 col-sm-10 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtlprojeto" name="txtlprojeto" value="' + jsonFase[0].processo + '" class="form-control input-sm" placeholder="Projeto" data-toggle="tooltip" data-placement="top" title="Projeto" readonly >'+
		'				</div>	'+
		'			</div>' + 	

		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Data :</label>'+
		'				<div class="col-lg-2 col-sm-3 col-xs-9 control-label">'+
		'					<input type="date" id="txtdata" name="txtdata" value="' + jsonFase[0].data + '" class="form-control input-sm _input_date" placeholder="Data" data-toggle="tooltip" data-placement="top" title="Data" readonly>'+
		'				</div>'+	
		'				<label id="horaslc" class="col-lg-4 col-sm-4 col-xs-9 col-sm-offset-3 control-label titulobig pull-right"></label>'+
		'			</div>' + 	
			
		'			<br>'+
		'			<div class="row has-feedback">'+		
		'				<div class="row has-feedback">'+
		'					<table cellspacing="0" class="table table-striped table-bordered nowrap" id="tabrgmo" width="100%">'+
		'						<thead>'+ 
		'							<tr>'+
		'								<th>Status</th>'+
		'								<th>% Execução</th>'+
		'								<th>Horas</th>'+
		'								<th>Fase</th>'+
		'								<th>Tarefa</th>'+
		'								<th>Passo</th>'+
		'								<th>Descricao</th>'+
		'								<th data-campo="ttapastamp" style="display:none;">ttapastamp</th>'+
		'							</tr>'+
		'						</thead>'+
		'						<tbody>'+	

		'						</tbody>'+
		'					</table>'+
		'				</div>'+
		'			</div>'+


		'		</div>'+
		'	</div>'+
		'</form>');
		
		var buttons = jQuery('<div class="pull-right">'+
						'<button id="event_guardar" class="btn btn-primary btn-label-left">'+
						'<span><i class="fa fa-pencil txt-default"></i></span>'+
						' Guardar'+							
						'</button>'+																
						'</div>');

	OpenModalBox('Registar Horas', form, buttons);

	$("#txtlprojeto").val(uObra);					
	
	jQuery('.ui-autocomplete').removeClass("ui-corner-all");
		
	cria_datatable("tabrgmo",jsonFase,varmyTmplrgmo,true,jsonFase.length);

	setTimeout(function(){
		var tabela = $('#tabrgmo');
		tabela.find('tr').each(function (rowIndex, r) {
			if (rowIndex!==0){
				$(this).find('th,td').each(function (colIndex, c) {
					var _ttapastamp = "";
					FindElement($(this),"cmbstatus",function(elemento){
						_ttapastamp = elemento.attr("data-value");
						var uStatus = ""
						for(var i in jsonFase){ 
							if(jsonFase[i].ttapastamp.toString().trim().toLowerCase()===_ttapastamp.toString().trim().toLowerCase()){	
								uStatus = jsonFase[i].status;
							}
						}
						elemento.find('option').each(function () {
							if (jQuery(this).val().toString().trim().toLowerCase()===uStatus.toString().trim().toLowerCase()){
								jQuery(this).prop('selected', true);
							}else{
								jQuery(this).prop('selected', false);			
							} 
						});
					});
					FindElement($(this),"cmbexec",function(elemento){
						_ttapastamp = elemento.attr("data-value");
						var uPctReal = ""
						for(var i in jsonFase){ 
							if(jsonFase[i].ttapastamp.toString().trim().toLowerCase()===_ttapastamp.toString().trim().toLowerCase()){	
								uPctReal = parseInt(jsonFase[i].pctreal.toString().trim());
							}
						}
						elemento.find('option').each(function () {
							var auxvalor = parseInt(jQuery(this).val().toString().trim())
							if (auxvalor===uPctReal){
								jQuery(this).prop('selected', true);
							}else{
								jQuery(this).prop('selected', false);			
							} 
						});


					});
				});		
			}
		});
		
	},100)

	jQuery('.Qtd').on('change', function(){				
		setTimeout(function(){
			var strqtd = jQuery("#tabrgmo tr.selected td:eq(2) input").val();
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
			jQuery("#tabrgmo tr.selected td:eq(2) input").val(qtd.toString());	
			mostrahoraslancadas();
		},50)
	});	
	
	jQuery('.bt_qtdmenos').on('click', function(){				
		setTimeout(function(){
			var strqtd = jQuery("#tabrgmo tr.selected td:eq(2) input").val();
			strqtd = strqtd.toString();
			var qtd = parseFloat(strqtd);	

			qtd = qtd - 0.5;
			if (qtd < 0){
				qtd = 0;
			}
			jQuery("#tabrgmo tr.selected td:eq(2) input").val(qtd.toString());	
			mostrahoraslancadas();
		},50)
	});		
	
	jQuery('.bt_qtdmais').on('click', function(){
		setTimeout(function(){
			var strqtd = jQuery("#tabrgmo tr.selected td:eq(2) input").val();
			strqtd = strqtd.toString();
			var qtd = parseFloat(strqtd);	

			qtd = qtd + 0.5;
			jQuery("#tabrgmo tr.selected td:eq(2) input").val(qtd.toString());	
			mostrahoraslancadas();
		},50)
	});		
	
	jQuery('#event_guardar').on('click', function(){	
		var processo = $('#txtlprojeto').val();
		var data = $('#txtdata').val().toString().replace(/[-]/g,"");
		var tabela = $('#tabrgmo');
		var status = "";
		var exec = "";
		var descr = "";
		var qtt = "";
		var ttapastamp = "";
		
		tabela.find('tr').each(function (rowIndex, r) {
			if (rowIndex!==0){
				$(this).find('th,td').each(function (colIndex, c) {
					
					ValorElemento($(this),"ttapastamp",function(_ttapastamp){
						ttapastamp = _ttapastamp;					
					})
					ValorElemento($(this),"cmbstatus",function(_status){
						status = _status;					
					})
					ValorElemento($(this),"cmbexec",function(_exec){
						exec = _exec;					
					})
					ValorElemento($(this),"txtdescricao",function(_descr){
						descr = _descr;					
					})
					ValorElemento($(this),"qtt",function(_nqtt){
						try{
							qtt = _nqtt.toString();	
							nqtt = parseFloat(qtt);
							if ((nqtt!==NaN) && (nqtt.toString()!=="NaN")){
								qtt = nqtt.toString();								
							}else{
								qtt = "0";
								nqtt = 0;
							} 
						}catch(ex){
							qtt = "0";
							nqtt = 0;
						}					
					})			
				});
			
				if (qtt!=="0"){
					
					if (status===""){
						alertify.error("Tem de preencher o Status!!")
						return
					}
					if ((exec==="") || (exec==="0")){
						alertify.error("Tem de preencher a % Execução!!")
						return
					}
					
					waitwindow("A guardar!!");

					query = "Update u_ttart Set horas=" + qtt + ",dias=" + qtt + "/8,pexec='" + exec + "',status='" + status + "',fechado=" + (exec.toString().trim()==="100" ? "1" : "0") + ",descr='" + descr + "' where u_ttartstamp = '" + ttapastamp + "'"

					//console.log(query);
					
					CorreNewWs("QueryJson",query,function(json){

						if (json!==""){
							alertify.success("Dados guardados!!");
							fechawaitwindow(); 		
							CloseModalBox();	
							refrescarecran();	
						}else{
							alertify.error("Erro a guardar, verifique!!");
							fechawaitwindow();						
						}
					});	
				}	
			}
		});
	});	
	
	jQuery('#event_cancel').on('click', function(){
		CloseModalBox();
	});			
	
	
	setTimeout(function(){
		AjustaTabela("tabrgmo");
	},10)
	
	
	fechawaitwindow(); 
 }	


//*******************************************************************
//** CÓDIGO PARA O ECRÃ DE VERIFICAÇÃO DE REGISTOS
//*******************************************************************

function click_bt_hl(linha){
	var Stamp = linha.attr("data-stamp");

	query = "	Select tta.tfad as fase"
	query += "		,tta.resumo as tarefa"
	query += "		,ttapa.resumo passo"
	query += "		,ttapa.descricao"
	query += "		,Convert(char(10),u_ttart.data,120) data"
	query += "		,u_ttart.status"
	query += "		,u_ttart.horas"
	query += "		,u_ttart.pexec"
	query += "		,ttapa.usnaresp as responsavel"
	query += "		,u_ttart.u_ttartstamp as ttapastamp "
	query += "		,u_ttart.u_ttartstamp"
	query += "		,tpo.tpod as processo"	
	query += "	from u_ttart (nolock) "
	query += "	inner join ttapa (nolock) on ttapa.ttapastamp = u_ttart.ttapastamp"
	query += "	inner join tta (nolock) on ttapa.ttastamp = tta.ttastamp"
	query += "	inner join tpo (nolock) on tpo.tpostamp=tta.tpostamp "
	query += "	Where u_ttart.ttapastamp = '" + Stamp + "' "
	//console.log(query);

	CorreNewWs("ExecQueryJson",query,function(json){
		if (json!==""){
			validou_regh(json);
		}else{
		}
	});
	
}

function validou_regh(json){
	rh = [];
	horaslancadas = 0;
	for(var i in json.TbPhc){ 
        if(json.TbPhc[i].fase!=="!#NA#!SEMDADOS"){			
			rh.push(json.TbPhc[i]);				
		}
	}
	abre_mostra_registoh();
}

 function abre_mostra_registoh(){
	 
	var soleitura = "";
	var totlinhas = 0;
	var linha = 0;

	var form = jQuery('<form id="event_form">'+
		'	<div class="form-group has-success has-feedback">'+
		'		</div>' + 	
	
		'			<div class="row has-feedback">'+		
		'				<label class="col-lg-1 col-sm-2 col-xs-3 control-label">Projeto :</label>'+
		'				<div class="col-lg-5 col-sm-10 col-xs-9 control-label autocomplete">'+
		'					<input type="text" id="txtlprojeto" name="txtlprojeto" value="' + rh[0].processo + '" class="form-control input-sm" placeholder="Projeto" data-toggle="tooltip" data-placement="top" title="Projeto" readonly >'+
		'				</div>	'+
		'			</div>' + 	
			
		'			<br>'+
		'			<div class="row has-feedback">'+		
		'				<div class="row has-feedback">'+
		'					<table cellspacing="0" class="table table-striped table-bordered nowrap" id="tabreghmo" width="100%">'+
		'						<thead>'+ 
		'							<tr>'+
		'								<th>Alt.</th>'+
		'								<th>Apa.</th>'+
		'								<th>Data</th>'+
		'								<th>Técnico</th>'+
		'								<th>Horas</th>'+
		'								<th>Fase</th>'+
		'								<th>Tarefa</th>'+
		'								<th>Passo</th>'+
		'								<th>Descrição</th>'+
		'								<th>Status</th>'+
		'								<th>% Execução</th>'+
		'								<th data-campo="u_ttartstamp" style="display:none;">u_ttartstamp</th>'+
		'							</tr>'+
		'						</thead>'+
		'						<tbody>'+	

		'						</tbody>'+
		'					</table>'+
		'				</div>'+
		'			</div>'+


		'		</div>'+
		'	</div>'+
		'</form>');
		
		var buttons = jQuery('<div class="pull-right">'+
						'<button id="event_fechar" class="btn btn-primary btn-label-left">'+
						'<span><i class="fa fa-close txt-default"></i></span>'+
						' Fechar'+							
						'</button>'+																
						'</div>');

	OpenModalBox('Registar Horas', form, buttons);

	$("#txtdata").val(dthoje());					
	$("#txtlprojeto").val(uObra);					
	
	jQuery('.ui-autocomplete').removeClass("ui-corner-all");
		
	cria_datatable("tabreghmo",rh,varmyTmplrh,true,rh.length);
	
	jQuery('#event_fechar').on('click', function(){	
		CloseModalBox();
	});	
	
	jQuery('#event_cancel').on('click', function(){
		CloseModalBox();
	});			
	
	setTimeout(function(){
		AjustaTabela("tabreghmo");
	},10)
	fechawaitwindow(); 
 }