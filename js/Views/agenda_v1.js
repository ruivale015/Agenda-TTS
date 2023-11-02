

// Variáveis Públicas
var pub_app = "tts/agenda.html";

var pub_urlws = "";
var pub_url = "";
var pub_caminho = "";
var pub_caminhoupload = "";
var pub_bdados = "";
var pub_bdadosphc = "";
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
var pub_versaoapp = "";
var mnAutologout = 30;
var mnCookiesLogin = 480;					
var pub_mnAutologout = 30;
var pub_mnCookiesLogin = 480;
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
var corTTS = "lightsteelblue";
var m_chinis = "WWW"

var mostrafs = true;
var horaini = "08:00:00";
var horafim = "19:00:00";

var dadoscal = [];
var documento = $(document);
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
var jsonClientes = [];
var jsonTiposMx = [];
var jsonProjetos = [];

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

	mytooltip();
	
	valida_filtros();

	carregar();
	
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
	$.getScript(pub_url+'tts/js/ttsjs.js', function(){
		var username= getCookie("INTRANETlogin_username");
		//alert(username);	
		var userpass= getCookie("INTRANETlogin_useri");
		//alert(userpass);	
		
		setTimeout(function(){ 
			
			waitwindow("A ler os dados do servidor !!!");
					
			var query			
			query = "select tema,u_alteramx as podealterar,iniciais from us (nolock) where usercode='"+username.toString()+"'";

			CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

				if (json!==""){
					validou_user(json);
				}else{
					alert("Erro ao ler os dados!!");
					fechawaitwindow();
				}
			});

			query = "select no,nome,estab,nome2"
			query += " From cl (nolock) Where inactivo=0 order by nome";
			CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
				console.log(json);
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
					alert("Erro ao ler os dados!!");
					fechawaitwindow();
				}
			});		
		
		
			var query			
			query = "select campo from dytable (nolock) where entityname = 'tipomx'";

			CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

				if (json!==""){
					validou_tipos(json);
				}else{
					alert("Erro ao ler os dados!!");
					fechawaitwindow();
				}
			});		
				
		}, 200); 
		//var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}	
		//var pub_passw = Base64.decode(userpass);
				
		
		var data = hoje();
		//alert(data.toString());
	}); 	

}


