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
var pub_userno = 0;
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
var uTipo = "1";
var uNdias = "30";
var podealterar = false;
var corFeriados = "coral";
var corAgendamentos = "gray";
var corAgendNaoConf = "blue";
var corIntervencoes = "green";
var corVisitas = "yellow";
var corSuporte = "red";
var corSuporteTele = "#FF5A5A"
var corTTS = "lightsteelblue";
var corTeletrb = "#46d2d2";
var m_chinis = "WWW"
var solivres = false;
var dtinilivres = "01-01-1900";
var dtfimlivres = "01-01-1900";

var mostrafs = true;
var horaini = "08:00:00";
var horafim = "19:00:00";
var zoom = 100;
var vistapredefinida = "timelineWeek"; 
var tamanhoResource = "10%";
var tecniconm = "";

var dadoscal = [];
var Calendar_Filtros;
var topcl = 0;
var leftcl = 0;
var topmodalcl = 0;
var leftmodalcl = 0;

var jsonTema =[{"val":"1","valor":"default","descricao":"Normal"},{"val":"2","valor":"classic","descricao":"Cor"},{"val":"3","valor":"dark","descricao":"Escuro"}
	,{"val":"4","valor":"4","descricao":"Aqua"},{"val":"5","valor":"5","descricao":"Glaciar"},{"val":"6","valor":"6","descricao":"Anil"}
	,{"val":"7","valor":"7","descricao":"Coral"},{"val":"8","valor":"8","descricao":"Prado"},{"val":"9","valor":"9","descricao":"Branco"}];
var jsonTipo =[{"valor":"1","descricao":"Só Agendamentos"},{"valor":"2","descricao":"Tudo"}];
var jsonTecnico = [];
var jsonTpTecnico = [];
var jsonFref = [];
var jsonClientes = [];
var jsonTiposMx = [];
var jsonProjetos = [];
var jsonATipos = [];
var jsonStatus = [];
var jsonTipoExe = [];

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

documento.on("change", "#txtdata", function () {
	var data = $("#txtdata").datepicker("getDate");
	$('#calendar').fullCalendar('gotoDate',data);
});

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
	
	if (mostrafs === false){
		$('#icon_calendar_fs').removeClass('fa-calendar-o'); 	
		$('#icon_calendar_fs').addClass('fa-calendar'); 	
		$("#Calendar_FS").attr("data-original-title","Mostrar Fins Semana");		
	}else{
		$('#icon_calendar_fs').removeClass('fa-calendar'); 	
		$('#icon_calendar_fs').addClass('fa-calendar-o'); 	
		$("#Calendar_FS").attr("data-original-title","Não mostrar Fins Semana");		
	} 
		
	valcookie = getCookie("zoom");
	if ((valcookie!==undefined) & (valcookie!==null) & (valcookie!=="")){
		zoom = parseInt(valcookie);
	}	

	valcookie = getCookie("tamanhoResource");
	if ((valcookie!==undefined) & (valcookie!==null) & (valcookie!=="")){
		tamanhoResource = parseFloat(valcookie).toFixed(2)+"px";
	}	
	
	$('#calendar').css('zoom', ' ' + zoom.toString().trim()+'%');
	$('#calendar').fullCalendar('option', 'height', get_calendar_height());
	
	valcookie = getCookie("horaini");
	if ((valcookie!==undefined) & (valcookie!==null) & (valcookie!=="")){
		horaini= valcookie;
	}
	valcookie = getCookie("horafim");
	if ((valcookie!==undefined) & (valcookie!==null) & (valcookie!=="")){
		horafim= valcookie;
	}
	valcookie = getCookie("vistapredefinida");
	if ((valcookie!==undefined) & (valcookie!==null) & (valcookie!=="")){
		vistapredefinida= valcookie;
	}

	valcookie = getCookie("tecniconm");
	
	if ((valcookie!==undefined) & (valcookie!==null) & (valcookie!=="")){
		tecniconm = valcookie;
	}	

	
	mytooltip();
	
	valida_filtros();
	
	$(window).resize(function() {
        $('#calendar').fullCalendar('option', 'height', get_calendar_height());
    });

});

function mytooltip(){

	$('.form-control').tooltip();  				

	tooltip = $('<div/>').qtip({
		id: 'calendario',
		prerender: true,
		content: {
			text: ' '
		},
		position: {
			my: 'bottom center',
			at: 'top center',
			target: 'mouse',
			viewport: $('#calendar'),
			adjust: {
				mouse: true,
				scroll: true
			}
		},
		events: {
			show: function(event, api) {
				// Only show the tooltip if say... an element is also visible
				if($('.selector').is(':hidden')) {
					// IE might throw an error calling preventDefault(), so use a try/catch block.
					try { event.preventDefault(); } catch(e) {}
				}
			}
		},			
		show: false,
		hide: false,
		style: 'qtip-youtube'


		
		
		//'qtip-tipsy'
		
	}).qtip('api');
}	


function carregar(){
	
	setTimeout(function(){ 
		
		waitwindow("A ler os dados do servidor !!!");
				
		var query			
		query = "select tema,u_alteramx as podealterar,iniciais,tecnico,tecnnm,userno from us (nolock) where usercode='"+username.toString()+"'";

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
		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
			//console.log(json);
			if (json!==""){
				validou_cl(json);
			}else{
			}
		});

		var query			
		query = "select dbo.Tts_RGB2RGB(cast(para1.valor as numeric(10)),'H') as cor,descricao from para1 (nolock) where descricao like 'user_cor_%'";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_cores(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});		
	
	
		var query			
		query = "select campo from dytable (nolock) where entityname = 'tipomx' order by campo";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_tipos(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});		


		var query			
		query = "select campo from dytable (nolock) where entityname = 'a_ptipo'  order by campo";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_atipo(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});		

		var query			
		query = "select campo from dytable (nolock) where entityname = 'a_mhtipo'  order by campo";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_mhtipo(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});		
		
		query = "select campo from dytable (nolock) where entityname = 'sn_tipo'  order by campo";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_tipoexe(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});		
				
		var query			
		query = "Select fref.fref,fref.nmfref "
			+	" From bo (nolock) "
			+	" Inner join fref (nolock) on fref.fref = bo.fref"
			+	" Where bo.ndos = 15 and bo.fechada = 0"
			+	" And fref.u_fechado = 0"
			+	" Order by fref.fref";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_fref(json);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});	
		
	}, 200); 
	//var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}	
	//var pub_passw = Base64.decode(userpass);

	$("#versao").html("Versão da aplicação: " + pub_versaoapp.trim());
	
	var data = hoje();
	//alert(data.toString());

}


function validou_user(json){

	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].tema!=="!#NA#!SEMDADOS"){
			
			m_chinis = json.TbPhc[i].iniciais;			
			pub_tecnico = json.TbPhc[i].tecnico;
			pub_tecnnm = json.TbPhc[i].tecnnm;
			pub_userno = json.TbPhc[i].userno;

			if (json.TbPhc[i].podealterar.toString().trim().toLowerCase()==="true"){
				podealterar = true
			}else{
				$("#assistencia_btNova").hide();
			}
			
			var cbTipo=$("#Calendar_cmbTipo");
			PopularComboVal(cbTipo,jsonTipo,"1","Seleccionar Tema...")
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
			loadCSS(pub_url+"tts/css/tts.css");
	
			query_tipostecnicos();
		}
	}			
}

function validou_cores(json){
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_feriados"){
			corFeriados = json.TbPhc[i].cor;
		}
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_intervencoes"){
			corIntervencoes = json.TbPhc[i].cor;
		}
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_marcacoes"){
			corAgendamentos = json.TbPhc[i].cor;
		}
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_visitas"){
			corVisitas = json.TbPhc[i].cor;
		}	
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_marcacoes_nao_conf"){
			corAgendNaoConf = json.TbPhc[i].cor;
		}			
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_suporte"){
			corSuporte = json.TbPhc[i].cor;
		}					
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_tts"){
			corTTS = json.TbPhc[i].cor;
		}					
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_teletrabalho"){
			corTeletrb = json.TbPhc[i].cor;
		}							                                                                                                                                                                                  
	}	
}

function validou_tipos(json){
	jsonTiposMx = [];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].campo!=="!#NA#!SEMDADOS"){			
			jsonTiposMx.push({
				valor: json.TbPhc[i].campo,			
				descricao: json.TbPhc[i].campo		
			});			
		}
	}			
}	  


function validou_atipo(json){
	jsonATipos = [];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].campo!=="!#NA#!SEMDADOS"){			
			jsonATipos.push({
				valor: json.TbPhc[i].campo,			
				descricao: json.TbPhc[i].campo		
			});			
		}
	}			
}	  

function validou_mhtipo(json){
	jsonStatus = [];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].campo!=="!#NA#!SEMDADOS"){			
			jsonStatus.push({
				valor: json.TbPhc[i].campo,			
				descricao: json.TbPhc[i].campo		
			});			
		}
	}			
}	  

function validou_tipoexe(json){
	jsonTipoExe = [];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].campo!=="!#NA#!SEMDADOS"){			
			jsonTipoExe.push({
				valor: json.TbPhc[i].campo,			
				descricao: json.TbPhc[i].campo		
			});			
		}
	}			
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
					
documento.on("click", "#assistencia_btNova", function () {	
	criarnovoevento();				
});
																
documento.on("mouseup", ".fc-content", function () {
	var auxtamanho = $(".fc-resource-area").width();
	if ((auxtamanho!==undefined) & (auxtamanho!==null) & (auxtamanho!==0)){
		var tamanhoResource = auxtamanho.toFixed(2).toString();	
		setCookie("tamanhoResource",tamanhoResource,30);	
	}
}); 												
																													
documento.on("click", ".fc-agendaDay-button", function () {
	setCookie("vistapredefinida","agendaDay",30)		
}); 											
											
documento.on("click", ".fc-timelineDay-button", function () {
	setCookie("vistapredefinida","timelineDay",30)		
}); 											

documento.on("click", ".fc-timelineWeek-button", function () {
	setCookie("vistapredefinida","timelineWeek",30)		
}); 											

documento.on("click", ".fc-timelineMonth-button", function () {
	setCookie("vistapredefinida","timelineMonth",30)		
}); 											

documento.on("click", ".fc-timelineYear-button", function () {
	setCookie("vistapredefinida","timelineYear",30)		
}); 											

											
documento.on("click", "#Calendar_HC", function () {	
	if ((horaini === "08:00:00") || (horaini === "09:00:00")){
		horaini = "00:00:00";
		horafim = "24:00:00";		
		$('#icon_calendar_hc').removeClass('fa-calendar-plus-o'); 	
		$('#icon_calendar_hc').addClass('fa-calendar-minus-o'); 	
		$("#Calendar_HC").attr("data-original-title","Mostrar Horário Trabalho");		
	}else{
		horaini = "08:00:00";
		horafim = "19:00:00";					
		$('#icon_calendar_hc').removeClass('fa-calendar-minus-o'); 	
		$('#icon_calendar_hc').addClass('fa-calendar-plus-o'); 	
		$("#Calendar_HC").attr("data-original-title","Mostrar Horário Completo");		
	} 
	setCookie("horaini",horaini,30)		
	setCookie("horafim",horafim,30)		
	$('#calendar').fullCalendar('option', 'minTime', horaini);	
	$('#calendar').fullCalendar('option', 'maxTime', horafim);
	$(".fc-agendaDay-button").html("Dia/Horas");
});  

documento.on("click", "#Calendar_HT", function () {	
	if ((horaini === "08:00:00") || (horaini === "00:00:00")){
		horaini = "09:00:00";
		horafim = "18:00:00";					
		$('#icon_calendar_ht').removeClass('fa-calendar-times-o'); 	
		$('#icon_calendar_ht').addClass('fa-calendar-check-o'); 	
		$("#Calendar_HC").attr("data-original-title","Mostrar Horário Completo");		
	}else{
		horaini = "08:00:00";
		horafim = "19:00:00";					
		$('#icon_calendar_ht').removeClass('fa-calendar-times-o'); 	
		$('#icon_calendar_ht').addClass('fa-calendar-check-o'); 	
		$("#Calendar_HC").attr("data-original-title","Mostrar Horário Completo");		
	} 
	setCookie("horaini",horaini,30)		
	setCookie("horafim",horafim,30)		
	$('#calendar').fullCalendar('option', 'minTime', horaini);	
	$('#calendar').fullCalendar('option', 'maxTime', horafim);
	$(".fc-agendaDay-button").html("Dia/Horas");
});  

documento.on("click", "#Calendar_ZPlus", function () {	
	zoom = zoom + 5;
	setCookie("zoom",zoom,30)		
	$('#calendar').css('zoom', ' ' + zoom.toString().trim()+'%');
	$('#calendar').fullCalendar('option', 'height', get_calendar_height());

});  

documento.on("click", "#Calendar_ZMin", function () {	
	zoom = zoom - 5;
	setCookie("zoom",zoom,30)		
	$('#calendar').css('zoom', ' ' + zoom.toString().trim()+'%');
	$('#calendar').fullCalendar('option', 'height', get_calendar_height());
});  

documento.on("click", "#Calendar_so_livres", function () {	
	pededataslivres();
});  

documento.on("click", "#Calendar_FS", function () {	
	if (mostrafs === true){
		mostrafs = false;
		$('#icon_calendar_fs').removeClass('fa-calendar-o'); 	
		$('#icon_calendar_fs').addClass('fa-calendar'); 	
		$("#Calendar_FS").attr("data-original-title","Mostrar Fins Semana");		
	}else{
		mostrafs = true;
		$('#icon_calendar_fs').removeClass('fa-calendar'); 	
		$('#icon_calendar_fs').addClass('fa-calendar-o'); 	
		$("#Calendar_FS").attr("data-original-title","Não mostrar Fins Semana");		
	} 
	setCookie("mostrafs",mostrafs.toString(),30)		
	$('#calendar').fullCalendar('option', 'weekends', mostrafs);
	$(".fc-agendaDay-button").html("Dia/Horas");	
});  
												
documento.on("click", "#printBtn", function () {	
	printPreview();		
});  

documento.on("change", "#Calendar_cmdTema", function () {
	var objtema = $("[id='Calendar_cmdTema']");
	var tema = objtema.val();
	
	loadCSS(pub_url+"css/theme-"+tema.toString().trim()+".min.css");
	loadCSS(pub_url+"pimages/user"+tema.toString().trim()+".css");
});  

documento.on("change", "#Calendar_cmbTipo", function () {
	var objtema = $("[id='Calendar_cmbTipo']");
	uTipo = objtema.val();
});  

documento.on("click", ".btnqttmin", function () {
	var auxqtt = $('#txtdias').val();	
	qtt = Number(auxqtt)	
	qtt = qtt - 1;
	setCookie("qttdias",qtt.toString(),30)		
	$('#txtdias').val(qtt.toString());
});
		
documento.on("click", ".btnqttmor", function () {
	var auxqtt = $('#txtdias').val();	
	qtt = Number(auxqtt)	
	qtt = qtt + 1;
	setCookie("qttdias",qtt.toString(),30)		
	$('#txtdias').val(qtt.toString());
});

