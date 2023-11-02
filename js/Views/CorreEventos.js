// Variáveis Públicas
var pub_app = "tts/eventosphc.html";

var pub_login = "";
var tipo = "";
var ecran = ""; 
var tabela = ""; 
var tabstamp = ""; 
var bdados = ""; 
var url_origem = "";

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
		    case "TIPO":
		        tipo = DataObj[mfield].toString();
		        break;
		    case "ECRAN":
		        ecran = DataObj[mfield].toString();
		        break;
		    case "TABELA":
		        tabela = DataObj[mfield].toString();
		        break;
		    case "TABSTAMP":
		        tabstamp = DataObj[mfield].toString();
		        break;
		    case "BDADOS":
		        bdados = DataObj[mfield].toString();
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
		pub_login = getCookie("INTRANETlogin_username");
		Corre_Evento()
	});
}	

function Corre_Evento(){
	
	waitwindow("A Processar dados!!!");

	var values = { 
			'Key'     : sftkey("MAIN")
			,'Login'	:changeE(pub_login)
			,'Chave'	:changeE("tts")
			,'Tipo'     : changeE(tipo)
			,'Ecran'     : changeE(ecran)
			,'Tabela'     : changeE(tabela)
			,'TabStamp'     : changeE(tabstamp)
			,'BaseDados'     : changeE(pub_bdados)
			,'OriVar'     : changeE("tts")
		};
		
	CorreWs("CorreEvento",values,function(json){    
		if (json!==""){
			Acabou_Evento();
		}else{
			fechawaitwindow();  	
			alertify.error("Erro ao correr o evento!!");		
			setTimeout(function() {window.location.replace(url_origem);},500);
		}
	});    	
	
}

function Acabou_Evento(){	
    alertify.success("Dados processados!!");
	if (url_origem!==""){		
		window.location.replace(url_origem);
	}
	fechawaitwindow();
}