function validou_user(json){

	for(var i in json.TbPhc){ 
		if(json.TbPhc[i].tema!=="!#NA#!SEMDADOS"){
			
			m_chinis = json.TbPhc[i].iniciais;
			
			if (json.TbPhc[i].podealterar.toString().trim().toLowerCase()==="true"){
				podealterar = true
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
		if(json.TbPhc[i].descricao.toString().trim().toLowerCase()==="user_cor_TTS"){
			corTTS = json.TbPhc[i].cor;
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
											
documento.on("click", "#Calendar_HC", function () {	
	if (horaini === "08:00:00"){
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
	$('#calendar').fullCalendar('option', 'minTime', horaini);	
	$('#calendar').fullCalendar('option', 'maxTime', horafim);
	$(".fc-agendaDay-button").html("Dia/Horas");
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
	$('#txtdias').val(qtt.toString());
});
		
documento.on("click", ".btnqttmor", function () {
	var auxqtt = $('#txtdias').val();	
	qtt = Number(auxqtt)	
	qtt = qtt + 1;
	$('#txtdias').val(qtt.toString());
});
		
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
	
	console.log("Inicio Filtrar : "+hoje().toString()+" "+time())
	
	Calendar_CorrerFiltros();
	
	uFiltro = Calendar_Filtros;		

	//console.log("uFiltro -> "+uFiltro)
	AtualizarCalendarioInternecoes(uFiltro);

}

//Limpar filtros
documento.on("click", "#Calendar_LimpaFlt", function () {
	var uObjFlt = $("#Flt_Calendario");

	LimpaFiltros(uObjFlt);	

	var uFiltro = "";
	
	AtualizarCalendarioInternecoes("");
});        
  

function AtualizarCalendarioInternecoes(filtro){

	waitwindow("A Ler os técnicos, Aguarde!!");

	console.log("filtor -> " + filtro);

	
	query = "Select cm4.cm as id,cm4.cmdesc as title From cm4 (nolock) Where cm4.inactivo = 0  and cm4.u_nagenda = 0 " + filtro + " Order by cm4.u_ordem,cm4.cmdesc "
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
		
			waitwindow("A Ler as marcações, Aguarde!!");
			
			console.log("querycalendar -> " + querycalendar);
			console.log("filtro -> " + filtro);
			console.log("querycalendarmx -> " + querycalendarmx);
			console.log("pub_tecnico -> " + pub_tecnico);
			console.log("query -> " + query);
			
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

var dadoscal = [];
var dados_resources = [];

function carregarquerycalendario(){

	uNdias = $('#txtdias').val();

	querycalendar = "select (Case When rtrim(mh.agnome)='' then rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mh.no and cl.estab=0),'')) else rtrim(mh.agnome) end) + ' | PAT Nº '+cast(pa.nopat as CHAR(10))"
	querycalendar +=" as title"
	querycalendar +=" ,mhid as id"
	querycalendar +=" ,'green' as color"
	querycalendar +=" ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=pa.no and cl.u_cormarc <> 0),'" + corIntervencoes + "') as backgroundColor"
	querycalendar +=" ,'greenEvent' as className"
	querycalendar +=" ,convert(char(10),data,121)+' '+(case when hora='' then '08:00' else hora end)+':00' as start"
	querycalendar +=" ,convert(char(10),data,121)+' '+(case when horaf='' then '19:00' else horaf end)+':00' as 'end'"
	querycalendar +=" ,mh.tecnico as resourceId,mh.tecnnm as tecnico"
	querycalendar +=" ,pa.resumo as description"
	querycalendar +=" ,'mh' as tabela,mh.mhstamp as stamp,mh.fref as projeto,'' as tipo"
	querycalendar += " ,(Case When rtrim(mh.agnome)='' then rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mh.no and cl.estab=0),'')) else rtrim(mh.agnome) end) as cliente"
	querycalendar +=" ,pa.resumo as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as numeric(10)) as nopat,'' as tipomx"	
	querycalendar +=" from mh (nolock)"
	querycalendar +=" inner join pa (nolock) on pa.nopat = mh.nopat"
	querycalendar +=" inner join cm4 (nolock) on cm4.cm = mh.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0"
	querycalendar +=" Where  mh.tecnico<>0 "
	querycalendar +=" And mh.data>=getdate()-" + uNdias;

	querycalendarmx ="  Select mff.title,mff.id,mff.color,mff.backgroundColor,mff.className	"
	querycalendarmx +="   ,mff.start,mff.fim as 'end'"
	querycalendarmx +="   ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
	querycalendarmx +="   ,mff.description,mff.tabela,mff.stamp,'Feriado' as projeto,'' as tipo"
	querycalendarmx += "  ,'' as cliente"
	querycalendarmx +="  ,mff.description as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as numeric(10)) as nopat,'' as tipomx"	
	querycalendarmx +="  from (	"
	querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
	querycalendarmx +="  ,nkeyid as id"
	querycalendarmx +=" ,'grey' as color"
	querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
	querycalendarmx +=" ,'redEvent' as className"	
	querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
	querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())-1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
	querycalendarmx +="  ,ff.sig as description"
	querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
	querycalendarmx +="  From ff (nolock)" 
	querycalendarmx +="  Where fixo=1 "	
	querycalendarmx +="   Union	  "
	querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
	querycalendarmx +="  ,nkeyid as id"
	querycalendarmx +=" ,'grey' as color"
	querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
	querycalendarmx +=" ,'redEvent' as className"	
	querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
	querycalendarmx +="  ,case when fixo=1 then cast(year(getdate()) as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
	querycalendarmx +="  ,ff.sig as description"
	querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
	querycalendarmx +="  From ff (nolock)" 
	querycalendarmx +="  Where 1=1"	
	querycalendarmx +="   Union	  "
	querycalendarmx +="  Select tpffdesc+' - '+sig  as title"
	querycalendarmx +="  ,nkeyid as id"
	querycalendarmx +=" ,'grey' as color"
	querycalendarmx +=" ,'" + corFeriados + "' as backgroundColor"
	querycalendarmx +=" ,'redEvent' as className"	
	querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'00:00:00' else convert(char(10),data,121)+' '+'00:00:00' end as start "
	querycalendarmx +="  ,case when fixo=1 then cast(year(getdate())+1 as char(4))+right(convert(char(10),data,121),6)+' '+'23:59:59' else convert(char(10),data,121)+' '+'23:59:59' end as fim "
	querycalendarmx +="  ,ff.sig as description"
	querycalendarmx +="  ,'ff' as tabela,ffstamp as stamp "
	querycalendarmx +="  From ff (nolock)" 
	querycalendarmx +="  Where fixo=1"	
	querycalendarmx +="    ) mff"
	querycalendarmx +="  inner join cm4 (nolock) on cm4.inactivo = 0  and cm4.u_nagenda = 0"
	
	querycalendarmx += " Union All"
	querycalendarmx +=" Select Case when mx.clnome = '' or mx.clno = 1 then mx.texto else ltrim(rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mx.clno and cl.estab=0),''))) end  as title"
	querycalendarmx +=" ,mxid as id"
	querycalendarmx +=" ,'blue' as color"	
	querycalendarmx +=" ,Case when mx.u_naoconf=1 then '" + corAgendNaoConf + "' "
	querycalendarmx +=" 	when mx.u_tipomx='05 SUPORTE' then '" + corSuporte + "' "
	querycalendarmx +=" 	when mx.u_emcasa=1 then '" + corTTS + "' "
	querycalendarmx +=" else isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=mx.clno and cl.u_cormarc <> 0),'" + corAgendamentos + "') end as backgroundColor"
	querycalendarmx +=" ,'redEvent' as className"	
	querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hinicio='' then '08:00' else hinicio end)+':00' as start"
	querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hfim='' then '19:00' else hfim end)+':00' as 'end'"
	querycalendarmx +=" ,mx.tecnico as resourceId,mx.tecnnm as tecnico"
	querycalendarmx +=" ,Case when mx.clnome = '' then  cast(mx.texto as char(8000)) else ltrim(rtrim(mx.clnome)) + ' | ' + cast(mx.texto as char(8000)) end as description"
	querycalendarmx +=" ,'mx' as tabela,mxstamp as stamp,mx.u_fref as projeto,u_tipomx as tipo"
	querycalendarmx += "  ,ltrim(rtrim(isnull((select Case when cl.nome2='' then cl.nome else cl.nome2 end From cl(nolock) where cl.no=mx.clno and cl.estab=0),''))) as cliente"
	querycalendarmx +="  ,cast(mx.texto as char(8000)) as texto,mx.u_naoconf as naoconf,mx.u_emcasa as emcasa,mx.u_nopat as nopat,mx.u_tipomx as tipomx"	
	querycalendarmx +=" From mx (nolock) "
	querycalendarmx +=" inner join cm4 (nolock) on cm4.cm = mx.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0"	
	querycalendarmx +=" Where mx.tecnico<>0"
	querycalendarmx +=" And mx.data>=getdate()-" + uNdias;		
	querycalendarmx += " Union All"
	
	querycalendarmx += " select 'FÉRIAS' as title,cast(cast(ano as char(4))+ltrim(rtrim(cast(pmes as varchar(2))))+ltrim(rtrim(cast(no as varchar(6)))) as numeric(15)) as id"
	querycalendarmx += " ,'limegreen' as color"
	querycalendarmx += " ,'limegreen' as backgroundColor"
	querycalendarmx += " ,'limegreen' as className "
	querycalendarmx += " ,convert(char(10),datai,121)+' '+(case when horai='' then '09:00' else horai end)+':00' as start "
	querycalendarmx += " ,convert(char(10),dataf,121)+' '+(case when horaf='' then '18:00' else horaf end)+':00' as 'end' "
	querycalendarmx += " ,us.tecnico as resourceId,us.tecnnm as tecnico "
	querycalendarmx += " ,'FÉRIAS' as description"
	querycalendarmx += " ,'fp' as tabela,fpstamp as stamp,'Férias' as projeto,'' as tipo"
	querycalendarmx += "  ,'' as cliente"
	querycalendarmx +="  ,'Férias' as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as numeric(10)) as nopat,'' as tipomx"	
	querycalendarmx += " from fp (nolock)"
	querycalendarmx += " inner join us (nolock) on us.peno = fp.no"
	querycalendarmx += " inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0	" 
	querycalendarmx += " Where cm4.cm<>0  And fp.datai>=getdate()-" + uNdias;
    
	querycalendarmx += " Union All"
	querycalendarmx += "  Select Case when vi.nome = '' then vi.accao  else vi.nome end  as title"
	querycalendarmx += "  ,viid as id"
	querycalendarmx += "  ,'blue' as color"
	querycalendarmx += "  ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.emno=vi.no and cl.u_cormarc <> 0),'" + corVisitas + "') as backgroundColor"
	querycalendarmx += "  ,'redEvent' as className	"
	querycalendarmx += "  ,convert(char(10),data,121)+' '+(case when hora='' then '08:00' else hora end)+':00' as start"
	querycalendarmx += "  ,convert(char(19),DATEADD (mi , duracao , cast(convert(char(10),data,121)+' '+(case when hora='' then '19:00' else hora end)+':00' as datetime)),121)  as 'end'"
	querycalendarmx += "  ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
	querycalendarmx += "  , Case when vi.nome = '' then vi.nome else + rtrim(vi.nome) + ' | '+ vi.resumo end as description"
	querycalendarmx += "  ,'vi' as tabela,vi.vistamp as stamp,vi.fref as projeto,'' as tipo "
	querycalendarmx += "  ,vi.nome as cliente"
	querycalendarmx +="  ,vi.resumo as texto,cast(0 as bit) as naoconf,cast(0 as bit) as emcasa,cast(0 as numeric(10)) as nopat,'' as tipomx"	
	querycalendarmx += "  From vi (nolock) "
	querycalendarmx += "  inner join cm3 (nolock) on cm3.cm = vi.vendedor and cm3.inactivo=0 	"
	querycalendarmx += "  inner join us (nolock) on cm3.cm = us.vendedor and us.inactivo=0 	"
	querycalendarmx += "  inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0	"
	querycalendarmx += "  Where cm4.cm<>0"
	querycalendarmx += "  And vi.data>=getdate()-" + uNdias;		
	 
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

	var cbTecnico=$("#Calendar_cmdTecnico");
	PopularComboVal(cbTecnico,jsonTecnico,"","Seleccionar Técnico...")
	
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
		console.log(json);
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
	
	console.log("elemento");

	console.log(elemento);
	console.log(elemento.offset());
				
	var parentOffset = elemento.offset(); 
	var auxleft = parentOffset.left;
	console.log(auxleft);
	var auxtop = parentOffset.top;
	console.log(auxtop);

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
		console.log($(this));
		console.log($(this).offset());
					
		var parentOffset = $(this).offset(); 
		var auxleft = parentOffset.left;
		console.log(auxleft);
		mtop = mtop + auxleft;
		console.log(mtop);
		
		if (txtValor !== nomeelementofilho){
			somatopelementos($(this));			
			console.log($(this));
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
		 '<div class="col-sm-4 col-sm-offset-2 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" id="chknaoconf" name="chknaoconf" class="NewWapp_txt" placeholder="Não Confirmado ?" data-toggle="tooltip" data-placement="top" title="Não Confirmado ?" >Não Confirmado ?'+
				 '<i class="fa fa-square-o small" ' + soleitura + '></i>'+
			 '</label>'+
		 '</div>'+
		 '<div class="col-sm-3 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" id="chkemcasa" name="chkemcasa" class="NewWapp_txt" placeholder="Na TTS ?" data-toggle="tooltip" data-placement="top" title="Na TTS ?">Na TTS ?'+
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

	if ((uProjeto===null) || (uProjeto===undefined)){
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
			alert("Erro ao ler os dados!!");
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
				alert("Erro ao ler os dados!!");
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

	console.log(jsonTiposMx);
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
		 '<div class="col-sm-3 checkbox">' +
			 '<label>' +
				 '<input type="checkbox" id="chkemcasa" name="chkemcasa" class="NewWapp_txt" placeholder="Na TTS ?" data-toggle="tooltip" data-placement="top" title="Na TTS ?" '+ (calEvent.emcasa.toString().trim().toLowerCase() === "true" ? " checked " : "") + ' ' + soleitura + ' >Na TTS ?'+
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
			alert("Erro ao ler os dados!!");
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
				alert("Erro ao ler os dados!!");
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

	console.log(jsonTiposMx);
	var cbTipomx=$("#newevent_tipomx");
	PopularComboVal(cbTipomx,jsonTiposMx,calEvent.tipomx,"Seleccionar Tipo...")
	
	
	$('#event_cancel').on('click', function(){
		CloseModalBox();
	});
	$('#event_apagar').on('click', function(){
		apagarevento(calEvent);				
	});			
	$('#event_guardar').on('click', function(){
										
		guardarevento(calEvent);
										
	});
	$('#event_duplicar').on('click', function(){
							
		duplicarregisto(calEvent);							
						
	});
	$('#event_criaint').on('click', function(){
										
		//CloseModalBox();

		var query = ""
		var tabela = calEvent.tabela.toString().toLowerCase().trim()

		if (tabela==="mx"){

			CriaPat(calEvent);	

		}else{
			alertify.error("Não pode criar Intervenção!!!")
		}
									
	});					
			
}

function apagarevento(calEvent){
							
	var query = ""
	var tabela = calEvent.tabela.toString().toLowerCase().trim()

	if (tabela==="mx"){
		$('#calendar').fullCalendar('removeEvents', calEvent._id);

		//Apagar o registo do json
		for(var i in dadoscal){ 
			if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
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
		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				alertify.success("Registo eliminado!!!")
			}else{
				alertify.error("Erro ao eliminar!!!")
			}
		});				
	}
}		
		
function guardarevento(calEvent){
	console.log(calEvent);
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
		",u_fref='" + uProjeto + "'" +
		",u_tipomx='" + uTipomx + "'" +
		",u_naoconf=" + (uNaoConf.toString().trim().toLowerCase() === "true" ? " 1 " : "0") +
		",u_emcasa=" + (uEmCasa.toString().trim().toLowerCase() === "true" ? " 1 " : "0") +					
		" where " + tabela + "stamp='" + calEvent.stamp + "'";	
	}else{
		alertify.error("Esse tipo de registo não pode ser alterado!!!")
		CloseModalBox()
	}
	
	//	console.log(query);
	if (query!==""){
		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				alertify.success("Registo alterado!!!")
			}else{
				alertify.error("Erro ao alterar!!!")
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
			nopat: calEvent.nopat,
			tipomx: calEvent.tipomx,
			description: calEvent.description					
		});			

		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar( 'addEventSource', dadoscal);  
							
		CloseModalBox()

		query = "insert into mx (mxstamp,data,hinicio,hfim,inicio,fim,clnome,texto,nkeyid,ckeyid,tecnico,tecnnm,clno,clestab,morada,local,codpost,origem,u_naoconf,u_emcasa,u_fref,u_tipomx,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)"
		query += " values ('" + newstamp + "','" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "','" + uHorai + "','" + uHoraf + "'"
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" 
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')"  
		query += " ,'" + uNome + "','"+uTexto+"',isnull((select max(nkeyid)+1 from mx (nolock)),1),right(newid(),10)"
		query += " ," + uNoTec.toString().trim() +",'" + uNomeTec + "'"
		query += " ," + uNo +"," + uEstab 
		query += " ,isnull((select morada from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')"
		query += " ,isnull((select local from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')"
		query += " ,isnull((select codpost from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'')"
		query += " ,'mx'"
		query += " ," + (uNaoConf.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + ""
		query += " ," + (uEmCasa.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + ",'"+uProjeto+"','"+uTipomx+"'" 
		query += ",'" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "')"
		
	}else{
		alertify.error("Esse tipo de registo não pode ser alterado!!!")
		CloseModalBox()
	}
	
		console.log(query);
	if (query!==""){
		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				alertify.success("Registo criado!!!")
			}else{
				alertify.error("Erro ao guardar!!!")
			}
		});				
	}
}	