function pededataslivres(){
	solivres = true;
	var datai = dthoje().toString().trim().substring(0, 10); 
	var dataf = dtproximomes().toString().trim().substring(0, 10);  
		
	var form = $('<form id="event_form">'+
		'<div class="form-group has-success has-feedback">'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Inicio :</label>'+
		'<div class="col-sm-5">'+
		'<input maxlength="10" size="10" type="date" id="datai_livres" name="datai_livres" value="'+ datai +'" class="form-control NewWapp_txt"  placeholder="Data Inicio" data-toggle="tooltip" data-placement="top" title="Data Inicio">'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Fim:</label>'+
		'<div class="col-sm-5">'+
		'<input maxlength="10" size="10" type="date" id="dataf_livres" name="dataf_livres" value="'+ dataf +'" class="form-control NewWapp_txt"  placeholder="Data Fim" data-toggle="tooltip" data-placement="top" title="Data Fim">'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</form>');
			
		var buttons = $('<div class="pull-left">'+
						'<button id="livres_cancel" type="cancel" class="btn btn-warning btn-label-left">'+
						'<span><i class="fa fa-ban txt-default"></i></span>'+
						'Fechar'+
						'</button>'+
						'</div>'+
						'<div class="pull-right">'+
						'<button type="submit" id="livres_ok" class="btn btn-success btn-label-left">'+
						'<span><i class="fa fa-calendar-check-o txt-default"></i></span>'+
						'OK'+							
						'</button>'+
						'</div>');

	OpenModalBox('Período para validação', form, buttons);						
		
	$('#livres_cancel').on('click', function(){
		CloseModalBox();
	});
		
	$('#livres_ok').on('click', function(){
		solivres = true;		
		var uDatai = $('#datai_livres').val();
		var uDataf = $('#dataf_livres').val();
		dtinilivres = uDatai;
		dtfimlivres = uDataf;
	
		$('#lblSoLivres').html("Nota: Só técnicos livres de " + uDatai.substring(8, 10) + "/" + uDatai.substring(5, 7) + "/" + uDatai.substring(0, 4) + " a " + + uDataf.substring(8, 10) + "/" + uDataf.substring(5, 7) + "/" + uDataf.substring(0, 4) + ".  ");
		
		Calendar_CorrerFiltros();
	
		uFiltro = Calendar_Filtros;		

		AtualizarCalendarioInternecoes(uFiltro);
		
		CloseModalBox();
	});
						
}
			
function printPreview() {

	var objtecnico = $("[id='Calendar_cmdTecnico']");
	var tecnico = objtecnico.val();

	if (tecnico===""){
		tecnico = pub_tecnnm;
	}

	var headerElements = document.getElementsByClassName('fc-header');//.style.display = 'none';
	for(var i = 0, length = headerElements.length; i < length; i++) {
		headerElements[i].style.display = 'none';
	}
	var toPrint = document.getElementById('calendar').cloneNode(true);

	for(var i = 0, length = headerElements.length; i < length; i++) {
		headerElements[i].style.display = '';
	}

	var linkElements = document.getElementsByTagName('link');
	var link = '';
	for(var i = 0, length = linkElements.length; i < length; i++) {
		link = link + linkElements[i].outerHTML;
	}

	var styleElements = document.getElementsByTagName('style');
	var styles = '';
	for(var i = 0, length = styleElements.length; i < length; i++) {
		styles = styles + styleElements[i].innerHTML;
	}

	var popupWin = window.open('', '_blank');  
	popupWin.document.open();  
	popupWin.document.write('<html><head><title>Agenda</title>'+link) 
	popupWin.document.write('</head><body><h5>Agenda do técnico: '+tecnico+'</h5>') 
	//+'<style>'+styles+'</style></head><body>')  
	popupWin.document.write(toPrint.innerHTML);  
	popupWin.document.write('<script type="text/javascript">window.print();<'+'/script>');  
	popupWin.document.write('</body></html>');  
	popupWin.document.close();  

	//setTimeout(popupWin.print(), 20000);
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
/* 	Preenche_FLT(uObjFlt,"#Flt_Calendario",function(){
		if (uFiltros.length !== 0){
			for (i=0;i<uFiltros.length;i++){
				if (uFiltros[i].indexOf("#INI")===-1){
					Filtros = 	Filtros + uFiltros[i];
				}else{
					alertify.error("Deve escolher Data de Fim!!")
				}
			}
		}	
		fechawaitwindow(); 			
	}); */
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

	var uTecnico = "";
	uTecnico = $("#Calendar_cmdTecnico").val();	
	setCookie("tecniconm",uTecnico,30);	

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
	$("#chkSoFerias").prop('checked', false);
	
	var cbTipo=$("#Calendar_cmbTipo");
	PopularComboVal(cbTipo,jsonTipo,"1","Seleccionar Tema...")	
	var cbTecnico=$("#Calendar_cmdTecnico");
	PopularComboVal(cbTecnico,jsonTecnico,"","Seleccionar Técnico...")
	var cbTpTecnico=$("#Calendar_cmdTipoTecnico");
	PopularComboVal(cbTpTecnico,jsonTpTecnico,"","Seleccionar Tipo Técnico...")
	var cbFref=$("#Calendar_cmdFref");
	PopularComboVal(cbFref,jsonFref,"","Seleccionar Projeto...")
	
	var uTecnico = "";
	setCookie("tecniconm",uTecnico,30);	

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


function ReDesenharCalendario(json){
	//console.log(json);
	dadoscal=[];
	var dadoscal1=[];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){			
			dadoscal.push({
				title: json.TbPhc[i].title,
				id: json.TbPhc[i].id,
				color: json.TbPhc[i].color,
				backgroundColor: json.TbPhc[i].backgroundColor,
				className: "['event', '"+json.TbPhc[i].className+"']",
				start: json.TbPhc[i].start,
				end: json.TbPhc[i].end,
				resourceId: json.TbPhc[i].resourceId,
				tecnico: json.TbPhc[i].tecnico,
				tabela: json.TbPhc[i].tabela,
				stamp: json.TbPhc[i].stamp,
				projeto: json.TbPhc[i].projeto,	
				tipo: json.TbPhc[i].tipo,					
				cliente: json.TbPhc[i].cliente,
				texto: json.TbPhc[i].texto,
				naoconf: json.TbPhc[i].naoconf,
				emcasa: json.TbPhc[i].emcasa,
				teletr: json.TbPhc[i].teletr,
				reminder: json.TbPhc[i].reminder,
				nopat: json.TbPhc[i].nopat,
				tipomx: json.TbPhc[i].tipomx,
				description: json.TbPhc[i].description					
			});			
		}
	}		
	
	$('#calendar').fullCalendar('removeEvents');
	$('#calendar').fullCalendar( 'addEventSource', dadoscal);  
	$(".fc-agendaDay-button").html("Dia/Horas");
	fechawaitwindow();
							
}	  

var dadoscal = [];
var dados_resources = [];

function carregarquerycalendario(uDataini,uDatafim){

	if ((uDataini===undefined) || (uDataini===null)){
		uDataini = ""
	}

	if ((uDatafim===undefined) || (uDatafim===null)){
		uDatafim = ""
	}

	uNdias = $('#txtdias').val();

	var uProjeto = "";
	var uFltProjeto = "";
	uProjeto = $("#Calendar_cmdFref").val();

	if ((uProjeto!==undefined) && (uProjeto!==null) && (uProjeto.toString().trim()!=="") && (uProjeto.toString().trim()!=="-1")){
		uFltProjeto = " And mx.u_fref like '" + uProjeto + "'";
	}
	
	if ($("#chkSoSuporte").is(":checked")){
		uFltProjeto = uFltProjeto + " And mx.u_tipomx = '05 SUPORTE'"	
	} 	
	
	if ($("#chkSoFerias").is(":checked")){
		if ($("#chkSoSuporte").is(":checked")){
			querycalendar = ""
			
			querycalendarmx ="  Select mff.title,mff.id,mff.color,mff.backgroundColor,mff.className	"
			querycalendarmx +="   ,mff.start,mff.fim as 'end'"
			querycalendarmx +="   ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
			querycalendarmx +="   ,mff.description,mff.tabela,mff.stamp,'Feriado' as projeto,'' as tipo"
			querycalendarmx += "  ,'' as cliente"
			querycalendarmx +="  ,mff.description as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
			querycalendarmx +="  from (	"
			querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
			querycalendarmx +="  ,nkeyid as id"
			querycalendarmx +=" ,'" + corFeriados + "' as color"
			querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
			querycalendarmx +=" ,'redEvent' as className"	
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
			querycalendarmx +="  ,ff.sig as description"
			querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
			querycalendarmx +="  From ff (nolock)" 
			querycalendarmx +="  Where fixo=1 "	
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
			}
			querycalendarmx +="   Union	  "
			querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
			querycalendarmx +="  ,nkeyid as id"
			querycalendarmx +=" ,'" + corFeriados + "' as color"
			querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
			querycalendarmx +=" ,'redEvent' as className"	
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
			querycalendarmx +="  ,ff.sig as description"
			querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
			querycalendarmx +="  From ff (nolock)" 
			querycalendarmx +="  Where 1=1"	
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
			}
			querycalendarmx +="   Union	  "
			querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
			querycalendarmx +="  ,nkeyid as id"
			querycalendarmx +=" ,'" + corFeriados + "' as color"
			querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
			querycalendarmx +=" ,'redEvent' as className"	
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
			querycalendarmx +="  ,ff.sig as description"
			querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
			querycalendarmx +="  From ff (nolock)" 
			querycalendarmx +="  Where fixo=1"	
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
			}
			querycalendarmx +="    ) mff"
			querycalendarmx +="  inner join cm4 (nolock) on cm4.inactivo = 0  and cm4.u_nagenda = 0"
			
			querycalendarmx += " Union All"
			querycalendarmx +=" Select Case when mx.clnome = '' or mx.clno = 1 And Left(Cast(mx.texto as varchar(max)),3) like 'TTS%' then mx.texto "
			querycalendarmx +=" 	When mx.clnome = '' or mx.clno = 1 And Left(Cast(mx.texto as varchar(max)),3)<>'TTS' then 'TTS - ' + Cast(mx.texto as varchar(max)) "
			querycalendarmx +=" 	Else ltrim(rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mx.clno and cl.estab=0),''))) end  as title" 
			querycalendarmx +=" ,mxid as id"
			querycalendarmx +=" ,Case when mx.u_reminder=1 Then 'black' Else "			
			querycalendarmx +=" 	Case "
			querycalendarmx +="			when mx.u_naoconf=1 then '" + corAgendNaoConf + "' "
			querycalendarmx +=" 		when mx.u_tipomx='05 SUPORTE' And mx.u_teletr=1 then '" + corSuporteTele + "' "
			querycalendarmx +=" 		when mx.u_tipomx='05 SUPORTE' then '" + corSuporte + "' "
			querycalendarmx +=" 		when mx.u_emcasa=1 then '" + corTTS + "' "
			querycalendarmx +=" 		when mx.u_teletr=1 then '" + corTeletrb + "' "
			querycalendarmx +=" else isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=mx.clno and cl.u_cormarc <> 0),'" + corAgendamentos + "') end end as color"
			querycalendarmx +=" ,Case "
			querycalendarmx +="		when mx.u_naoconf=1 then '" + corAgendNaoConf + "' "
			querycalendarmx +=" 	when mx.u_tipomx='05 SUPORTE' And mx.u_teletr=1 then '" + corSuporteTele + "' "
			querycalendarmx +=" 	when mx.u_tipomx='05 SUPORTE' then '" + corSuporte + "' "
			querycalendarmx +=" 	when mx.u_emcasa=1 then '" + corTTS + "' "
			querycalendarmx +=" 	when mx.u_teletr=1 then '" + corTeletrb + "' "
			querycalendarmx +=" else isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=mx.clno and cl.u_cormarc <> 0),'" + corAgendamentos + "') end as backgroundColor"
			querycalendarmx +=" ,'redEvent' as className"	
			querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hinicio='' then '08:00' else hinicio end)+':00' as start"
			querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hfim='' then '19:00' else hfim end)+':00' as 'end'"
			querycalendarmx +=" ,mx.tecnico as resourceId,mx.tecnnm as tecnico"
			querycalendarmx +=" ,Case when mx.clnome = '' then  cast(mx.texto as char(8000)) else ltrim(rtrim(mx.clnome)) + ' | ' + cast(mx.texto as char(8000)) end as description"
			querycalendarmx +=" ,'mx' as tabela,mxstamp as stamp,mx.u_fref as projeto,u_tipomx as tipo"
			querycalendarmx += "  ,ltrim(rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mx.clno and cl.estab=0),''))) as cliente"
			querycalendarmx +="  ,cast(mx.texto as char(8000)) as texto,mx.u_naoconf as naoconf,mx.u_emcasa as emcasa,mx.u_teletr as teletr,u_reminder as reminder,mx.u_nopat as nopat,mx.u_tipomx as tipomx"	
			querycalendarmx +=" From mx (nolock) "
			querycalendarmx +=" inner join cm4 (nolock) on cm4.cm = mx.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0"	
			querycalendarmx +=" Where mx.tecnico<>0"
			querycalendarmx +=" And mx.data>=getdate()-" + uNdias;		
			querycalendarmx +=  uFltProjeto;
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And mx.data between '" + uDataini + "' And '" + uDatafim + "'";
			}

			querycalendarmx += " Union All"
			
			querycalendarmx += " select 'FÉRIAS' as title,cast(cast(ano as char(4))+ltrim(rtrim(cast(pmes as varchar(2))))+ltrim(rtrim(cast(no as varchar(6)))) as numeric(15)) as id"
			querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as color"
			querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as backgroundColor"
			querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as className "
			querycalendarmx += " ,convert(char(10),datai,121)+' '+(case when horai='' then '09:00' else horai end)+':00' as start "
			querycalendarmx += " ,convert(char(10),dataf,121)+' '+(case when horaf='' then '18:00' else horaf end)+':00' as 'end' "
			querycalendarmx += " ,us.tecnico as resourceId,us.tecnnm as tecnico "
			querycalendarmx += " ,'FÉRIAS' as description"
			querycalendarmx += " ,'fp' as tabela,fpstamp as stamp,'Férias' as projeto,'' as tipo"
			querycalendarmx += "  ,'' as cliente"
			querycalendarmx +="  ,'Férias' as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
			querycalendarmx += " from fp (nolock)"
			querycalendarmx += " inner join us (nolock) on us.peno = fp.no"
			querycalendarmx += " inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0	" 
			querycalendarmx += " Where cm4.cm<>0  And (fp.datai>=getdate()-"+ uNdias+" Or fp.dataf>=getdate()-"+ uNdias+")"
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And (fp.datai between '" + uDataini + "' And '" + uDatafim + "'";
				querycalendarmx +=" Or fp.dataf between '" + uDataini + "' And '" + uDatafim + "')";
			}
				
		}else{
			querycalendar = ""

			querycalendarmx ="  Select mff.title,mff.id,mff.color,mff.backgroundColor,mff.className	"
			querycalendarmx +="   ,mff.start,mff.fim as 'end'"
			querycalendarmx +="   ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
			querycalendarmx +="   ,mff.description,mff.tabela,mff.stamp,'Feriado' as projeto,'' as tipo"
			querycalendarmx += "  ,'' as cliente"
			querycalendarmx +="  ,mff.description as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
			querycalendarmx +="  from (	"
			querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
			querycalendarmx +="  ,nkeyid as id"
			querycalendarmx +=" ,'" + corFeriados + "' as color"
			querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
			querycalendarmx +=" ,'redEvent' as className"	
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
			querycalendarmx +="  ,ff.sig as description"
			querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
			querycalendarmx +="  From ff (nolock)" 
			querycalendarmx +="  Where fixo=1 "	
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
			}
			querycalendarmx +="   Union	  "
			querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
			querycalendarmx +="  ,nkeyid as id"
			querycalendarmx +=" ,'" + corFeriados + "' as color"
			querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
			querycalendarmx +=" ,'redEvent' as className"	
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
			querycalendarmx +="  ,ff.sig as description"
			querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
			querycalendarmx +="  From ff (nolock)" 
			querycalendarmx +="  Where 1=1"	
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
			}
			querycalendarmx +="   Union	  "
			querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
			querycalendarmx +="  ,nkeyid as id"
			querycalendarmx +=" ,'" + corFeriados + "' as color"
			querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
			querycalendarmx +=" ,'redEvent' as className"	
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
			querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
			querycalendarmx +="  ,ff.sig as description"
			querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
			querycalendarmx +="  From ff (nolock)" 
			querycalendarmx +="  Where fixo=1"	
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
			}
			querycalendarmx +="    ) mff"
			querycalendarmx +="  inner join cm4 (nolock) on cm4.inactivo = 0  and cm4.u_nagenda = 0"
			
			querycalendarmx += " Union All"	
			querycalendarmx += " select 'FÉRIAS' as title,cast(cast(ano as char(4))+ltrim(rtrim(cast(pmes as varchar(2))))+ltrim(rtrim(cast(no as varchar(6)))) as numeric(15)) as id"
			querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as color"
			querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as backgroundColor"
			querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as className "
			querycalendarmx += " ,convert(char(10),datai,121)+' '+(case when horai='' then '09:00' else horai end)+':00' as start "
			querycalendarmx += " ,convert(char(10),dataf,121)+' '+(case when horaf='' then '18:00' else horaf end)+':00' as 'end' "
			querycalendarmx += " ,us.tecnico as resourceId,us.tecnnm as tecnico "
			querycalendarmx += " ,'FÉRIAS' as description"
			querycalendarmx += " ,'fp' as tabela,fpstamp as stamp,'Férias' as projeto,'' as tipo"
			querycalendarmx += "  ,'' as cliente"
			querycalendarmx +="  ,'Férias' as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
			querycalendarmx += " from fp (nolock)"
			querycalendarmx += " inner join us (nolock) on us.peno = fp.no"
			querycalendarmx += " inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0	" 
			querycalendarmx += " Where cm4.cm<>0  And (fp.datai>=getdate()-"+ uNdias+" Or fp.dataf>=getdate()-"+ uNdias+")";
			if ((uDataini!=="") && (uDatafim!=="")){
				querycalendarmx +=" And (fp.datai between '" + uDataini + "' And '" + uDatafim + "'";
				querycalendarmx +=" Or fp.dataf between '" + uDataini + "' And '" + uDatafim + "')";
			}			
		}		
	}else{
			
		querycalendar = "select (Case When rtrim(mh.agnome)='' then rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mh.no and cl.estab=0),'')) else rtrim(mh.agnome) end) + ' | PAT Nº '+cast(pa.nopat as CHAR(10))"
		querycalendar +=" as title"
		querycalendar +=" ,mhid as id"
		querycalendar +=" ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=pa.no and cl.u_cormarc <> 0),'" + corIntervencoes + "') as color"
		querycalendar +=" ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=pa.no and cl.u_cormarc <> 0),'" + corIntervencoes + "') as backgroundColor"
		querycalendar +=" ,'greenEvent' as className"
		querycalendar +=" ,convert(char(10),data,121)+' '+(case when hora='' then '08:00' else hora end)+':00' as start"
		querycalendar +=" ,convert(char(10),data,121)+' '+(case when horaf='' then '19:00' else horaf end)+':00' as 'end'"
		querycalendar +=" ,mh.tecnico as resourceId,mh.tecnnm as tecnico"
		querycalendar +=" ,pa.resumo as description"
		querycalendar +=" ,'mh' as tabela,mh.mhstamp as stamp,mh.fref as projeto,'' as tipo"
		querycalendar += " ,(Case When rtrim(mh.agnome)='' then rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mh.no and cl.estab=0),'')) else rtrim(mh.agnome) end) as cliente"
		querycalendar +=" ,pa.resumo as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
		querycalendar +=" from mh (nolock)"
		querycalendar +=" inner join pa (nolock) on pa.nopat = mh.nopat"
		querycalendar +=" inner join cm4 (nolock) on cm4.cm = mh.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0"
		querycalendar +=" Where  mh.tecnico<>0 "
		querycalendar +=" And mh.data>=getdate()-" + uNdias;
		querycalendar +=  uFltProjeto.replace(/mx/g,"mh");
		
		if ((uDataini!=="") && (uDatafim!=="")){
			querycalendar +=" And mh.data between '" + uDataini + "' And '" + uDatafim + "'";
		}
		
		querycalendarmx ="  Select mff.title,mff.id,mff.color,mff.backgroundColor,mff.className	"
		querycalendarmx +="   ,mff.start,mff.fim as 'end'"
		querycalendarmx +="   ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
		querycalendarmx +="   ,mff.description,mff.tabela,mff.stamp,'Feriado' as projeto,'' as tipo"
		querycalendarmx += "  ,'' as cliente"
		querycalendarmx +="  ,mff.description as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
		querycalendarmx +="  from (	"
		querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
		querycalendarmx +="  ,nkeyid as id"
		querycalendarmx +=" ,'" + corFeriados + "' as color"
		querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
		querycalendarmx +=" ,'redEvent' as className"	
		querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
		querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
		querycalendarmx +="  ,ff.sig as description"
		querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
		querycalendarmx +="  From ff (nolock)" 
		querycalendarmx +="  Where fixo=1 "	
		if ((uDataini!=="") && (uDatafim!=="")){
			querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
		}
		querycalendarmx +="   Union	  "
		querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
		querycalendarmx +="  ,nkeyid as id"
		querycalendarmx +=" ,'" + corFeriados + "' as color"
		querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
		querycalendarmx +=" ,'redEvent' as className"	
		querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
		querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
		querycalendarmx +="  ,ff.sig as description"
		querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
		querycalendarmx +="  From ff (nolock)" 
		querycalendarmx +="  Where 1=1"	
		if ((uDataini!=="") && (uDatafim!=="")){
			querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
		}
		querycalendarmx +="   Union	  "
		querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
		querycalendarmx +="  ,nkeyid as id"
		querycalendarmx +=" ,'" + corFeriados + "' as color"
		querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
		querycalendarmx +=" ,'redEvent' as className"	
		querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
		querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
		querycalendarmx +="  ,ff.sig as description"
		querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
		querycalendarmx +="  From ff (nolock)" 
		querycalendarmx +="  Where fixo=1"	
		if ((uDataini!=="") && (uDatafim!=="")){
			querycalendarmx +=" And case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6) else convert(char(10),data,121) end between '" + uDataini + "' And '" + uDatafim + "'";
		}
		querycalendarmx +="    ) mff"
		querycalendarmx +="  inner join cm4 (nolock) on cm4.inactivo = 0  and cm4.u_nagenda = 0"
		
		querycalendarmx += " Union All"
		querycalendarmx +=" Select Case when mx.clnome = '' or mx.clno = 1 And Left(Cast(mx.texto as varchar(max)),3) like 'TTS%' then mx.texto "
		querycalendarmx +=" 	When mx.clnome = '' or mx.clno = 1 And Left(Cast(mx.texto as varchar(max)),3)<>'TTS' then 'TTS - ' + Cast(mx.texto as varchar(max)) "
		querycalendarmx +=" 	Else ltrim(rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mx.clno and cl.estab=0),''))) end  as title" 
		querycalendarmx +=" ,mxid as id"
		querycalendarmx +=" ,Case when mx.u_reminder=1 Then 'black' Else Case when mx.u_naoconf=1 then '" + corAgendNaoConf + "' "
		querycalendarmx +=" 	when mx.u_tipomx='05 SUPORTE' And mx.u_teletr=1 then '" + corSuporteTele + "' "
		querycalendarmx +=" 	when mx.u_tipomx='05 SUPORTE' then '" + corSuporte + "' "
		querycalendarmx +=" 	when mx.u_emcasa=1 then '" + corTTS + "' "
		querycalendarmx +=" 	when mx.u_teletr=1 then '" + corTeletrb + "' "
		querycalendarmx +=" else isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=mx.clno and cl.u_cormarc <> 0),'" + corAgendamentos + "') end end as color"
		querycalendarmx +=" ,Case when mx.u_naoconf=1 then '" + corAgendNaoConf + "' "
		querycalendarmx +=" 	when mx.u_tipomx='05 SUPORTE' And mx.u_teletr=1 then '" + corSuporteTele + "' "
		querycalendarmx +=" 	when mx.u_tipomx='05 SUPORTE' then '" + corSuporte + "' "
		querycalendarmx +=" 	when mx.u_emcasa=1 then '" + corTTS + "' "
		querycalendarmx +=" 	when mx.u_teletr=1 then '" + corTeletrb + "' "
		querycalendarmx +=" else isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=mx.clno and cl.u_cormarc <> 0),'" + corAgendamentos + "') end as backgroundColor"
		querycalendarmx +=" ,'redEvent' as className"	
		querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hinicio='' then '08:00' else hinicio end)+':00' as start"
		querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hfim='' then '19:00' else hfim end)+':00' as 'end'"
		querycalendarmx +=" ,mx.tecnico as resourceId,mx.tecnnm as tecnico"
		querycalendarmx +=" ,Case when mx.clnome = '' then  cast(mx.texto as char(8000)) else ltrim(rtrim(mx.clnome)) + ' | ' + cast(mx.texto as char(8000)) end as description"
		querycalendarmx +=" ,'mx' as tabela,mxstamp as stamp,mx.u_fref as projeto,u_tipomx as tipo"
		querycalendarmx += "  ,ltrim(rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mx.clno and cl.estab=0),''))) as cliente"
		querycalendarmx +="  ,cast(mx.texto as char(8000)) as texto,mx.u_naoconf as naoconf,mx.u_emcasa as emcasa,mx.u_teletr as teletr,u_reminder as reminder,mx.u_nopat as nopat,mx.u_tipomx as tipomx"	
		querycalendarmx +=" From mx (nolock) "
		querycalendarmx +=" inner join cm4 (nolock) on cm4.cm = mx.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0"	
		querycalendarmx +=" Where mx.tecnico<>0"
		querycalendarmx +=" And mx.data>=getdate()-" + uNdias;		
		querycalendarmx +=  uFltProjeto;
		if ((uDataini!=="") && (uDatafim!=="")){
			querycalendarmx +=" And mx.data between '" + uDataini + "' And '" + uDatafim + "'";
		}

		querycalendarmx += " Union All"
		
		querycalendarmx += " select 'FÉRIAS' as title,cast(cast(ano as char(4))+ltrim(rtrim(cast(pmes as varchar(2))))+ltrim(rtrim(cast(no as varchar(6)))) as numeric(15)) as id"
		querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as color"
		querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as backgroundColor"
		querycalendarmx += " ,Case when fp.fechado=1 then 'limegreen' else '"+corAgendNaoConf+"' end as className "
		querycalendarmx += " ,convert(char(10),datai,121)+' '+(case when horai='' then '09:00' else horai end)+':00' as start "
		querycalendarmx += " ,convert(char(10),dataf,121)+' '+(case when horaf='' then '18:00' else horaf end)+':00' as 'end' "
		querycalendarmx += " ,us.tecnico as resourceId,us.tecnnm as tecnico "
		querycalendarmx += " ,'FÉRIAS' as description"
		querycalendarmx += " ,'fp' as tabela,fpstamp as stamp,'Férias' as projeto,'' as tipo"
		querycalendarmx += "  ,'' as cliente"
		querycalendarmx +="  ,'Férias' as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
		querycalendarmx += " from fp (nolock)"
		querycalendarmx += " inner join us (nolock) on us.peno = fp.no"
		querycalendarmx += " inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0	" 
		querycalendarmx += " Where cm4.cm<>0  And (fp.datai>=getdate()-"+ uNdias+" Or fp.dataf>=getdate()-"+ uNdias+")";
		if ((uDataini!=="") && (uDatafim!=="")){
			querycalendarmx +=" And (fp.datai between '" + uDataini + "' And '" + uDatafim + "'";
			querycalendarmx +=" Or fp.dataf between '" + uDataini + "' And '" + uDatafim + "')";
		}
		
		querycalendarmx += " Union All"
		querycalendarmx += "  Select Case when vi.nome = '' then vi.accao  else vi.nome end  as title"
		querycalendarmx += "  ,viid as id"
		querycalendarmx += "  ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.emno=vi.no and cl.u_cormarc <> 0),'" + corVisitas + "') as color"
		querycalendarmx += "  ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.emno=vi.no and cl.u_cormarc <> 0),'" + corVisitas + "') as backgroundColor"
		querycalendarmx += "  ,'redEvent' as className	"
		querycalendarmx += "  ,convert(char(10),data,121)+' '+(case when hora='' then '08:00' else hora end)+':00' as start"
		querycalendarmx += "  ,convert(char(19),DATEADD (mi , Case when duracao=0 then 15 else duracao end , cast(convert(char(10),data,121)+' '+(case when hora='' then '19:00' else hora end)+':00' as datetime)),121)  as 'end'"
		querycalendarmx += "  ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
		querycalendarmx += "  , Case when vi.nome = '' then vi.nome else + rtrim(vi.nome) + ' | '+ vi.resumo end as description"
		querycalendarmx += "  ,'vi' as tabela,vi.vistamp as stamp,vi.fref as projeto,'' as tipo "
		querycalendarmx += "  ,vi.nome as cliente"
		querycalendarmx +="  ,vi.resumo as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as bit) as teletr,cast(0 as bit) as reminder,cast(0 as numeric(10)) as nopat,'' as tipomx"	
		querycalendarmx += "  From vi (nolock) "
		querycalendarmx += "  inner join cm3 (nolock) on cm3.cm = vi.vendedor and cm3.inactivo=0 	"
		querycalendarmx += "  inner join us (nolock) on cm3.cm = us.vendedor and us.inactivo=0 	"
		querycalendarmx += "  inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0	"
		querycalendarmx += "  Where cm4.cm<>0 and vnamarca = 0 "
		querycalendarmx += "  And vi.data>=getdate()-" + uNdias;		
		if ((uDataini!=="") && (uDatafim!=="")){
			querycalendarmx +=" And vi.data between '" + uDataini + "' And '" + uDatafim + "'";
		}
		if (uFltProjeto!==""){
			querycalendarmx +=  " And 1=2 ";
		}

	}
	
	console.log("uFltProjeto -> " + uFltProjeto);	
	console.log(querycalendarmx);
}

