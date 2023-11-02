

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
var corFeriados = "red";
var corAgendamentos = "gray";
var corAgendNaoConf = "blue";
var corIntervencoes = "green";
var corVisitas = "yellow";

var dadoscal = [];
var documento = $(document);
var Calendar_Filtros;

var jsonTema =[{"val":"1","valor":"default","descricao":"Normal"},{"val":"2","valor":"classic","descricao":"Cor"},{"val":"3","valor":"dark","descricao":"Escuro"}
	,{"val":"4","valor":"4","descricao":"Aqua"},{"val":"5","valor":"5","descricao":"Glaciar"},{"val":"6","valor":"6","descricao":"Anil"}
	,{"val":"7","valor":"7","descricao":"Coral"},{"val":"8","valor":"8","descricao":"Prado"},{"val":"9","valor":"9","descricao":"Branco"}];
var jsonTipo =[{"valor":"1","descricao":"Só Agendamentos"},{"valor":"2","descricao":"Tudo"}];
var jsonTecnico = [];

$(document).ready(function() {
	
	$('.form-control').tooltip();  
				
	valida_filtros();
	
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
				mouse: false,
				scroll: false
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
		style: 'qtip-tipsy'
	}).qtip('api');

	carregar();
});

function carregar(){
	$.getScript(pub_url+'tts/js/ttsjs.js', function(){
		var username= getCookie("INTRANETlogin_username");
		//alert(username);	
		var userpass= getCookie("INTRANETlogin_useri");
		//alert(userpass);	
		
		setTimeout(function(){ 
			
			waitwindow("A ler os dados do servidor !!!");
					
			var query			
			query = "select tema,u_alteramx as podealterar from us (nolock) where usercode='"+username.toString()+"'";

			CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){

				if (json!==""){
					validou_user(json);
				}else{
					alert("Erro ao ler os dados!!");
					fechawaitwindow();
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
			query_resources();
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

//Filtrar
documento.on("click", "#Calendar_Flt", function () {
			
	Calendar_CorrerFiltros();
	
	uFiltro = Calendar_Filtros;		

	//console.log("uFiltro -> "+uFiltro)
	AtualizarCalendarioInternecoes(uFiltro);

});    

//Limpar filtros
documento.on("click", "#Calendar_LimpaFlt", function () {
	var uObjFlt = $("#Flt_Calendario");

	LimpaFiltros(uObjFlt);	

	var uFiltro = "";
	
	AtualizarCalendarioInternecoes("");
});        
  

function AtualizarCalendarioInternecoes(filtro){

	waitwindow("A Ler os técnicos, Aguarde!!");
	
	query = "Select cm4.cm as id,cm4.cmdesc as title From cm4 (nolock) Where cm4.inactivo = 0  and cm4.u_nagenda = 0 " + filtro + "Order by cm4.cmdesc "
	
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
				description: json.TbPhc[i].description					
			});			
		}
	}		
	
	$('#calendar').fullCalendar('removeEvents');
	$('#calendar').fullCalendar( 'addEventSource', dadoscal);  

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

	querycalendar = "select 'PAT Nº '+cast(pa.nopat as CHAR(10))"
	querycalendar +=" + ' de '+(Case When rtrim(mh.agnome)='' then rtrim(mh.nome) else rtrim(mh.agnome) end) as title"
	querycalendar +=" ,mhid as id"
	querycalendar +=" ,'green' as color"
	querycalendar +=" ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=pa.no and cl.u_cormarc <> 0),'" + corIntervencoes + "') as backgroundColor"
	querycalendar +=" ,'greenEvent' as className"
	querycalendar +=" ,convert(char(10),data,121)+' '+(case when hora='' then '08:00' else hora end)+':00' as start"
	querycalendar +=" ,convert(char(10),data,121)+' '+(case when horaf='' then '19:00' else horaf end)+':00' as 'end'"
	querycalendar +=" ,mh.tecnico as resourceId,mh.tecnnm as tecnico"
	querycalendar +=" ,pa.resumo as description"
	querycalendar +=" ,'mh' as tabela,mh.mhstamp as stamp"
	querycalendar +=" from mh (nolock)"
	querycalendar +=" inner join pa (nolock) on pa.nopat = mh.nopat"
	querycalendar +=" inner join cm4 (nolock) on cm4.cm = mh.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0"
	querycalendar +=" Where  mh.tecnico<>0 "
	querycalendar +=" And mh.data>=getdate()-" + uNdias;

	querycalendarmx ="  Select mff.title,mff.id,mff.color,mff.backgroundColor,mff.className	"
	querycalendarmx +="   ,mff.start,mff.fim as 'end'"
	querycalendarmx +="   ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
	querycalendarmx +="   ,mff.description,mff.tabela,mff.stamp"
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
	querycalendarmx +=" Select texto  as title"
	querycalendarmx +=" ,mxid as id"
	querycalendarmx +=" ,'blue' as color"
	
	querycalendarmx +=" ,Case when mx.u_naoconf=1 then '" + corAgendNaoConf + "' else isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.no=mx.clno and cl.u_cormarc <> 0),'" + corAgendamentos + "') end as backgroundColor"
	querycalendarmx +=" ,'redEvent' as className"	
	querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hinicio='' then '08:00' else hinicio end)+':00' as start"
	querycalendarmx +=" ,convert(char(10),data,121)+' '+(case when hfim='' then '19:00' else hfim end)+':00' as 'end'"
	querycalendarmx +=" ,mx.tecnico as resourceId,mx.tecnnm as tecnico"
	querycalendarmx +=" ,mx.clnome + ' - '+cast(mx.texto as char(8000)) as description"
	querycalendarmx +=" ,'mx' as tabela,mxstamp as stamp "
	querycalendarmx +=" From mx (nolock) "
	querycalendarmx +=" inner join cm4 (nolock) on cm4.cm = mx.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0"	
	querycalendarmx +=" Where mx.tecnico<>0"
	querycalendarmx +=" And mx.data>=getdate()-" + uNdias;		

	querycalendarmx += " Union All"
	querycalendarmx += "  Select vi.accao as title"
	querycalendarmx += "  ,viid as id"
	querycalendarmx += "  ,'blue' as color"
	querycalendarmx += "  ,isnull((select dbo.Tts_RGB2RGB(cl.u_cormarc,'H') from cl (nolock) where cl.emno=vi.no and cl.u_cormarc <> 0),'" + corVisitas + "') as backgroundColor"
	querycalendarmx += "  ,'redEvent' as className	"
	querycalendarmx += "  ,convert(char(10),data,121)+' '+(case when hora='' then '08:00' else hora end)+':00' as start"
	querycalendarmx += "  ,convert(char(19),DATEADD (mi , duracao , cast(convert(char(10),data,121)+' '+(case when hora='' then '19:00' else hora end)+':00' as datetime)),121)  as 'end'"
	querycalendarmx += "  ,cm4.cm as resourceId,cm4.cmdesc as tecnico"
	querycalendarmx += "  ,vi.nome + ' - '+ vi.resumo as description"
	querycalendarmx += "  ,'vi' as tabela,vi.vistamp as stamp "
	querycalendarmx += "  From vi (nolock) "
	querycalendarmx += "  inner join cm3 (nolock) on cm3.cm = vi.vendedor and cm3.inactivo=0 	"
	querycalendarmx += "  inner join us (nolock) on cm3.cm = us.vendedor and us.inactivo=0 	"
	querycalendarmx += "  inner join cm4 (nolock) on cm4.cm = us.tecnico and cm4.inactivo=0 and cm4.u_nagenda = 0	"
	querycalendarmx += "  Where cm4.cm<>0"
	querycalendarmx += "  And vi.data>=getdate()-" + uNdias;		
	 
	 console.log(querycalendarmx);
}

function query_resources(){

	waitwindow("A ler os dados do servidor !!!");

	query = "Select cm4.cm as id,cm4.cmdesc as title From cm4 (nolock) Where cm4.inactivo = 0  and cm4.u_nagenda = 0 Order by cm4.cmdesc "		
	
	CorreNewWs("ExecQueryJson",sftkey("MAIN"),query,function(json){
		console.log(json);
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
				valor: json.TbPhc[i].id		
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
				description: json.TbPhc[i].description				
			});			
		}
	}	
	
	$('#calendar').fullCalendar({
		schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'timelineDay,timelineWeek,timelineMonth,timelineYear'
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
		//minTime:"08:00:00",
		//maxTime:"19:00:00",
		minTime:"00:00:00",
		maxTime:"24:00:00",
		
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
		views: {
			agendaDay: {				
				slotLabelFormat:"HH:mm",		
				buttonText: "Dia(h)",
				slotDuration: '00:30'
			},
			timelineDay: {				
				slotLabelFormat:"HH:mm",		
				buttonText: "Dia(h)",
				slotDuration: '00:30'
			},
			timelineWeek: {
				//slotDuration: '06:00'
				slotDuration: '24:00'
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
		resourceAreaWidth: '15%',
		resourceLabelText: 'Técnicos',
		resources: dados_resources,
		events: dadoscal,
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
	},eventMouseover: function(calEvent, jsEvent, view) {
			var content = '<h4>'+calEvent.title+'</h4>' + 
			'<p><b>Data / Hora Inicio:</b> '+calEvent.start._i+'<br />' + 
			(calEvent.end && '<p><b>Data / Hora Fim:</b> '+calEvent.end._i+'</p>' || '') + '<br />'
			+'<h6>'+calEvent.description+'</h6>' 

			tooltip.set({
			'content.text': content
			})
			.reposition(jsEvent).show(jsEvent);
		},eventMouseout: function() { 
		
			$('#qtip-calendario').bind('tooltipshow', function() {
				$('.selector').removeClass('active');
			});
			tooltip.hide() 
		
		},eventDrop: function(calEvent, delta, revertFunc) {
			
			var query = ""
			var tabela = calEvent.tabela.toString().toLowerCase().trim()
			var data = calEvent.start.format().toString().trim().substring(0, 10); 
			var horai = calEvent.start.format().toString().trim().substring(11, 16); 

			if (tabela==="mx"){
				var horaf = calEvent.end.format().toString().trim().substring(11, 16); 
				query = "update " + tabela + " set data='" + data.substring(0, 4)+data.substring(5, 7)+data.substring(8, 10) + 
				"',hinicio='" + horai + "',hfim='" + horaf + "'" +
				",tecnico=" + calEvent.resourceId.toString().trim() + ",tecnnm=isnull((select cmdesc from cm4 (nolock) where cm=" + calEvent.resourceId.toString().trim() + 
				"),'') where " + tabela + "stamp='" + calEvent.stamp + "'";	
			}else{
				if (tabela==="vi"){
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
				}else{
					alertify.error("Esse tipo de registo não pode ser alterado!!!")
					revertFunc();
				}
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