function CriaPat(calEvent){
		
	var datai = calEvent.start.format().toString().trim().substring(0, 10); 		
	var horai = calEvent.start.format().toString().trim().substring(11, 16); 
	var horaf = calEvent.end.format().toString().trim().substring(11, 16); 
		
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
		'<input maxlength="8" size="8" type="time" id="newevent_horadesc" name="newevent_horadesc" value="00:00" class="form-control NewWapp_txt"  placeholder="Hora Descontar" data-toggle="tooltip" data-placement="top" title="Hora Descontar">'+
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
		'<textarea rows="6" id="newevent_desc" class="form-control" placeholder="Relatório"></textarea>'+
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
				
	
	OpenModalBox('Intervenção', form, buttons);
			
	$('#event_cancel').on('click', function(){
		CloseModalBox();
	});
		
	$('#event_guardar').on('click', function(){

		alertify.success("Gravar!!")
	
		CloseModalBox();

		return
		
/* 		var uData = $('#newevent_datai').val();
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
		calEvent.nopat= "";
		calEvent.tipomx= uTipomx;
		calEvent.description= uTexto;

		guardarnovoevento(calEvent); */
	});
						
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
			nopat: calEvent.nopat,
			tipomx: calEvent.tipomx,
			description: calEvent.description					
		});			

		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar( 'addEventSource', dadoscal);  
							
		CloseModalBox()

		query = "insert into mx (mxstamp,data,hinicio,hfim,inicio,fim,clnome,texto,nkeyid,ckeyid,cor,tecnico,tecnnm,clno,clestab,morada,local,codpost,origem,vendedor,vendnm,username,userno,eorigem,tusername,tuserno,descorigem,u_naoconf,u_duracao,u_emcasa,u_fref,u_nopat,u_tipomx,ousrinis,ousrdata,ousrhora,usrinis,usrdata,usrhora)"
		query += " select '" + newstamp + "','" + uData.substring(0, 4)+uData.substring(5, 7)+uData.substring(8, 10) + "','" + uHorai + "','" + uHoraf + "'"
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" 
		query += " ,datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')"  
		query += " ,'" + uNome + "','" + uTexto + "',isnull((select max(nkeyid)+1 from mx (nolock)),1),right(newid(),10),cor"
		query += " ," + uNoTec.toString().trim() +",'" + uNomeTec + "'"
		query += " ," + uNo +"," + uEstab 
		query += " ,isnull((select morada from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'') as morada"
		query += " ,isnull((select local from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'') as local"
		query += " ,isnull((select codpost from cl (nolock) where cl.no=" + uNo +" and cl.estab=" + uEstab +"),'') as codpost"
		query += " ,origem,vendedor,vendnm,username,userno,eorigem,tusername,tuserno,descorigem"
		query += " ," + (uNaoConf.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + " as naoconf,u_duracao"
		query += " ," + (uEmCasa.toString().trim().toLowerCase() === "true" ? " 1 " : "0") + " as emcasa,'" + uProjeto + "',u_nopat,'" + uTipomx + "'" 
		query += ",'" + m_chinis + "','" + dtoshoje() + "','" + time() + "','" + m_chinis+ "','" + dtoshoje() + "','" + time() + "'"
		query += " from mx (nolock) "
		query += " where mxstamp='" + calEvent.stamp + "'";	
		
	}else{
		alertify.error("Esse tipo de registo não pode ser alterado!!!")
		CloseModalBox()
	}
	
		console.log(query);
	if (query!==""){
		CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
			if (json!==""){
				alertify.success("Registo criado!!!")
			}else{
				alertify.error("Erro ao guardar!!!")
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
		defaultView: 'timelineWeek',
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
		weekends: true,
		views: {
			agendaDay: {				
				slotLabelFormat:"HH:mm"		
				,buttonText: "Dia(h)"
				,slotDuration: '00:30'
			},
			timelineDay: {				
				slotLabelFormat:"HH:mm"		
				,buttonText: "Dia(h)"
				,slotDuration: '00:30'
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
		resourceAreaWidth: '10%',
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
		
				for(var i in dadoscal){ 
					if (dadoscal[i].stamp.trim().toLowerCase() === calEvent.stamp.trim().toLowerCase()){
						dadoscal[i].start= data + " " + uHorai;
						dadoscal[i].end= data + " " + uHoraf;
						dadoscal[i].tecnico=uNomeTec;
						dadoscal[i].resourceId=calEvent.resourceId;
					}
				}

				query = "update " + tabela + " set data='" + data.substring(0, 4)+data.substring(5, 7)+data.substring(8, 10) + "'" +
						",inicio=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHorai + "')" + 
						",hinicio='" + uHorai + "'" +
						",fim=datediff(mi,'1900-01-01 00:00:00','1900-01-01 " + uHoraf + "')" + 
						",hfim='" + uHoraf + "'" +
						",tecnico=" + calEvent.resourceId.toString().trim() + ",tecnnm=isnull((select cmdesc from cm4 (nolock) where cm=" + calEvent.resourceId.toString().trim() + 
						"),'') where " + tabela + "stamp='" + calEvent.stamp + "'";	
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
			
			console.log(query);
			if (query!==""){
				CorreNewWs("QueryJson",sftkey("MAIN"),query,function(json){
					if (json!==""){
						alertify.success("Registo alterado!!!")
					}else{
						alertify.error("Esse tipo de registo não pode ser alterado!!!")
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