function query_tipostecnicos(){

	query = "Select distinct cm4.cm4tdesc From cm4 (nolock) Where cm4.inactivo = 0 and cm4.u_nagenda = 0 And cm4.cm4tdesc <> '' Order by cm4.cm4tdesc "		
	
	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
		//console.log(json);
		if (json!==""){
			Carrega_tptecnico(json);
		}else{
		}
	});	

}
			
function query_resources(){

	waitwindow("A ler os dados do servidor !!!");
	query = "Select cm4.cm as id,cm4.cmdesc as title From cm4 (nolock) Where cm4.inactivo = 0  and cm4.u_nagenda = 0  Order by cm4.u_ordem,cm4.cmdesc "		
	
	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
		//console.log(json);
		if (json!==""){
			Carrega_resources(json);
		}else{
		}
	});

}

function ReCarrega_resources(json){
	
	dados_resources=[];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){			
			dados_resources.push({
				title: json.TbPhc[i].title,
				id: json.TbPhc[i].id		
			});	
			$('#calendar').fullCalendar( 'addResource', {
					id:json.TbPhc[i].id,
					title: json.TbPhc[i].title
			});  				
		}
	}			
}

function Carrega_resources(json){
	
	dados_resources=[];
	
	if ((tecniconm!=="") && (tecniconm!=="-1")){
		for(var i in json.TbPhc){ 
			if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){	
				jsonTecnico.push({
					descricao: json.TbPhc[i].title,
					valor: json.TbPhc[i].id,
					vazio:'',
					value: json.TbPhc[i].title+"."+json.TbPhc[i].id.toString()
				});				
				if (json.TbPhc[i].id.toString().toLowerCase().trim()===tecniconm.toLowerCase().trim()){
					console.log("encontrei")
					dados_resources.push({
						title: json.TbPhc[i].title,
						id: json.TbPhc[i].id		
					});								
				}
			}
		}				
		
	}else{
		for(var i in json.TbPhc){ 
			if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){	
				jsonTecnico.push({
					descricao: json.TbPhc[i].title,
					valor: json.TbPhc[i].id,
					vazio:'',
					value: json.TbPhc[i].title+"."+json.TbPhc[i].id.toString()
				});				
				dados_resources.push({
					title: json.TbPhc[i].title,
					id: json.TbPhc[i].id		
				});			
			}
		}				
	}

	var cbTecnico=$("#Calendar_cmdTecnico");
	PopularComboVal(cbTecnico,jsonTecnico,tecniconm,"Seleccionar Técnico...")
	
	CorrerCalendario();	
}

function Carrega_tptecnico(json){
	
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){	
			jsonTpTecnico.push({
				descricao: json.TbPhc[i].cm4tdesc,
				valor: json.TbPhc[i].cm4tdesc		
			});				
		}
	}		
	
	var cbTpTecnico=$("#Calendar_cmdTipoTecnico");
	PopularComboVal(cbTpTecnico,jsonTpTecnico,"","Seleccionar Tipo Técnico...")

	query_resources();
}

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

function CorrerCalendario(){

	waitwindow("A ler os dados do servidor !!!");
		
	carregarquerycalendario()

	var query = "";

	if (uTipo.trim()=="1"){
		query = querycalendarmx;	
	}else{
		query = querycalendar + "   Union All	  " + querycalendarmx ;	
	}						
			
	//console.log("query -> " + query);
	
	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
		//console.log(json);
		if (json!==""){
			DesenharCalendario(json);
		}else{
			alertify.error("Erro!!")
			fechawaitwindow();
		}
	});
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

function DesenharCalendario(json){		

	var objtema = $("[id='Calendar_cmdTtpo']");
	var tipo = objtema.val();
	
	calendario_porequipa(json);

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

function chemcasa(){
	var uEmCasa = $('#chkemcasa').is(':checked')
	if (uEmCasa===true){
		$('#chkteletrab').prop('checked', false);
	}
}

function chteletrab(){
	var uTeletrab = $('#chkteletrab').is(':checked')
	if (uTeletrab===true){
		$('#chkemcasa').prop('checked', false);
	}
}

function criarnovoevento(){
	
	//console.log(hoje());
	//var datai = hoje().toString().trim().substring(0, 10); 
	var datai = dthoje().toString().trim().substring(0, 10); 
	var horai = '09:00'; 
	var dataf = dthoje().toString().trim().substring(0, 10);  
	var horaf = '18:00';
	var tabela = "mx";
	var tipo = "";
	var soleitura = " readonly";
	if ((tabela==="mx") && (podealterar===true)){
		soleitura = ""
	}
		
	var form = $('<form id="event_form">'+
		'<div class="form-group has-success has-feedback">'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Técnico :</label>'+
		'<div class="col-sm-6">'+
		'<input maxlength="55" size="55" id="newevent_tec" name="newevent_tec" value=""  class="form-control NewWapp_txt"  placeholder="Técnico" data-toggle="tooltip" data-placement="top" title="Técnico"' + soleitura + '>'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Inicio :</label>'+
		'<div class="col-sm-5">'+
		'<input maxlength="10" size="10" type="date" id="newevent_datai" name="newevent_datai" value="'+ datai +'" class="form-control NewWapp_txt"  placeholder="Data Inicio" data-toggle="tooltip" data-placement="top" title="Data Inicio"' + soleitura + '>'+
		'</div>'+
		'<label class="col-sm-1 control-label">Hora:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horai" name="newevent_horai" value="'+ horai +'" class="form-control NewWapp_txt"  placeholder="Hora Inicio" data-toggle="tooltip" data-placement="top" title="Hora Inicio"' + soleitura + '>'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Fim:</label>'+
		'<div class="col-sm-5">'+
		'<input maxlength="10" size="10" type="date" id="newevent_dataf" name="newevent_dataf" value="'+ dataf +'" class="form-control NewWapp_txt"  placeholder="Data Fim" data-toggle="tooltip" data-placement="top" title="Data Fim" readonly>'+
		'</div>'+
		'<label class="col-sm-1 control-label">Hora:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horaf" name="newevent_horaf" value="'+ horaf +'" class="form-control NewWapp_txt"  placeholder="Hora Fim" data-toggle="tooltip" data-placement="top" title="Hora Fim"' + soleitura + '>'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Cliente :</label>'+
		'<div class="col-sm-10">'+
		'<input maxlength="55" size="55" id="newevent_cl" name="newevent_cl" value=""  class="form-control NewWapp_txt"  placeholder="Cliente" data-toggle="tooltip" data-placement="top" title="Cliente"' + soleitura + ' >'+ 
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Tipo :</label>'+
		'<div class="col-sm-6">'+
		'<select id="newevent_tipomx" value="" name="newevent_tipomx" class="form-control NewWapp_txt" placeholder="Tipo" data-toggle="tooltip" data-placement="top" title="Tipo" '  + soleitura + '>' +
		'</select>'+					
		//'<input maxlength="20" size="20" id="newevent_tipomx" name="newevent_tipomx" value="'+ calEvent.tipomx +'"  class="form-control NewWapp_txt"  placeholder="Tipo" data-toggle="tooltip" data-placement="top" title="Tipo" readonly>'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Projeto :</label>'+
		'<div class="col-sm-10">'+
		'<select id="newevent_fref" value="" name="newevent_fref" class="form-control NewWapp_txt" placeholder="Projeto" value="" data-toggle="tooltip" data-placement="top" title="Projeto" '  + soleitura + '>' +
		'</select>'+					
		//'<input maxlength="20" size="20" id="newevent_fref" name="newevent_fref" value="'+ calEvent.projeto +'"  class="form-control NewWapp_txt"  placeholder="Projeto" data-toggle="tooltip" data-placement="top" title="Projeto" readonly>'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<div class="row has-feedback">'+
		 '<div class="col-sm-4 col-sm-offset-2 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" id="chknaoconf" name="chknaoconf" class="NewWapp_txt" placeholder="Não Confirmado ?" data-toggle="tooltip" data-placement="top" title="Não Confirmado ?" >Não Confirmado ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '<div class="col-sm-4 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" id="chkreminder" name="chkreminder" class="NewWapp_txt" placeholder="Reminder p/cliente ?" data-toggle="tooltip" data-placement="top" title="Reminder p/cliente ?" >Reminder p/cliente ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '</div>'+
		'<div class="row has-feedback">'+
		 '<div class="col-sm-4 col-sm-offset-2 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" onchange="chemcasa()" id="chkemcasa" name="chkemcasa" class="NewWapp_txt" placeholder="Na TTS ?" data-toggle="tooltip" data-placement="top" title="Na TTS ?" >Na TTS ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '<div class="col-sm-4 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" onchange="chteletrab()" id="chkteletrab" name="chkteletrab" class="NewWapp_txt" placeholder="Teletrabalho ?" data-toggle="tooltip" data-placement="top" title="Teletrabalho ?">Teletrabalho ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-3 control-label">Descrição :</label>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<div class="col-sm-12">'+
		'<textarea rows="3" id="newevent_desc" class="form-control" placeholder="Descrição"' + soleitura + '></textarea>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</form>');
			
		var buttons = $('<div class="pull-left">'+
						'<button id="event_cancel" type="cancel" class="btn btn-warning btn-label-left">'+
						'<span><i class="fa fa-ban txt-default"></i></span>'+
						'Fechar'+
						'</button>'+
						'</div>'+
						'<div class="pull-right">'+
						(podealterar===true ? 
							'<button type="submit" id="event_guardar" class="btn btn-success btn-label-left">'+
							'<span><i class="fa fa-calendar-check-o txt-default"></i></span>'+
							'Guardar'+							
							'</button>'
						: "") +
						'</div>');
				
	
	jsonProjetos = [];

	OpenModalBox('Criar marcação', form, buttons);

	var uNo = "0";
	var uEstab = "0";
	var uNome = "";
	var uCliente = $('#newevent_cl').val();
	var uTipomx = $('#newevent_tipomx').val();
	var uProjeto = $('#newevent_fref').val();
	
	if ((uTipomx===null) || (uTipomx===undefined)){
		uTipomx = ""
	}

	if ((uProjeto===null) || (uProjeto===undefined) || (uProjeto.toString().trim()==="-1")){
		uProjeto = ""
	}

	if ((uCliente===null) || (uCliente===undefined)){
		uCliente = ""
	}
	
	for(var i in jsonClientes){ 					
		if ((jsonClientes[i].nome.trim()===uCliente) || (jsonClientes[i].nome2.trim()===uCliente)){			
			uNo = jsonClientes[i].no.toString().trim();
			uEstab = jsonClientes[i].estab.toString().trim();
			uNome = jsonClientes[i].nome.trim();
		}
	}	
	
	waitwindow("A ler os dados do servidor !!!");
	
	var query			
	query = "Select fref.fref,fref.nmfref "
		+	" From bo (nolock) "
		+	" Inner join fref (nolock) on fref.fref = bo.fref"
		+	" Where bo.ndos = 15 and bo.no = " + uNo + " and bo.fechada = 0"
		+	" And fref.u_fechado = 0"
		+	" Order by fref.fref";

	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

		if (json!==""){
			validou_projetos(json,uProjeto);
		}else{
			alertify.error("Erro ao ler os dados!!");
			fechawaitwindow();
		}
	});	

	var columnsTec = [{name: 'Tecnico',valueField: 'descricao',minWidth: '350px'}];
	
	$( "#newevent_tec" ).ttsautocomplete({
	  showHeader: false,
	  columns: columnsTec,		
	  source: jsonTecnico,
	  select: function(event, ui) {
			$('#newevent_tec').val(ui.item.descricao);					  
			return false;
	  }
	});			

	$("#newevent_tec").mousemove(function(e){
		
		var parentOffset = $("#newevent_tec").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_tec").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});			

	$("#newevent_tec").keypress(function(e){
		
		var parentOffset = $("#newevent_tec").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_tec").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});	
	
	var columnsCl = [{name: 'Nome',valueField: 'nome',minWidth: '350px'},{name: 'Vazio',valueField: 'vazio',minWidth: '25px'},{name: 'Nº',valueField: 'no',minWidth: '75px'},{name: 'Estab',valueField: 'estab',minWidth: '75px'},{name: 'Nome2',valueField: 'nome2',minWidth: '150px'}];
	
	$( "#newevent_cl" ).ttsautocomplete({
	  showHeader: false,
	  columns: columnsCl,		
	  source: jsonClientes,
	  select: function(event, ui) {
		if (ui.item.nome2!==""){
			$('#newevent_cl').val(ui.item.nome2);					  
		}else{
			$('#newevent_cl').val(ui.item.nome);					  					  
		}

		var uNo = "0";
		var uEstab = "0";
		var uNome = "";
		var uCliente = $('#newevent_cl').val();

		for(var i in jsonClientes){ 					
			if ((jsonClientes[i].nome.trim()===uCliente) || (jsonClientes[i].nome2.trim()===uCliente)){			
				uNo = jsonClientes[i].no.toString().trim();
				uEstab = jsonClientes[i].estab.toString().trim();
				uNome = jsonClientes[i].nome.trim();
			}
		}	
			
		var query			
		query = "Select fref.fref,fref.nmfref "
			+	" From bo (nolock) "
			+	" Inner join fref (nolock) on fref.fref = bo.fref"
			+	" Where bo.ndos = 15 and bo.no = " + uNo + " and bo.fechada = 0"
			+	" And fref.u_fechado = 0"
			+	" Order by fref.fref";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_projetos(json,uProjeto);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});	

		return false;
	  }
	});			

	$("#newevent_cl").mousemove(function(e){
		
		var parentOffset = $("#newevent_cl").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_cl").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});			
	
	$("#newevent_cl").keypress(function(e){
		
		var parentOffset = $("#newevent_cl").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_cl").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});			

	//console.log(jsonTiposMx);
	var cbTipomx=$("#newevent_tipomx");
	PopularComboVal(cbTipomx,jsonTiposMx,uTipomx,"Seleccionar Tipo...")
		
	$('#event_cancel').on('click', function(){
		CloseModalBox();
	});
		
	$('#event_guardar').on('click', function(){
		var uData = $('#newevent_datai').val();
		var uHorai = $('#newevent_horai').val();
		var uHoraf = $('#newevent_horaf').val();
		var uCliente = $('#newevent_cl').val();
		var uNomeTec = $('#newevent_tec').val();
		var uEmCasa = $('#chkemcasa').is(':checked').toString().trim().toLowerCase();
		var uTeletrab = $('#chkteletrab').is(':checked').toString().trim().toLowerCase();
		var uReminder = $('#chkreminder').is(':checked').toString().trim().toLowerCase();		
		var uNaoConf = $('#chknaoconf').is(':checked').toString().trim().toLowerCase();
		var uTipomx = $('#newevent_tipomx').val();
		var uProjeto = $('#newevent_fref').val();
		var uTitulo = $('#newevent_desc').val();
		var uTexto = $('#newevent_desc').val();
		var auxid = 0
		var newstamp = u_Stamp();
		var auxtitle = ""
		var uNo = "0";
		var uEstab = "0";
		var uNome = "";
		var uNoTec = 0;
		
		if (uNomeTec===""){
			alertify.error("O Técnico não pode estar vazio!!");
			return;
		}

		if (uCliente===""){
			alertify.error("O Cliente não pode estar vazio!!");
			return;
		}
		
		if ((uTipomx==="") || (uTipomx.toString().trim()==="-1")){
			alertify.error("O campo Tipo não pode estar vazio!!");
			return;
		}
		
		for(var i in dadoscal){ 
			auxid = dadoscal[i].id
		}					
		auxid = auxid + 1; 

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
		
		
		var calEvent = [];
	
		if ((uCliente==="") || (uNo=1)){
			calEvent.title= uTexto;			
		}else{
			calEvent.title= uCliente;			
		}
		calEvent.id= auxid;
		calEvent.color= corAgendamentos;
		calEvent.backgroundColor= corAgendamentos;
		calEvent.className= "";
		calEvent.start= uData + " " + uHorai;
		calEvent.end= uData + " " + uHoraf;
		calEvent.resourceId= uNoTec;
		calEvent.tecnico= uNomeTec;
		calEvent.tabela= "mx";
		calEvent.stamp= newstamp;
		calEvent.projeto= uProjeto;
		calEvent.tipo= uTipomx;
		calEvent.cliente= uCliente;
		calEvent.texto= uTexto;
		calEvent.naoconf= uNaoConf;
		calEvent.emcasa= uEmCasa;
		calEvent.teletr= uTeletrab;
		calEvent.reminder= uReminder;
		calEvent.nopat= "";
		calEvent.tipomx= uTipomx;
		calEvent.description= uTexto;

		guardarnovoevento(calEvent);
	});
			
			
}


function clicknoevento(calEvent){

	var datai = calEvent.start.format().toString().trim().substring(0, 10); 
	var horai = calEvent.start.format().toString().trim().substring(11, 16); 
	var dataf = calEvent.end.format().toString().trim().substring(0, 10); 
	var horaf = calEvent.end.format().toString().trim().substring(11, 16); 
	var tabela = calEvent.tabela.toString().toLowerCase().trim();
	var tipo = calEvent.tipo.toString().toUpperCase().trim();
	var soleitura = " readonly";
	if ((tabela==="mx") && (podealterar===true)){
		soleitura = ""
	}
		
	var form = $('<form id="event_form">'+
		'<div class="form-group has-success has-feedback">'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Técnico :</label>'+
		'<div class="col-sm-6">'+
		'<input maxlength="55" size="55" id="newevent_tec" name="newevent_tec" value="'+ calEvent.tecnico +'"  class="form-control NewWapp_txt"  placeholder="Técnico" data-toggle="tooltip" data-placement="top" title="Técnico"' + soleitura + '>'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Inicio :</label>'+
		'<div class="col-sm-5">'+
		'<input maxlength="10" size="10" type="date" id="newevent_datai" name="newevent_datai" value="'+ datai +'" class="form-control NewWapp_txt"  placeholder="Data Inicio" data-toggle="tooltip" data-placement="top" title="Data Inicio"' + soleitura + '>'+
		'</div>'+
		'<label class="col-sm-1 control-label">Hora:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horai" name="newevent_horai" value="'+ horai +'" class="form-control NewWapp_txt"  placeholder="Hora Inicio" data-toggle="tooltip" data-placement="top" title="Hora Inicio"' + soleitura + '>'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Fim:</label>'+
		'<div class="col-sm-5">'+
		'<input maxlength="10" size="10" type="date" id="newevent_dataf" name="newevent_dataf" value="'+ dataf +'" class="form-control NewWapp_txt"  placeholder="Data Fim" data-toggle="tooltip" data-placement="top" title="Data Fim" readonly>'+
		'</div>'+
		'<label class="col-sm-1 control-label">Hora:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horaf" name="newevent_horaf" value="'+ horaf +'" class="form-control NewWapp_txt"  placeholder="Hora Fim" data-toggle="tooltip" data-placement="top" title="Hora Fim"' + soleitura + '>'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Cliente :</label>'+
		'<div class="col-sm-10">'+
		'<input maxlength="55" size="55" id="newevent_cl" name="newevent_cl" value="'+ calEvent.cliente +'"  class="form-control NewWapp_txt"  placeholder="Cliente" data-toggle="tooltip" data-placement="top" title="Cliente"' + soleitura + ' >'+ 
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Tipo :</label>'+
		'<div class="col-sm-6">'+
		'<select id="newevent_tipomx" value="" name="newevent_tipomx" class="form-control NewWapp_txt" placeholder="Tipo" data-toggle="tooltip" data-placement="top" title="Tipo" '  + soleitura + '>' +
		'</select>'+					
		//'<input maxlength="20" size="20" id="newevent_tipomx" name="newevent_tipomx" value="'+ calEvent.tipomx +'"  class="form-control NewWapp_txt"  placeholder="Tipo" data-toggle="tooltip" data-placement="top" title="Tipo" readonly>'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-2 control-label">Projeto :</label>'+
		'<div class="col-sm-10">'+
		'<select id="newevent_fref" value="" name="newevent_fref" class="form-control NewWapp_txt" placeholder="Projeto" value="'+ calEvent.projeto +'" data-toggle="tooltip" data-placement="top" title="Projeto" '  + soleitura + '>' +
		'</select>'+					
		//'<input maxlength="20" size="20" id="newevent_fref" name="newevent_fref" value="'+ calEvent.projeto +'"  class="form-control NewWapp_txt"  placeholder="Projeto" data-toggle="tooltip" data-placement="top" title="Projeto" readonly>'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		 '<div class="col-sm-4 col-sm-offset-2 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" id="chknaoconf" name="chknaoconf" class="NewWapp_txt" placeholder="Não Confirmado ?" data-toggle="tooltip" data-placement="top" title="Não Confirmado ?" '+ (calEvent.naoconf.toString().trim().toLowerCase() === "true" ? " checked " : "") + ' ' + soleitura + '>Não Confirmado ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '<div class="col-sm-4 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" id="chkreminder" name="chkreminder" class="NewWapp_txt" placeholder="Reminder p/cliente ?" data-toggle="tooltip" data-placement="top" title="Reminder p/cliente ?" '+ (calEvent.reminder.toString().trim().toLowerCase() === "true" ? " checked " : "") + ' ' + soleitura + ' >Reminder p/cliente ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '</div>'+
		'<div class="row has-feedback">'+
		 '<div class="col-sm-4 col-sm-offset-2 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" onchange="chemcasa()" id="chkemcasa" name="chkemcasa" class="NewWapp_txt" placeholder="Na TTS ?" data-toggle="tooltip" data-placement="top" title="Na TTS ?" '+ (calEvent.emcasa.toString().trim().toLowerCase() === "true" ? " checked " : "") + ' ' + soleitura + ' >Na TTS ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '<div class="col-sm-4 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" onchange="chteletrab()" id="chkteletrab" name="chkteletrab" class="NewWapp_txt" placeholder="Teletrabalho ?" data-toggle="tooltip" data-placement="top" title="Teletrabalho ?" '+ (calEvent.teletr.toString().trim().toLowerCase() === "true" ? " checked " : "") + ' ' + soleitura + '>Teletrabalho ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-3 control-label">Descrição :</label>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<div class="col-sm-12">'+
		'<textarea rows="3" id="newevent_desc" class="form-control" placeholder="Descrição"' + soleitura + '>'+ calEvent.texto +'</textarea>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</form>');
		
		if ((tabela==="mx") && (tipo!=="") && (tipo!=="05 SUPORTE")){					
			var buttons = $('<div class="pull-left">'+
							'<button id="event_cancel" type="cancel" class="btn btn-warning btn-sm btn-label-left">'+
							'<span><i class="fa fa-ban txt-default"></i></span>'+
							'Fechar'+
							'</button>'+
							'</div>'+
							'<div class="pull-right">'+
							'<button id="event_criaint" class="btn btn-default btn-label-left">'+
							'<span><i class="fa fa-cogs txt-default"></i></span>'+
							'Cria Interv.'+							
							'</button>'+
							(podealterar===true ? 
								'<button id="event_duplicar" class="btn btn-success btn-label-left">'+
								'<span><i class="fa fa-calendar-plus-o txt-default"></i></span>'+
								'Duplicar'+							
								'</button>'+									
								'<button id="event_guardar" class="btn btn-success btn-label-left">'+
								'<span><i class="fa fa-calendar-check-o txt-default"></i></span>'+
								'Guardar'+							
								'</button>'+									
								'<button id="event_apagar" type="cancel" class="btn btn-danger btn-label-left">'+
								'<span><i class="fa fa-trash txt-default"></i></span>'+
								'Apagar'+
								'</button>'
							: "") +
							'</div>');
		}else{
			if (tabela==="mx"){					
				var buttons = $('<div class="pull-left">'+
								'<button id="event_cancel" type="cancel" class="btn btn-warning btn-label-left">'+
								'<span><i class="fa fa-ban txt-default"></i></span>'+
								'Fechar'+
								'</button>'+
								'</div>'+
								(podealterar===true ? 
									'<div class="pull-right">'+
									'<button type="submit" id="event_duplicar" class="btn btn-success btn-label-left">'+
									'<span><i class="fa fa-calendar-plus-o txt-default"></i></span>'+
									'Duplicar'+							
									'</button>'+
									'<button type="submit" id="event_guardar" class="btn btn-success btn-label-left">'+
									'<span><i class="fa fa-calendar-check-o txt-default"></i></span>'+
									'Guardar'+							
									'</button>'+
									'<button id="event_apagar" type="cancel" class="btn btn-danger btn-label-left">'+
									'<span><i class="fa fa-trash txt-default"></i></span>'+
									'Apagar'+
									'</button>'+
									'</div>'
								: "") +
								'');
			}else{
				var buttons = $('<button id="event_cancel" type="cancel" class="btn btn-warning btn-label-left">'+
								'<span><i class="fa fa-ban txt-default"></i></span>'+
								'Fechar'+
								'</button>');					
			}				
		}					
	
	jsonProjetos = [];

	OpenModalBox('Alterar marcação', form, buttons);

	var uNo = "0";
	var uEstab = "0";
	var uNome = "";
	var uCliente = $('#newevent_cl').val();

	for(var i in jsonClientes){ 					
		if ((jsonClientes[i].nome.trim()===uCliente) || (jsonClientes[i].nome2.trim()===uCliente)){			
			uNo = jsonClientes[i].no.toString().trim();
			uEstab = jsonClientes[i].estab.toString().trim();
			uNome = jsonClientes[i].nome.trim();
		}
	}	
	
	waitwindow("A ler os dados do servidor !!!");
	
	var query			
	query = "Select fref.fref,fref.nmfref "
		+	" From bo (nolock) "
		+	" Inner join fref (nolock) on fref.fref = bo.fref"
		+	" Where bo.ndos = 15 and bo.no = " + uNo + " and bo.fechada = 0"
		+	" And fref.u_fechado = 0"
		+	" Order by fref.fref";

	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

		if (json!==""){
			validou_projetos(json,calEvent.projeto);
		}else{
			alertify.error("Erro ao ler os dados!!");
			fechawaitwindow();
		}
	});	

	var columnsTec = [{name: 'Tecnico',valueField: 'descricao',minWidth: '350px'}];
	
	$( "#newevent_tec" ).ttsautocomplete({
	  showHeader: false,
	  columns: columnsTec,		
	  source: jsonTecnico,
	  select: function(event, ui) {
			$('#newevent_tec').val(ui.item.descricao);					  
			return false;
	  }
	});			

	$("#newevent_tec").mousemove(function(e){
		
		var parentOffset = $("#newevent_tec").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_tec").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});			

	$("#newevent_tec").keypress(function(e){
		
		var parentOffset = $("#newevent_tec").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_tec").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});	
	
	var columnsCl = [{name: 'Nome',valueField: 'nome',minWidth: '350px'},{name: 'Vazio',valueField: 'vazio',minWidth: '25px'},{name: 'Nº',valueField: 'no',minWidth: '75px'},{name: 'Estab',valueField: 'estab',minWidth: '75px'},{name: 'Nome2',valueField: 'nome2',minWidth: '150px'}];
	
	$( "#newevent_cl" ).ttsautocomplete({
	  showHeader: false,
	  columns: columnsCl,		
	  source: jsonClientes,
	  select: function(event, ui) {
		if (ui.item.nome2!==""){
			$('#newevent_cl').val(ui.item.nome2);					  
		}else{
			$('#newevent_cl').val(ui.item.nome);					  					  
		}

		var uNo = "0";
		var uEstab = "0";
		var uNome = "";
		var uCliente = $('#newevent_cl').val();

		for(var i in jsonClientes){ 					
			if ((jsonClientes[i].nome.trim()===uCliente) || (jsonClientes[i].nome2.trim()===uCliente)){			
				uNo = jsonClientes[i].no.toString().trim();
				uEstab = jsonClientes[i].estab.toString().trim();
				uNome = jsonClientes[i].nome.trim();
			}
		}	
			
		var query			
		query = "Select fref.fref,fref.nmfref "
			+	" From bo (nolock) "
			+	" Inner join fref (nolock) on fref.fref = bo.fref"
			+	" Where bo.ndos = 15 and bo.no = " + uNo + " and bo.fechada = 0"
			+	" And fref.u_fechado = 0"
			+	" Order by fref.fref";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

			if (json!==""){
				validou_projetos(json,calEvent.projeto);
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		});	

		return false;
	  }
	});			

	$("#newevent_cl").mousemove(function(e){
		
		var parentOffset = $("#newevent_cl").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_cl").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});			
	
	$("#newevent_cl").keypress(function(e){
		
		var parentOffset = $("#newevent_cl").offset();
		var auxleft = parentOffset.left;
		var auxtop = parentOffset.top;
		var auxheight = $("#newevent_cl").height();
		
		auxtop = auxtop + auxheight + 5;
		
		$('.ui-autocomplete').css('top', auxtop.toString() + 'px');
		$('.ui-autocomplete').css('left', auxleft.toString() + 'px');				
	});			

	//console.log(jsonTiposMx);
	var cbTipomx=$("#newevent_tipomx");
	PopularComboVal(cbTipomx,jsonTiposMx,calEvent.tipomx,"Seleccionar Tipo...")
	
	
	$('#event_cancel').on('click', function(){
		CloseModalBox();
	});
	$('#event_apagar').on('click', function(){
		apagarevento(calEvent);				
	});			
	$('#event_guardar').on('click', function(){
		var uOldData = calEvent.start.format().toString().trim().substring(0, 10);
		var uData = $('#newevent_datai').val();
		var uCliente = $('#newevent_cl').val();
		var uNomeTec = $('#newevent_tec').val();
		var uTipomx = $('#newevent_tipomx').val();
		
		if (uNomeTec===""){
			alertify.error("O Técnico não pode estar vazio!!");
			return;
		}

		if (uCliente===""){
			alertify.error("O Cliente não pode estar vazio!!");
			return;
		}
		
		if ((uTipomx==="") || (uTipomx.toString().trim()==="-1")){
			alertify.error("O campo Tipo não pode estar vazio!!");
			return;
		}
		
		if (uOldData!==uData){
			alertify.confirm("Guardar Registo","Alterou a data, quer mesmo guardar o registo ?", function () {	
				guardarevento(calEvent);
			}, function () {
				//alertify.set({ labels: { ok: "OK", cancel: "Cancelar" } });
				alertify.error("Cancelado pelo utilizador!!");
			}).set({'closable':false,'labels': {ok:'Guardar', cancel:'Cancelar'}});				
		}else{
			guardarevento(calEvent);			
		}																				
	});
	$('#event_duplicar').on('click', function(){
		var uCliente = $('#newevent_cl').val();
		var uNomeTec = $('#newevent_tec').val();
		var uTipomx = $('#newevent_tipomx').val();
		
		if (uNomeTec===""){
			alertify.error("O Técnico não pode estar vazio!!");
			return;
		}

		if (uCliente===""){
			alertify.error("O Cliente não pode estar vazio!!");
			return;
		}
		
		if ((uTipomx==="") || (uTipomx.toString().trim()==="-1")){
			alertify.error("O campo Tipo não pode estar vazio!!");
			return;
		}
		
		duplicarregisto(calEvent);							
						
	});
	$('#event_criaint').on('click', function(){
										
		var uCliente = $('#newevent_cl').val();
		var uNomeTec = $('#newevent_tec').val();
		var uTipomx = $('#newevent_tipomx').val();
		
		if (uNomeTec===""){
			alertify.error("O Técnico não pode estar vazio!!");
			return;
		}

		if (uCliente===""){
			alertify.error("O Cliente não pode estar vazio!!");
			return;
		}
		
		if ((uTipomx==="") || (uTipomx.toString().trim()==="-1")){
			alertify.error("O campo Tipo não pode estar vazio!!");
			return;
		}

		var query = ""
		var tabela = calEvent.tabela.toString().toLowerCase().trim()

		if (tabela==="mx"){

			Valida_Cria_Pat(calEvent);	

		}else{
			alertify.error("Não pode criar Intervenção!!!")
		}
									
	});					
			
}

function apagarevento(calEvent){

    alertify.confirm("Apagar Registo","Quer mesmo apagar o registo ?", function () {					
			//alertify.set({ labels: { ok: "OK", cancel: "Cancelar" } });

			var query = ""
			var tabela = calEvent.tabela.toString().toLowerCase().trim()
			var dataold = "";
			var tecnicoold = 0;
			var clienteold = "";

			if (tabela==="mx"){
				$('#calendar').fullCalendar('removeEvents', calEvent._id);

				//Apagar o registo do json
				for(var i in dadoscal){ 
					if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
						tecnicoold = dadoscal[i].resourceId; 
						dataold = dadoscal[i].start.toString().trim().substring(0, 10) + " das " + dadoscal[i].start.toString().trim().substring(11, 16) + " às " + dadoscal[i].end.toString().trim().substring(11, 16);; 
						clienteold = calEvent.cliente;
						dadoscal.splice(i,1)
					}
				}

				CloseModalBox()
				
				query = "delete from " + tabela +
				" where " + tabela + "stamp='" + calEvent.stamp + "'";	
			}else{
				alertify.error("Esse tipo de registo não pode ser eliminado!!!")
				CloseModalBox()
			}
			
			//	console.log(query);
			if (query!==""){
				waitwindow("A apagar o registo !!!");
				CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
					if (json!==""){
						envianotificacao(clienteold,dataold,"",dataold,tecnicoold,"",true);
						alertify.success("Registo eliminado!!!")
						fechawaitwindow();
					}else{
						alertify.error("Erro ao eliminar!!!")
						fechawaitwindow();
					}
				});				
			}
		}, function () {
			//alertify.set({ labels: { ok: "OK", cancel: "Cancelar" } });
			alertify.error("Cancelado pelo utilizador!!");
        }).set({'closable':false,'labels': {ok:'Apagar', cancel:'Cancelar'}});
		
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
		var uTeletrab = $('#chkteletrab').is(':checked').toString().trim().toLowerCase();
		var uReminder = $('#chkreminder').is(':checked').toString().trim().toLowerCase();
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
		calEvent.teletr= uTeletrab;
		calEvent.reminder= uReminder
		calEvent.tipomx= uTipomx;
		calEvent.description= uTexto;	
				
		var dataold = "";
		var tecnicoold = 0;
		var clienteold = "";
		var data = uData; 
				
		for(var i in dadoscal){ 
			if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
				tecnicoold = dadoscal[i].resourceId; 
				dataold = dadoscal[i].start.toString().trim().substring(0, 10) + " das " + dadoscal[i].start.toString().trim().substring(11, 16) + " às " + dadoscal[i].end.toString().trim().substring(11, 16);; 
				clienteold = calEvent.cliente;
				dadoscal[i].start= uData + " " + uHorai;
				dadoscal[i].end= uData + " " + uHoraf;
				dadoscal[i].texto= calEvent.texto;
				dadoscal[i].cliente=calEvent.cliente;
				dadoscal[i].title=calEvent.title;
				dadoscal[i].tecnico=calEvent.tecnico;
				dadoscal[i].resourceId=calEvent.resourceId;
				dadoscal[i].naoconf=uNaoConf;
				dadoscal[i].emcasa=uEmCasa;						
				dadoscal[i].teletr=uTeletrab;						
				dadoscal[i].reminder=uReminder
			}
		}

		var datanew = data + " das " + uHorai + " às " + uHoraf;
		var clientenew = calEvent.cliente;
				
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
		",u_teletr=" + (uTeletrab.toString().trim().toLowerCase() === "true" ? " 1 " : "0") +					
		",u_reminder=" + (uReminder.toString().trim().toLowerCase() === "true" ? " 1 " : "0") +					
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
				envianotificacao(clienteold,dataold,clientenew,datanew,tecnicoold,calEvent.resourceId,false);

				alertify.success("Registo alterado!!!")
				fechawaitwindow();
			}else{
				alertify.error("Erro ao alterar!!!")
				fechawaitwindow();
			}
		});				
	}
				
}

function guardarnovoevento(calEvent){
	var query = ""
	var tabela = calEvent.tabela.toString().toLowerCase().trim()

	if (tabela==="mx"){
		calEvent.description = $('#newevent_desc').val();
		var uData = $('#newevent_datai').val();
		var uHorai = $('#newevent_horai').val();
		var uHoraf = $('#newevent_horaf').val();
		var uCliente = $('#newevent_cl').val();
		var uNomeTec = $('#newevent_tec').val();
		var uEmCasa = $('#chkemcasa').is(':checked').toString().trim().toLowerCase();
		var uTeletrab = $('#chkteletrab').is(':checked').toString().trim().toLowerCase();
		var uReminder = $('#chkreminder').is(':checked').toString().trim().toLowerCase();
		var uNaoConf = $('#chknaoconf').is(':checked').toString().trim().toLowerCase();
		var uTipomx = $('#newevent_tipomx').val();
		var uProjeto = $('#newevent_fref').val();
		var uTexto = $('#newevent_desc').val();
		var auxid = 0
		var newstamp = u_Stamp();
		var auxtitle = ""
		var uNo = "0";
		var uEstab = "0";
		var uNome = "";
		var uNoTec = 0;
		
		for(var i in dadoscal){ 
			auxid = dadoscal[i].id
		}					
		auxid = auxid + 1; 

		for(var i in jsonClientes){ 					
			if ((jsonClientes[i].nome.trim()===calEvent.cliente) || (jsonClientes[i].nome2.trim()===calEvent.cliente)){			
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
		
		if ((calEvent.cliente==="") || (uNo===1)){
			auxtitle= uTexto;			
		}else{
			auxtitle= calEvent.cliente;			
		}		
							
		var query = "insert into mx (mxstamp,data,hinicio,hfim,inicio,fim,clnome,texto,nkeyid,ckeyid,tecnico,tecnnm,clno,clestab,morada,local,codpost,vendedor,vendnm,username,userno,tusername,tuserno,origem,u_naoconf,u_emcasa,u_teletr,u_reminder,u_fref,u_tipomx,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)"
		query += " values ('" + newstamp + "','" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "','" + uHorai + "','" + uHoraf + "'"
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" 
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')"  
		query += " ,'" + uNome + "','"+uTexto+"',isnull((select max(nkeyid)+1 from mx (nolock)),1),right(newid(),10)"
		query += " ," + uNoTec.toString().trim() +",'" + uNomeTec + "'"
		query += " ," + uNo +"," + uEstab 
		query += " ,isnull((select morada from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')"
		query += " ,isnull((select local from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')"
		query += " ,isnull((select codpost from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')"
		query += " ,isnull((select vendedor from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),0)"
		query += " ,isnull((select vendnm from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')"
		query += " ,isnull((select top 1 username from us where us.tecnico=" + uNoTec.toString().trim() + "),'')"
		query += " ,isnull((select top 1 userno from us where us.tecnico=" + uNoTec.toString().trim() + "),0)"
		query += " ,isnull((select top 1 username from us where us.tecnico=" + uNoTec.toString().trim() + "),'')"
		query += " ,isnull((select top 1 userno from us where us.tecnico=" + uNoTec.toString().trim() + "),0)"
		query += " ,'mx'"
		query += " ," + (uNaoConf.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + ""
		query += " ," + (uEmCasa.toString().trim().toLowerCase() === "true" ? " 1 " : "0")
		query += " ," + (uTeletrab.toString().trim().toLowerCase() === "true" ? " 1 " : "0")
		query += " ," + (uReminder.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + ",'"+uProjeto+"','"+uTipomx+"'" 
		query += ",'" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "')"
				
		var queryaux = "select u_mhstamp from mx (nolock) where tecnico=" + uNoTec.toString().trim()
				+ " and clno = " + uNo
				+ " and data = '" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "'"
				+ " and hinicio = '" + uHorai + "'";

		CorreNewWs("ExecQueryJson",sftkey("MAIN"),queryaux,function(json){
			console.log(json);
			if (json!==""){
				validou_se_existe(json,function(jaexiste){

					if (jaexiste===true){
						alertify.confirm("Guardar Registo","Já existe um registo para o mesmo Técnico/Cliente/Data e Hora, quer mesmo guardar ?", function () {	
							podeguardar(query,calEvent,auxtitle,auxid,uData,uHorai,uHoraf,newstamp);
						}, function () {
							alertify.error("Cancelado pelo utilizador!!");
							fechawaitwindow();
						}).set({'closable':false,'labels': {ok:'Guardar', cancel:'Cancelar'}});	
					}else{
						podeguardar(query,calEvent,auxtitle,auxid,uData,uHorai,uHoraf,newstamp);
					}
				});
			}else{
				alertify.error("Erro ao ler os dados!!");
				fechawaitwindow();
			}
		})	
		
		//console.log(query);
	}else{
		alertify.error("Esse tipo de registo não pode ser alterado!!!")
		CloseModalBox()
	}

}	

function podeguardar(query,calEvent,auxtitle,auxid,uData,uHorai,uHoraf,newstamp){
	if (query!==""){
		waitwindow("A guardar o registo !!!");

		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				envianotificacao("","",calEvent.cliente,uData + " " + uHorai,0,calEvent.resourceId,false);

				alertify.success("Registo criado!!!")
				
				dadoscal.push({
					title: auxtitle,
					id: auxid,
					color: calEvent.color,
					backgroundColor: calEvent.backgroundColor,
					className: calEvent.className,
					start: uData + " " + uHorai,
					end: uData + " " + uHoraf,
					resourceId: calEvent.resourceId,
					tecnico: calEvent.tecnico,
					tabela: calEvent.tabela,
					stamp: newstamp,
					projeto: calEvent.projeto,				
					tipo: calEvent.tipomx,
					cliente: calEvent.cliente,
					texto: calEvent.texto,
					naoconf: calEvent.naoconf,
					emcasa: calEvent.emcasa,
					teletr: calEvent.teletr,
					reminder: calEvent.reminder,
					nopat: calEvent.nopat,
					tipomx: calEvent.tipomx,
					description: calEvent.description					
				});	
				
				CloseModalBox()
				$('#calendar').fullCalendar('removeEvents');
				$('#calendar').fullCalendar( 'addEventSource', dadoscal);  
				fechawaitwindow();
			}else{
				alertify.error("Erro ao guardar!!!")
				fechawaitwindow();
			}
		});				
	}
}
	
function validou_se_existe(json,callback){
	
	if (json.length===0){
		callback(false);
	}else{
		for(var i in json.TbPhc){ 
			if(json.TbPhc[i].u_mhstamp!=="!#NA#!SEMDADOS"){
				callback(true);			
			}else{
				callback(false);
			}
		}		
	}
}
	
/* 
function Valida_Cria_Pat(calEvent){

	var query			
	query = "select u_mhstamp from mx (nolock) where mxstamp='"+calEvent.stamp+"' and u_mhstamp<>''";

	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
		console.log(json);

		if (json!==""){
			console.log(json);
			validou_mh(calEvent,json);
		}else{
			alertify.error("Erro ao ler os dados!!");
			fechawaitwindow();
		}
	})		
}
 */
function validou_mh(calEvent,json){
	
	if (calEvent.resourceId.toString().trim()===pub_tecnico.toString().trim()){
		for(var i in json.TbPhc){ 
			if(json.TbPhc[i].u_mhstamp!=="!#NA#!SEMDADOS"){
				if (json.TbPhc[i].fechado.toString().trim().toLowerCase()==="true"){
					alertify.error("O PAT já está fechado!!!")
					CloseModalBox();					
				}else{
					AlteraPat(calEvent,json);							
				}
			}else{
				CriaPat(calEvent);
			}
		}
	}else{
		alertify.error("Só pode criar intervenções dos seus agendamentos!!!")
	}	
}
	
function Valida_Cria_Pat(calEvent){

	waitwindow("A ler intervenção!!!");

	var query			
	query = "select mx.u_mhstamp,mh.data,mh.hora,mh.horaf,mh.ptipo,mh.mhtipo,mh.nopat"
	query += " ,left(CONVERT(VARCHAR, DATEADD(SECOND, mh.tdh * 3600, '00:00:00'), 108),5) tempodesc,relatorio,pa.fechado "
	query += " from mx (nolock) "
	query += " inner join mh (nolock) on mx.u_mhstamp=mh.mhstamp ";
	query += " inner join pa (nolock) on mh.nopat=pa.nopat ";
	query += " where mx.mxstamp='"+calEvent.stamp+"'";

	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

		if (json!==""){
			fechawaitwindow();
			validou_mh(calEvent,json);
		}else{
			alertify.error("Erro ao ler os dados!!");
			fechawaitwindow();
		}
	})		
}


function AlteraPat(calEvent,json){
		
	var datai = calEvent.start.format().toString().trim().substring(0, 10); 		
	var horai = calEvent.start.format().toString().trim().substring(11, 16); 
	var horaf = calEvent.end.format().toString().trim().substring(11, 16); 
	var horadesc = json.TbPhc[0].tempodesc
	var uTipo = json.TbPhc[0].ptipo
	var uStatus = json.TbPhc[0].mhtipo
	var uRelatorio = json.TbPhc[0].relatorio
	var uMhstamp = json.TbPhc[0].u_mhstamp
	var uNopat = json.TbPhc[0].nopat
	
	var form = $('<form id="event_form">'+
		'<div class="form-group has-success has-feedback">'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Data:</label>'+
		'<div class="col-sm-6">'+
		'<input maxlength="8" size="8" type="date" id="newevent_data" name="newevent_data" value="'+ datai +'" class="form-control NewWapp_txt"  placeholder="Data" data-toggle="tooltip" data-placement="top" title="Data">'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Hora Inicio:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horai" name="newevent_horai" value="'+ horai +'" class="form-control NewWapp_txt"  placeholder="Hora Inicio" data-toggle="tooltip" data-placement="top" title="Hora Inicio">'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Hora Fim:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horaf" name="newevent_horaf" value="'+ horaf +'" class="form-control NewWapp_txt"  placeholder="Hora Fim" data-toggle="tooltip" data-placement="top" title="Hora Fim">'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Tempo descontar:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horadesc" name="newevent_horadesc" value="' + horadesc + '" class="form-control NewWapp_txt"  placeholder="Hora Descontar" data-toggle="tooltip" data-placement="top" title="Hora Descontar">'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Tipo Intervenção:</label>'+
		'<div class="col-sm-6">'+
		'<select id="newevent_tipo" value="" name="newevent_tipo" class="form-control NewWapp_txt" placeholder="Tipo Intervenção" data-toggle="tooltip" data-placement="top" title="Tipo Intervenção">' +
		'</select>'+					
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Status Intervenção:</label>'+
		'<div class="col-sm-6">'+
		'<select id="newevent_status" value="" name="newevent_status" class="form-control NewWapp_txt" placeholder="Status Intervenção" data-toggle="tooltip" data-placement="top" title="Status Intervenção">' +
		'</select>'+					
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Relatório :</label>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<div class="col-sm-12">'+
		'<textarea rows="6" id="newevent_relatorio" class="form-control" placeholder="Relatório">' + uRelatorio + '</textarea>'+
		'</div>'+
		'</div>'+
		'</form>');
			
		var buttons = $('<div class="pull-left">'+
						'<button id="event_cancel" type="cancel" class="btn btn-warning btn-label-left">'+
						'<span><i class="fa fa-ban txt-default"></i></span>'+
						'Fechar'+
						'</button>'+
						'</div>'+
						'<div class="pull-right">'+
						'<button type="submit" id="event_guardar" class="btn btn-success btn-label-left">'+
						'<span><i class="fa fa-calendar-check-o txt-default"></i></span>'+
						'Guardar'+							
						'</button>'+
						'</div>');
			
	
	OpenModalBox('Intervenção', form, buttons);
		
	var cbATipo=$("#newevent_tipo");
	PopularComboVal(cbATipo,jsonATipos,uTipo,"Seleccionar Tipo...")

	var cbStatus=$("#newevent_status");
	PopularComboVal(cbStatus,jsonStatus,uStatus,"Seleccionar Status...")
	
	$('#event_cancel').on('click', function(){
		CloseModalBox();
	});
		
	$('#event_guardar').on('click', function(){
		var tabela = calEvent.tabela.toString().toLowerCase().trim()
		var uData = $('#newevent_data').val();
		var uHorai = $('#newevent_horai').val();
		var uHoraf = $('#newevent_horaf').val();
		var uHoradesc = $('#newevent_horadesc').val();
		var uTipo = $('#newevent_tipo').val();
		var uStatus = $('#newevent_status').val();
		var uRelatorio = $('#newevent_relatorio').val();
				
		if ((uTipo==="") || (uTipo.toString().trim()==="-1")){
			alertify.error("O campo Tipo Intervenção não pode estar vazio!!");
			return;
		}

		if ((uStatus==="") || (uStatus.toString().trim()==="-1")){
			alertify.error("O campo Status Intervenção não pode estar vazio!!");
			return;
		}

		if (uRelatorio===""){
			alertify.error("O campo Relatório não pode estar vazio!!");
			return;
		}
		
		calEvent.start= uData + " " + uHorai;
		calEvent.end= uData + " " + uHoraf;
				
		for(var i in dadoscal){ 
			if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
				dadoscal[i].start= uData + " " + uHorai;
				dadoscal[i].end= uData + " " + uHoraf;
			}
		}
				
		$('#calendar').fullCalendar('updateEvent', calEvent);
		
		var query = "update " + tabela + " set data='" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "'" +
		",inicio=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" + 
		",hinicio='" + uHorai + "'" +
		",fim=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')" + 
		",hfim='" + uHoraf + "'" +
		",usrdata=convert(char(10),getdate(),121)" +					
		",usrhora=convert(char(10),getdate(),108)" +					
		",usrinis='" + m_chinis + "'" + 					
		" where " + tabela + "stamp='" + calEvent.stamp + "'";	
			
					
		//console.log(query);
		if (query!==""){
			waitwindow("A alterar a marcação!!!");
			CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
				if (json!==""){
				}else{
					alertify.error("Erro ao guardar!!!")
					fechawaitwindow();
					return
				}
			});				
		}
	
		var query = "update mh set data='" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "'" +
		",hora = '" + uHorai + "'" +
		",horaf = '" + uHoraf + "'" +
		",ptipo = '" + uTipo + "'" +
		",mhtipo = '" + uStatus + "'" +
		",Relatorio= '" + uRelatorio + "'" +
		",moh = cast(datediff(minute,'01-01-1900 " + uHorai + "','01-01-1900 " + uHoraf +"') as numeric(10,2))/60-(select cast(datediff(minute,'01-01-1900 00:00:00','01-01-1900 " + uHoradesc + "') as numeric(10,2))/60)" +
		",tdh = (select cast(datediff(minute,'01-01-1900 00:00:00','01-01-1900 " + uHoradesc + "') as numeric(10,2))/60)" +
		",usrdata=convert(char(10),getdate(),121)" +					
		",usrhora=convert(char(10),getdate(),108)" +					
		",usrinis='" + m_chinis + "'" + 					
		" where mhstamp='" + uMhstamp + "'";	
				
		//console.log(query);
		if (query!==""){
			waitwindow("A alterar intervenção!!!");
			CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
				if (json!==""){
				}else{
					alertify.error("Erro ao guardar!!!")
					fechawaitwindow();
					return
				}
			});				
		}
		
		var fechado = ""
		
		if ((uStatus.trim().toUpperCase()==="50 - TERMINADO") || (uStatus.trim().toUpperCase()==="99 - CANCELADO")){
			fechado = "1"
		}else{
			fechado = "0"			
		}
	
		var query = "update pa set ptipo = '" + uTipo + "'" +
		",status = '" + uStatus + "'" +
		",usrdata=convert(char(10),getdate(),121)" +					
		",usrhora=convert(char(10),getdate(),108)" +					
		",usrinis='" + m_chinis + "'" + 					
		//",fechado = " + fechado +
		" from pa (nolock)" +
		" inner join mx (nolock) on mx.u_nopat=pa.nopat" +
		" Where mx.mxstamp = '" + calEvent.stamp  + "'"
				
		//console.log(query);
		if (query!==""){
			waitwindow("A alterar o PAT!!!");
			CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
				if (json!==""){
					alertify.success("Registo guardado!!!")
					AlteraExe(calEvent.stamp,uRelatorio);
					fechawaitwindow();
					CloseModalBox()		
				}else{
					alertify.error("Erro ao guardar!!!")
					fechawaitwindow();
					return
				}
			});				
		}

	});
						
}

function guarda_upgrade(uMxStamp){
	var datai = dthoje().toString().trim().substring(0, 10); 
		
	var form = jQuery('<form id="event_form">'+
		'	<div class="form-group has-success has-feedback">'+
		'	</div>'+
		'		<div class="row has-feedback">'+
		'			<label class="col-sm-4 control-label" id="lblartigo">Data do executável:</label>'+
		'			<div class="col-sm-6">'+
		'				<input maxlength="8" size="8" type="date" id="newevent_data" name="newevent_data" value="'+ datai +'" class="form-control NewWapp_txt"  placeholder="Data" data-toggle="tooltip" data-placement="top" title="Data">'+
		'			</div>'+
		'		</div>'+
		'		<div class="row has-feedback">'+
		'			<label class="col-sm-4 control-label" id="lblartigo">Versão:</label>'+
		'			<div class="col-sm-6">'+
		'				<input maxlength="4" size="4" type="numeric" id="newevent_versao" name="newevent_versao" value="" class="form-control NewWapp_txt"  placeholder="Versão" data-toggle="tooltip" data-placement="top" title="Versão">'+
		'			</div>'+
		'		</div>'+
		'		<div class="row has-feedback">'+
		'			<label class="col-sm-4 control-label" id="lblartigo">Tipo:</label>'+
		'			<select id="sel_tipo" value="" name="sel_tipo" class="form-control NewWapp_txt" placeholder="Tipo" data-toggle="tooltip" data-placement="top" title="Tipo">' +
		'		</div>'+


		'</div>'+
		'</form>');
		
		var buttons = jQuery('<div class="input-group pull-left">'+
						'<a id="evt_fechar" accesskey="I" title="" class="btn btn-default btn-sm btn-label-left" data-mainpagebutton="base" >'+
						'<span class="fa fa-close"></span> Fechar</a>'+
						'</div>'+
						'<div class="input-group pull-right">'+
						'<a id="evt_guardar" accesskey="I" title="" class="btn btn-default btn-sm btn-label-left" data-mainpagebutton="base" >'+
						'<span class="fa fa-save"></span> Guardar</a>'+
						'</div>');

	OpenModalBoxSup('modalboxupgrade','Upgrade Executável', form, buttons,true,30);
	jQuery('#evt_fechar').on('click', function(){
		CloseModalBoxSup('modalboxupgrade');
	});

	jQuery('#evt_guardar').on('click', function(){
		var uData = $('#newevent_data').val();
		var uVersao = $('#newevent_versao').val();
		var uTipo = $('#sel_tipo').val();
		
		if ((uTipo==="") || (uTipo.toString().trim()==="-1")){
			alertify.error("O campo Tipo não pode estar vazio!!");
			return;
		}

		if (uVersao===""){
			alertify.error("O campo Versão não pode estar vazio!!");
			return;
		}

		var query = "update sn set u_dataexe='" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "'" +
		",sntipo='" + uTipo + "'" +
		"from	sn " + 
		"inner	join pa (nolock) on pa.snno=sn.snno " +
		"inner	join mx (nolock) on pa.nopat=mx.u_nopat " +
		" where mx.mxstamp = '" + uMxStamp + "'";	
					
		console.log(query);
		if (query!==""){
			waitwindow("A alterar dados da instalação!!!");		
			CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
				if (json!==""){
					var auxversao = uVersao.toString().trim()
					query = "update ma set user1='" + auxversao + "'" +
					"from	ma " + 
					"inner	join pa (nolock) on pa.snno=ma.snno " +
					"inner	join mx (nolock) on pa.nopat=mx.u_nopat " +
					" where mx.mxstamp = '" + uMxStamp + "'";	
													
					guarda_ma(query);
				}else{
					alertify.error("Erro ao guardar!!!")
					fechawaitwindow();
				}
			});				
		}
	});
	
	var cbTipo=$("#sel_tipo");
	PopularComboVal(cbTipo,jsonTipoExe,"","Seleccionar Tipo...")

}

function guarda_ma(query){
	CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
		if (json!==""){
			alertify.success("Instalação alterada!");
			CloseModalBoxSup('modalboxupgrade');
			fechawaitwindow();
		}else{
			alertify.error("Erro ao guardar!!!")
			fechawaitwindow();
		}
	});				
}

function AlteraExe(uMxStamp,uRelatorio){

	uRelatorio = uRelatorio.toLowerCase();
	var n1 = uRelatorio.indexOf("exe");
	var n2 = uRelatorio.indexOf("versao");
	var n3 = uRelatorio.indexOf("versão");
	var n4 = uRelatorio.indexOf("upg");
	var n5 = uRelatorio.indexOf("atualiza");

	if ((n1>=0) || (n2>=0) || (n3>=0) || (n4>=0) || (n5>=0)){
		alertify.confirm("Upgrade","Foi efetuado upgrade ?", function () {					
			guarda_upgrade(uMxStamp);
		}, function () {
			alertify.error("Cancelado pelo utilizador!!");
		}).set({'closable':false,'labels': {ok:'Sim', cancel:'Não'}});
	
	} 

}

function CriaPat(calEvent){
		
	var datai = calEvent.start.format().toString().trim().substring(0, 10); 		
	var horai = calEvent.start.format().toString().trim().substring(11, 16); 
	var horaf = calEvent.end.format().toString().trim().substring(11, 16); 
	var horadesc = "00:00"
	if ((horai==="09:00") && (horaf==="18:00")){
		horadesc = "01:00"
	}
	var uTipo = "";
	var uStatus = "50 - TERMINADO";
	
	switch(calEvent.tipo.trim().toUpperCase()) {
	    case "03 CONTRATO":
	        uTipo = "2.Interv. no Cliente";
	        break;
	    case "04 PROJETO":
	        uTipo = "1.Projecto";
	        break;
	} 
	
	var form = $('<form id="event_form">'+
		'<div class="form-group has-success has-feedback">'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Data:</label>'+
		'<div class="col-sm-6">'+
		'<input maxlength="8" size="8" type="date" id="newevent_data" name="newevent_data" value="'+ datai +'" class="form-control NewWapp_txt"  placeholder="Data" data-toggle="tooltip" data-placement="top" title="Data">'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Hora Inicio:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horai" name="newevent_horai" value="'+ horai +'" class="form-control NewWapp_txt"  placeholder="Hora Inicio" data-toggle="tooltip" data-placement="top" title="Hora Inicio">'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Hora Fim:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horaf" name="newevent_horaf" value="'+ horaf +'" class="form-control NewWapp_txt"  placeholder="Hora Fim" data-toggle="tooltip" data-placement="top" title="Hora Fim">'+
		'</div>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Tempo descontar:</label>'+
		'<div class="col-sm-4">'+
		'<input maxlength="8" size="8" type="time" id="newevent_horadesc" name="newevent_horadesc" value="' + horadesc + '" class="form-control NewWapp_txt"  placeholder="Hora Descontar" data-toggle="tooltip" data-placement="top" title="Hora Descontar">'+
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Tipo Intervenção:</label>'+
		'<div class="col-sm-6">'+
		'<select id="newevent_tipo" value="" name="newevent_tipo" class="form-control NewWapp_txt" placeholder="Tipo Intervenção" data-toggle="tooltip" data-placement="top" title="Tipo Intervenção">' +
		'</select>'+					
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Status Intervenção:</label>'+
		'<div class="col-sm-6">'+
		'<select id="newevent_status" value="" name="newevent_status" class="form-control NewWapp_txt" placeholder="Status Intervenção" data-toggle="tooltip" data-placement="top" title="Status Intervenção">' +
		'</select>'+					
		'</div>'+
		'</div>'+
		'<br/>'+
		'<div class="row has-feedback">'+
		'<label class="col-sm-4 control-label">Relatório :</label>'+
		'</div>'+
		'<div class="row has-feedback">'+
		'<div class="col-sm-12">'+
		'<textarea rows="6" id="newevent_relatorio" class="form-control" placeholder="Relatório"></textarea>'+
		'</div>'+
		'</div>'+
		'</form>');
			
		var buttons = $('<div class="pull-left">'+
						'<button id="event_cancel" type="cancel" class="btn btn-warning btn-label-left">'+
						'<span><i class="fa fa-ban txt-default"></i></span>'+
						'Fechar'+
						'</button>'+
						'</div>'+
						'<div class="pull-right">'+
						'<button type="submit" id="event_guardar" class="btn btn-success btn-label-left">'+
						'<span><i class="fa fa-calendar-check-o txt-default"></i></span>'+
						'Guardar'+							
						'</button>' +
						'</div>');
			
	
	OpenModalBox('Intervenção', form, buttons);
		
	var cbATipo=$("#newevent_tipo");
	PopularComboVal(cbATipo,jsonATipos,uTipo,"Seleccionar Tipo...")

	var cbStatus=$("#newevent_status");
	PopularComboVal(cbStatus,jsonStatus,uStatus,"Seleccionar Status...")
	
	$('#event_cancel').on('click', function(){
		CloseModalBox();
	});
		
	$('#event_guardar').on('click', function(){
		var tabela = calEvent.tabela.toString().toLowerCase().trim()
		var uData = $('#newevent_data').val();
		var uHorai = $('#newevent_horai').val();
		var uHoraf = $('#newevent_horaf').val();
		var uHoradesc = $('#newevent_horadesc').val();
		var uTipo = $('#newevent_tipo').val();
		var uStatus = $('#newevent_status').val();
		var uRelatorio = $('#newevent_relatorio').val();
		
		if ((uTipo==="") || (uTipo.toString().trim()==="-1")){
			alertify.error("O campo Tipo Intervenção não pode estar vazio!!");
			return;
		}

		if ((uStatus==="") || (uStatus.toString().trim()==="-1")){
			alertify.error("O campo Status Intervenção não pode estar vazio!!");
			return;
		}

		if (uRelatorio===""){
			alertify.error("O campo Relatório não pode estar vazio!!");
			return;
		}
		
		calEvent.start= uData + " " + uHorai;
		calEvent.end= uData + " " + uHoraf;
				
		for(var i in dadoscal){ 
			if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
				dadoscal[i].start= uData + " " + uHorai;
				dadoscal[i].end= uData + " " + uHoraf;
			}
		}
				
		$('#calendar').fullCalendar('updateEvent', calEvent);
			
		var query = "update " + tabela + " set data='" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "'" +
		",inicio=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" + 
		",hinicio='" + uHorai + "'" +
		",fim=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')" + 
		",hfim='" + uHoraf + "'" +
		",usrdata=convert(char(10),getdate(),121)" +					
		",usrhora=convert(char(10),getdate(),108)" +					
		",usrinis='" + m_chinis + "'" + 					
		" where " + tabela + "stamp='" + calEvent.stamp + "'";	
			
					
		console.log(query);
		if (query!==""){
			waitwindow("A alterar marcação!!!");		
			CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
				if (json!==""){
					query = "exec dbo.[tts_cria_pa_mh] '" + calEvent.stamp + "','" + uTipo + "','" + uStatus + "','" + uRelatorio + "','" + uHoradesc + "'"
					guarda_pat(query,calEvent.stamp,uRelatorio);
				}else{
					alertify.error("Erro ao guardar!!!")
					fechawaitwindow();
				}
			});				
		}

	});
						
}

function guarda_pat(query,uMxStamp,uRelatorio){

	console.log(query);
	if (query!==""){
		waitwindow("A criar intervenção!!!");
		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				AlteraExe(uMxStamp,uRelatorio);
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
		
function duplicarregisto(calEvent){
	var query = ""
	var tabela = calEvent.tabela.toString().toLowerCase().trim()

	if (tabela==="mx"){
		var uData = $('#newevent_datai').val();
		var uHorai = $('#newevent_horai').val();
		var uHoraf = $('#newevent_horaf').val();
		var uCliente = $('#newevent_cl').val();
		var uNomeTec = $('#newevent_tec').val();
		var uEmCasa = $('#chkemcasa').is(':checked').toString().trim().toLowerCase();
		var uTeletrab = $('#chkteletrab').is(':checked').toString().trim().toLowerCase();
		var uReminder = $('#chkreminder').is(':checked').toString().trim().toLowerCase();
		var uNaoConf = $('#chknaoconf').is(':checked').toString().trim().toLowerCase();
		var uTipomx = $('#newevent_tipomx').val();
		var uProjeto = $('#newevent_fref').val();
		var uTexto = $('#newevent_desc').val();
		var auxid = 0
		var newstamp = u_Stamp();
		var auxtitle = ""
		var uNo = "0";
		var uEstab = "0";
		var uNome = "";
		var uNoTec = 0;
		
		for(var i in dadoscal){ 
			if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
				auxtitle = dadoscal[i].title
			}
			auxid = dadoscal[i].id
		}					
		auxid = auxid + 1; 

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
				
		if ((calEvent.cliente==="") || (uNo===1)){
			auxtitle= uTexto;			
		}else{
			auxtitle= uCliente;			
		}
		
		calEvent.start= uData + " " + uHorai;
		calEvent.end= uData + " " + uHoraf;
		calEvent.title= auxtitle;
		calEvent.resourceId= uNoTec;
		calEvent.tecnico= uNomeTec;
		calEvent.projeto= uProjeto;
		calEvent.tipo= uTipomx;
		calEvent.cliente= uCliente;
		calEvent.texto= uTexto;
		calEvent.naoconf= uNaoConf;
		calEvent.emcasa= uEmCasa;
		calEvent.teletr= uTeletrab;
		calEvent.reminder= uReminder
		calEvent.tipomx= uTipomx;
		calEvent.description= uTexto;	
									
		dadoscal.push({
			title: auxtitle,
			id: auxid,
			color: calEvent.color,
			backgroundColor: calEvent.backgroundColor,
			className: calEvent.className,
			start: uData + " " + uHorai,
			end: uData + " " + uHoraf,
			resourceId: calEvent.resourceId,
			tecnico: calEvent.tecnico,
			tabela: calEvent.tabela,
			stamp: newstamp,
			projeto: calEvent.projeto,				
			tipo: calEvent.tipomx,
			cliente: calEvent.cliente,
			texto: calEvent.texto,
			naoconf: calEvent.naoconf,
			emcasa: calEvent.emcasa,
			teletr: calEvent.teletr,
			reminder: calEvent.reminder,
			nopat: calEvent.nopat,
			tipomx: calEvent.tipomx,
			description: calEvent.description					
		});			

		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar( 'addEventSource', dadoscal);  
							
		CloseModalBox()

		query = "insert into mx (mxstamp,data,hinicio,hfim,inicio,fim,clnome,texto,nkeyid,ckeyid,cor,tecnico,tecnnm,clno,clestab,morada,local,codpost,origem,eorigem,descorigem,vendedor,vendnm,username,userno,tusername,tuserno,u_naoconf,u_duracao,u_emcasa,u_teletr,u_reminder,u_fref,u_tipomx,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)"
		query += " select '" + newstamp + "','" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "','" + uHorai + "','" + uHoraf + "'"
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" 
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')"  
		query += " ,'" + uNome + "','" + uTexto + "',isnull((select max(nkeyid)+1 from mx (nolock)),1),right(newid(),10),cor"
		query += " ," + uNoTec.toString().trim() +",'" + uNomeTec + "'"
		query += " ," + uNo +"," + uEstab 
		query += " ,isnull((select morada from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'') as morada"
		query += " ,isnull((select local from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'') as local"
		query += " ,isnull((select codpost from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'') as codpost"
		query += " ,origem,eorigem,descorigem"   
		query += " ,isnull((select vendedor from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),0) as vendedor"
		query += " ,isnull((select vendnm from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'') as vendnm"
		query += " ,isnull((select top 1 username from us where us.tecnico=" + uNoTec.toString().trim() + "),'') as username"
		query += " ,isnull((select top 1 userno from us where us.tecnico=" + uNoTec.toString().trim() + "),0) as userno"
		query += " ,isnull((select top 1 username from us where us.tecnico=" + uNoTec.toString().trim() + "),'') as tusername"
		query += " ,isnull((select top 1 userno from us where us.tecnico=" + uNoTec.toString().trim() + "),0) as tuserno"
		query += " ," + (uNaoConf.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + " as naoconf,u_duracao"
		query += " ," + (uEmCasa.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + " as emcasa"
		query += " ," + (uTeletrab.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + " as teletr"
		query += " ," + (uReminder.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + " as reminder,'" + uProjeto + "','" + uTipomx + "'" 
		query += ",'" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "'"
		query += " from mx (nolock) "
		query += " where mxstamp='" + calEvent.stamp + "'";	
		console.log(query);
	}else{
		alertify.error("Esse tipo de registo não pode ser alterado!!!")
		CloseModalBox()
	}
	
	//console.log(query);
	if (query!==""){
		waitwindow("A guardar o registo !!!");

		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				envianotificacao("","",calEvent.cliente,uData + " " + uHorai,0,calEvent.resourceId,false);

				alertify.success("Registo criado!!!")
				fechawaitwindow();
			}else{
				alertify.error("Erro ao guardar!!!")
				fechawaitwindow();
			}
		});				
	}
}

function calendario_porequipa(json){

	dadoscal=[];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){			
			dadoscal.push({
				title: json.TbPhc[i].title,
				id: json.TbPhc[i].id,
				color: json.TbPhc[i].color,
				backgroundColor: json.TbPhc[i].backgroundColor,
				className: "['event', '"+json.TbPhc[i].className+"']",
				start: json.TbPhc[i].start,
				end: json.TbPhc[i].end,
				resourceId: json.TbPhc[i].resourceId,
				tecnico: json.TbPhc[i].tecnico,
				tabela: json.TbPhc[i].tabela,
				stamp: json.TbPhc[i].stamp,
				projeto: json.TbPhc[i].projeto,
				tipo: json.TbPhc[i].tipo,
				cliente: json.TbPhc[i].cliente,
				texto: json.TbPhc[i].texto,
				naoconf: json.TbPhc[i].naoconf,
				emcasa: json.TbPhc[i].emcasa,
				teletr: json.TbPhc[i].teletr,
				reminder: json.TbPhc[i].reminder,
				nopat: json.TbPhc[i].nopat,
				tipomx: json.TbPhc[i].tipomx,
				description: json.TbPhc[i].description				
			});			
		}
	}	
	
	var calendar = $('#calendar').fullCalendar({
		schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'agendaDay,timelineDay,timelineWeek,timelineMonth,timelineYear'
			//right: 'timelineDay,timelineThreeDays,agendaWeek,month'
		},
		buttonText: {
			today: "Hoje",
			month: "Mês",
			year:"Ano",
			week: "Semana",
			day: "Dia"
		},			
		//titleFormat: {
		//	month: 'MMM YYYY',
		//	week: "D MMM YYYY",
		//	day: 'D MMM YYYY'
		//},
		columnFormat:{
			week:'ddd, D MMM'			
		},		
		locale:'pt',
		//now: dotoc(hoje()),
		editable: podealterar,
		//aspectRatio: 1.8,
		aspectRatio: 2.5,
		allDaySlot:false,
		minTime:"08:00:00",
		maxTime:"19:00:00",
		//minTime:"00:00:00",
		//maxTime:"24:00:00",
		
		ignoreTimezone: false,
		monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
		monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
		dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
		dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		//axisFormat: 'HH:mm',
		timeFormat: 'HH:mm',
		//timeFormat: {
		//	'time:': 'HH:mm',
		//	agenda: 'HH:mm'
		//},
		//scrollTime: '00:00',
		defaultView: vistapredefinida,
/* 		businessHours: {
			// days of week. an array of zero-based day of week integers (0=Sunday)
			dow: [ 1, 2, 3, 4,5 ], // Monday - Thursday

			start: '09:00', // a start time (10am in this example)
			end: '18:00', // an end time (6pm in this example)
		}, */
		businessHours: [
			{
				// days of week. an array of zero-based day of week integers (0=Sunday)
				dow: [ 1, 2, 3, 4,5 ], // Monday - Thursday

				start: '09:00', // a start time (10am in this example)
				end: '13:00', // an end time (6pm in this example)
			},	
			{
				// days of week. an array of zero-based day of week integers (0=Sunday)
				dow: [ 1, 2, 3, 4,5 ], // Monday - Thursday

				start: '14:00', // a start time (10am in this example)
				end: '18:00', // an end time (6pm in this example)
			}	
		],
		weekends: mostrafs,
		views: {
			agendaDay: {				
				slotLabelFormat:"HH:mm"		
				,buttonText: "Dia(h)"
				,slotDuration: '00:30'
				,titleFormat: 'dddd, D MMMM YYYY'			
			},
			timelineDay: {				
				slotLabelFormat:"HH:mm"		
				,buttonText: "Dia(h)"
				,slotDuration: '00:30'
				,titleFormat: 'dddd, D MMMM YYYY'			
			},
			timelineWeek: {
				slotDuration: '04:00'
				//slotDuration: '24:00'
			},
			timelineMonth: {
				slotDuration: '04:00'
				//slotDuration: '24:00'
			}
		},
/* 
		views: {
			timelineDay: {
				//slotLabelFormat:"HH:mm",
				buttonText: "Dia(h)",
				slotDuration: '24:00'
			},
			timelineWeek: {
				slotDuration: '24:00'
			}//,
			//timelineMonth: {
			//	slotDuration: '12:00'
			//}
		}, */
		
		navLinks: true,
		resourceAreaWidth: tamanhoResource,
		resourceLabelText: 'Técnicos',
		resources: dados_resources,
		events: dadoscal,
	eventClick: function(calEvent, jsEvent, view) {
		clicknoevento(calEvent);
	}
	
	,eventMouseover: function(calEvent, jsEvent, view) {

		var datai = calEvent.start.format().toString().trim().substring(0, 10); 		
		var horai = calEvent.start.format().toString().trim().substring(11, 16); 
		var dataf = calEvent.end.format().toString().trim().substring(0, 10); 		
		var horaf = calEvent.end.format().toString().trim().substring(11, 16); 
			
		 var tooltip = '<div class="tooltipevent" style="width:300px;height:250px;background:#fff;position:absolute;z-index:10001;">' 
			+ '<header class="row">'
				+ '<h5><b>'+calEvent.tecnico+'</b></h5>' 
				+ '<h4><b>'+calEvent.title.toString().trim().substring(0, 50) +'</b></h4>' 
				+ '<p>Data Inicio : <b>' + datai + '</b>' 
				+ ' | Hora Inicio : <b>' + horai + '</b></p>' 
				+ '<p>Data Fim : <b>' + dataf + '</b>' 
				+ ' | Hora Fim : <b>' + horaf + '</b></p>' 
				+ '<p>Cliente : <b>' + calEvent.cliente + '</b></p>' 
				+ '<p>Projeto : <b>' + calEvent.projeto + '</b></p>' 
				+ '<h6>'+calEvent.texto+'</h6>' 
			+ '</header>'			
		+ '</div>';
    $("body").append(tooltip);
    $(this).mouseover(function(e) {
        $(this).css('z-index', 10000);
        $('.tooltipevent').fadeIn('500');
        $('.tooltipevent').fadeTo('10', 1.9);
    }).mousemove(function(e) {
        $('.tooltipevent').css('top', e.pageY - 200);
        $('.tooltipevent').css('left', e.pageX + 20);
    });
		
		}
		,eventMouseout: function() { 
		
		     $(this).css('z-index', 8);
			$('.tooltipevent').remove();
		
		} 
		,eventResize: function(calEvent, delta, revertFunc) {
			
			var query = ""
			var tabela = calEvent.tabela.toString().toLowerCase().trim()
			var data = calEvent.start.format().toString().trim().substring(0, 10); 
			var uHorai = calEvent.start.format().toString().trim().substring(11, 16); 
			var uNomeTec = ""
			
			if (tabela==="mx"){
				var uHoraf = calEvent.end.format().toString().trim().substring(11, 16); 

				for(var i in jsonTecnico){ 					
					if (jsonTecnico[i].valor===calEvent.resourceId){			
						uNomeTec = jsonTecnico[i].descricao;
					}
				}	

				var dataold = "";
				var tecnicoold = 0;
				var clienteold = "";
				
				for(var i in dadoscal){ 
					if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
						tecnicoold = dadoscal[i].resourceId; 
						dataold = dadoscal[i].start.toString().trim().substring(0, 10) + " das " + dadoscal[i].start.toString().trim().substring(11, 16) + " às " + dadoscal[i].end.toString().trim().substring(11, 16);; 
						clienteold = calEvent.cliente;
						dadoscal[i].start= data + " " + uHorai;
						dadoscal[i].end= data + " " + uHoraf;
						dadoscal[i].tecnico=uNomeTec;
						dadoscal[i].resourceId=calEvent.resourceId;
					}
				}					

				var datanew = data + " das " + uHorai + " às " + uHoraf;
				var clientenew = calEvent.cliente;

				query = "update " + tabela + " set data='" + data.substring(0, 4)+data.substring(5, 7)+data.substring(8, 10) + "'" +
						",inicio=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" + 
						",hinicio='" + uHorai + "'" +
						",fim=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')" + 
						",hfim='" + uHoraf + "'" +
						",tecnico=" + calEvent.resourceId.toString().trim() + ",tecnnm=isnull((select cmdesc from cm4 (nolock) where cm=" + calEvent.resourceId.toString().trim() + "),'')" +  
						",username=isnull((select top 1 username from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),'')" +
						",userno=isnull((select top 1 userno from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),0)" +
						",tusername=isnull((select top 1 username from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),'')" +
						",tuserno=isnull((select top 1 userno from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),0)" + 
						",usrdata=convert(char(10),getdate(),121)" +					
						",usrhora=convert(char(10),getdate(),108)" +					
						",usrinis='" + m_chinis + "'" + 					
						" where " + tabela + "stamp='" + calEvent.stamp + "'";	
						//console.log(query)
			}else{
/* 				if (tabela==="vi"){
					query = "update " + tabela + " set data='" + data.substring(0, 4)+data.substring(5, 7)+data.substring(8, 10) + 
					"',hora='" + horai +
					"',vendedor=isnull((select cm3.cm from cm3 (nolock) " +
					" inner join us (nolock) on cm3.cm = us.vendedor and us.inactivo=0 " +
					" inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0 and cm4.cm=" + calEvent.resourceId.toString().trim() +
					" ),0) " +
					",vendnm=isnull((select cm3.cmdesc from cm3 (nolock) " +
					" inner join us (nolock) on cm3.cm = us.vendedor and us.inactivo=0 " +
					" inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0 and cm4.cm=" + calEvent.resourceId.toString().trim() +
					"),'') where " + tabela + "stamp='" + calEvent.stamp + "'";	
				}else{ */
					alertify.error("Esse tipo de registo não pode ser alterado!!!")
					revertFunc();
				/* } */
			}
			
			//console.log(query);
			if (query!==""){
				waitwindow("A guardar o registo !!!");

				CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
					if (json!==""){
						envianotificacao(clienteold,dataold,clientenew,datanew,tecnicoold,calEvent.resourceId,false);

						alertify.success("Registo alterado!!!")
						fechawaitwindow();
					}else{
						alertify.error("Esse tipo de registo não pode ser alterado!!!")
						fechawaitwindow();
						revertFunc();
					}
				});				
			}

		}
		
		,eventDrop: function(calEvent, delta, revertFunc) {
			
			var query = ""
			var tabela = calEvent.tabela.toString().toLowerCase().trim()
			var data = calEvent.start.format().toString().trim().substring(0, 10); 
			
			var uHorai = calEvent.start.format().toString().trim().substring(11, 16); 
			var uNomeTec = ""
			
			if (tabela==="mx"){
				var uHoraf = calEvent.end.format().toString().trim().substring(11, 16); 

				for(var i in jsonTecnico){ 					
					if (jsonTecnico[i].valor===calEvent.resourceId){			
						uNomeTec = jsonTecnico[i].descricao;
					}
				}	

				var dataold = "";
				var tecnicoold = 0;
				var clienteold = "";
				
				for(var i in dadoscal){ 
					if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
						tecnicoold = dadoscal[i].resourceId; 
						dataold = dadoscal[i].start.toString().trim().substring(0, 10) + " das " + dadoscal[i].start.toString().trim().substring(11, 16) + " às " + dadoscal[i].end.toString().trim().substring(11, 16);; 
						clienteold = calEvent.cliente;
						dadoscal[i].start= data + " " + uHorai;
						dadoscal[i].end= data + " " + uHoraf;
						dadoscal[i].tecnico=uNomeTec;
						dadoscal[i].resourceId=calEvent.resourceId;
					}
				}					

				var datanew = data + " das " + uHorai + " às " + uHoraf;
				var clientenew = calEvent.cliente;
				
				query = "update " + tabela + " set data='" + data.substring(0, 4)+data.substring(5, 7)+data.substring(8, 10) + "'" +
						",inicio=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" + 
						",hinicio='" + uHorai + "'" +
						",fim=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')" + 
						",hfim='" + uHoraf + "'" +
						",tecnico=" + calEvent.resourceId.toString().trim() + ",tecnnm=isnull((select cmdesc from cm4 (nolock) where cm=" + calEvent.resourceId.toString().trim() + "),'')" +  
						",username=isnull((select top 1 username from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),'')" +
						",userno=isnull((select top 1 userno from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),0)" +
						",tusername=isnull((select top 1 username from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),'')" +
						",tuserno=isnull((select top 1 userno from us where us.tecnico=" + calEvent.resourceId.toString().trim() + "),0)" + 
						",usrdata=convert(char(10),getdate(),121)" +					
						",usrhora=convert(char(10),getdate(),108)" +					
						",usrinis='" + m_chinis + "'" + 					
						" where " + tabela + "stamp='" + calEvent.stamp + "'";	
						//console.log(query)
			}else{
/* 				if (tabela==="vi"){
					query = "update " + tabela + " set data='" + data.substring(0, 4)+data.substring(5, 7)+data.substring(8, 10) + 
					"',hora='" + horai +
					"',vendedor=isnull((select cm3.cm from cm3 (nolock) " +
					" inner join us (nolock) on cm3.cm = us.vendedor and us.inactivo=0 " +
					" inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0 and cm4.cm=" + calEvent.resourceId.toString().trim() +
					" ),0) " +
					",vendnm=isnull((select cm3.cmdesc from cm3 (nolock) " +
					" inner join us (nolock) on cm3.cm = us.vendedor and us.inactivo=0 " +
					" inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0 and cm4.cm=" + calEvent.resourceId.toString().trim() +
					"),'') where " + tabela + "stamp='" + calEvent.stamp + "'";	
				}else{ */
					alertify.error("Esse tipo de registo não pode ser alterado!!!")
					revertFunc();
				/* } */
			}
			
			//console.log(query);
			if (query!==""){
				waitwindow("A guardar o registo !!!");

				CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
					if (json!==""){
						envianotificacao(clienteold,dataold,clientenew,datanew,tecnicoold,calEvent.resourceId,false);
						alertify.success("Registo alterado!!!");
						fechawaitwindow();
					}else{
						alertify.error("Esse tipo de registo não pode ser alterado!!!")
						fechawaitwindow();
						revertFunc();
					}
				});				
			}

		}

		
	});

	$(".fc-agendaDay-button").html("Dia/Horas");
		
    $('#calendar').fullCalendar('option', 'height', get_calendar_height());

	fechawaitwindow();
 
}

function parseDate(data) {		
    return new Date(parseInt(data.substring(0, 4)), parseInt(data.substring(5, 7))-1, parseInt(data.substring(8, 10)));
}

function datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24))+1;
}

function envianotificacao(clienteold,dataold,cliente,data,tecnicoold,tecnico,apagou){

	if ((apagou===undefined) || (apagou===null)){
		apagou = false
	}	
	var auxdata = parseDate(data);
	var uhoje = new Date();
	var diasemana = uhoje.getDay()
	var numdias = datediff(uhoje,auxdata)

	var envia = false;
	var texto = "Atenção: Foi criada marcação para o Cliente " + cliente.trim() + " para " + data + "!" 						

	if ((numdias < 8) && ((clienteold==="") || (clienteold!==cliente) || (dataold!==data)  || (tecnicoold!==tecnico))){
		envia = true;
	}
	
	if ((numdias < 8) && (apagou===true)){
		console.log(tecnicoold);
		query = "select top 1 userno,username from us (nolock) where us.tecnico=" + tecnicoold.toString().trim()
		if (query!==""){
			waitwindow("A enviar notificação !!!");

			CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
				if (json!==""){
					if(json.TbPhc[0].username!=="!#NA#!SEMDADOS"){			
						var url = window.location.href;
						var userno = json.TbPhc[0].userno.toString().trim();
						texto = "Atenção: A marcação para o Cliente " + clienteold.trim() + " em " + dataold.trim() + " foi eliminada!" 														
						Tts_notify(texto,url.toString().trim(),userno);
					}
					fechawaitwindow();
				}else{
					fechawaitwindow();
				}
			});				
		}		
	}else{		
		if (envia === true){
			if ((clienteold==="") && (dataold==="") && (tecnicoold===0)){
				query = "select top 1 userno,username from us (nolock) where us.tecnico=" + tecnico.toString().trim()
				if (query!==""){
					waitwindow("A enviar notificação !!!");

					CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
						if (json!==""){
							if(json.TbPhc[0].username!=="!#NA#!SEMDADOS"){			
								var url = window.location.href;
								var userno = json.TbPhc[0].userno.toString().trim();
								texto = "Atenção: Foi criada marcação para o Cliente " + cliente.trim() + " para " + data + "!" 						
								Tts_notify(texto,url.toString().trim(),userno);
							}
							fechawaitwindow();
						}else{
							fechawaitwindow();
						}
					});				
				}				
			}else{
				if (tecnicoold===tecnico){
				
					query = "select top 1 userno,username from us (nolock) where us.tecnico=" + tecnico.toString().trim()
					if (query!==""){
						waitwindow("A enviar notificação !!!");

						CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
							if (json!==""){
								if(json.TbPhc[0].username!=="!#NA#!SEMDADOS"){			
									var url = window.location.href;
									var userno = json.TbPhc[0].userno.toString().trim();
									if (clienteold===cliente){
										texto = "Atenção: A marcação do Cliente " + clienteold.trim() + " de " + dataold.trim() + " passou para " + data + "!" 						
									}else{
										texto = "Atenção: A marcação do Cliente " + clienteold.trim() + " de " + dataold.trim() + " passou para o cliente " + cliente.trim() + " para " + data + "!" 														
									}
									Tts_notify(texto,url.toString().trim(),userno);
								}
								fechawaitwindow();
							}else{
								fechawaitwindow();
							}
						});				
					}
				}else{

					query = "select top 1 userno,username from us (nolock) where us.tecnico=" + tecnicoold.toString().trim()
					if (query!==""){
						waitwindow("A enviar notificação !!!");

						CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
							if (json!==""){
								if(json.TbPhc[0].username!=="!#NA#!SEMDADOS"){			
									var url = window.location.href;
									var userno = json.TbPhc[0].userno.toString().trim();
									texto = "Atenção: A marcação para o Cliente " + clienteold.trim() + " em " + dataold.trim() + " foi eliminada!" 														
									Tts_notify(texto,url.toString().trim(),userno);
								}
								fechawaitwindow();
							}else{
								fechawaitwindow();
							}
						});				
					}
					
					query = "select top 1 userno,username from us (nolock) where us.tecnico=" + tecnico.toString().trim()
					if (query!==""){
						waitwindow("A enviar notificação !!!");

						CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
							if (json!==""){
								if(json.TbPhc[0].username!=="!#NA#!SEMDADOS"){			
									var url = window.location.href;
									var userno = json.TbPhc[0].userno.toString().trim();
									Tts_notify(texto,url.toString().trim(),userno);
								}
								fechawaitwindow();
							}else{
								fechawaitwindow();
							}
						});				
					}			
				}
			}
		}	
	}
}

function calendario_individual(json){

	dadoscal=[];
	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].pastamp!=="!#NA#!SEMDADOS"){			
			dadoscal.push({
				title: json.TbPhc[i].title,
				id: json.TbPhc[i].id,
				color: json.TbPhc[i].color,
				backgroundColor: json.TbPhc[i].backgroundColor,
				className: "['event', '"+json.TbPhc[i].className+"']",
				start: json.TbPhc[i].start,
				end: json.TbPhc[i].end,
				resourceId: json.TbPhc[i].resourceId,
				tecnico: json.TbPhc[i].tecnico,
				stamp: json.TbPhc[i].stamp,
				projeto: json.TbPhc[i].projeto,				
				tipo: json.TbPhc[i].tipo,
				cliente: json.TbPhc[i].cliente,
				texto: json.TbPhc[i].texto,
				naoconf: json.TbPhc[i].naoconf,
				emcasa: json.TbPhc[i].emcasa,
				teletr: json.TbPhc[i].teletr,
				reminder: json.TbPhc[i].reminder,
				nopat: json.TbPhc[i].nopat,
				tipomx: json.TbPhc[i].tipomx,
				description: json.TbPhc[i].description				
			});			
		}
	}	
	
	var calendar = $('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'agendaDay,agendaWeek,month'
		},		
		titleFormat: {
			month: 'MMM YYYY',
			week: "D MMM YYYY",
			day: 'D MMM YYYY'
		},
		columnFormat:{
			week:'ddd, D MMM'			
		},
			defaultView: 'agendaDay',
			aspectRatio: 2.5,
			allDaySlot:false,
			minTime:"00:00:00",
			maxTime:"24:00:00",
			ignoreTimezone: false,
			monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
			monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
			dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
			dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
			axisFormat: 'HH:mm',
			timeFormat: {
				'Hora:': 'HH:mm',
				agenda: 'HH:mm'
			},
			buttonText: {
				today: "Hoje",
				month: "Mês",
				week: "Semana",
				day: "Dia"
			},

		selectable: false,
		events:dadoscal,
		selectHelper: false,		
		editable: false,
		droppable: false, 	
		eventRender: function (event, element, icon) {
			if (event.description !== "") {
				element.attr('title', event.description);
			}
		},		        
		eventClick: function(calEvent, jsEvent, view) {
				
			var form = $('<form id="event_form">'+
				'<div class="form-group has-success has-feedback">'+
				'<div class="row has-feedback">'+
				'<label>Data: '+ calEvent.start._i +'</label>'+
				'</div>'+
				'<div class="row has-feedback">'+
				'<label>Técnico: '+ calEvent.tecnico +'</label>'+
				'</div>'+
				'<div class="row has-feedback">'+
				//'<div class="col-sm-11">'+
				//'<div class="col-sm-2">'+
				'<label">Nome do evento</label>'+
				//'</div>'+
				//'<div class="col-sm-8">'+
				'<input type="text" id="newevent_name" value="'+ calEvent.title +'" class="form-control" placeholder="Nome do evento">'+
				//'</div>'+
				//'</div>'+

				'</div>'+
				'<div class="row has-feedback">'+
				'<div>'+
				'<label>Descrição</label>'+
				'<textarea rows="3" id="newevent_desc" class="form-control" placeholder="Descrição">'+ calEvent.description +'</textarea>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</form>');
			var buttons = $('<button id="event_cancel" type="cancel" class="btn btn-warning btn-label-left">'+
							'<span><i class="fa fa-ban txt-default"></i></span>'+
							'Cancelar'+
							'</button>'+
							'<button id="event_delete" type="cancel" class="btn btn-danger btn-label-left">'+
							'<span><i class="fa fa-eraser txt-default"></i></span>'+
							'Apagar'+
							'</button>'+
							'<button type="submit" id="event_change" class="btn btn-success btn-label-left pull-right">'+
							'<span><i class="fa fa-check"></i></span>'+
							'Guardar'+
							'</button>');
			OpenModalBox('Alterar marcação', form, buttons);
			$('#event_cancel').on('click', function(){
				CloseModalBox();
			});
			$('#event_delete').on('click', function(){
				calendar.fullCalendar('removeEvents' , function(ev){
					return (ev._id == calEvent._id);
				});
				CloseModalBox();
			});
			$('#event_change').on('click', function(){
				calEvent.title = $('#newevent_name').val();
				calEvent.description = $('#newevent_desc').val();
				calendar.fullCalendar('updateEvent', calEvent);
				CloseModalBox()
			});
		}
	});	
}