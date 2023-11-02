/* 
 * Funções globais 
 */

// Variáveis Públicas
var uCamposGr = [];
var uObjGr = [];
var uValoresGr = [];
var uTiposGr = [];
var PodeGravar = true;
var uFiltros = [];
var jsonAnexos = [];
var jsonAux = [];
var numAux = 0;
var nAux = 0;
var pub_login = ""
var pub_pass = ""
var datahora = dtoshoje() + time().replace(/[:]/g,"");

Tts_lerconfiguracoes(function(){});

function Tts_lerconfiguracoes(callback){
	// Vou ler as configurações ao ficheiro
	var jqxhr = jQuery.getJSON( "../tts/config.json?" + datahora, function(json) {

	})
	.done(function(json) {
		if (typeof pub_nomeapp!== undefined) {
			pub_nomeapp = json.nomeapp;
		}	
		if (typeof pub_infologin!== undefined) {
			pub_infologin = json.infologin;
		}	
		if (typeof pub_urlws!== undefined) {
			pub_urlws = json.urlws;
		}	
		if (typeof pub_caminho!== undefined) {
			pub_caminho = json.caminho;
		}	
		if (typeof pub_login!== undefined) {
			pub_login = json.lgin;
		}	
		if (typeof pub_pass!== undefined) {
			pub_pass = json.pw;
		}	
		if (typeof pub_versaoapp!== undefined) {
			pub_versaoapp = json.versaoapp;
		}	
		if (typeof pub_bdados!== undefined) {
			pub_bdados = json.bdados;
		}	
		if (typeof validadecookies!== undefined) {
			validadecookies = json.validadecookies;
		}	
		if (typeof pub_mnAutologout!== undefined) {
			pub_mnAutologout = json.mnAutologout;
		}	
		if (typeof pub_mnCookiesLogin!== undefined) {
			pub_mnCookiesLogin = json.mnCookiesLogin;
		}	
		if (typeof _jsPHCok!== undefined) {
			_jsPHCok = true;
		}	
		callback("");		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		if (typeof pub_nomeapp!== undefined) {
			pub_nomeapp = "";
		}	
		if (typeof pub_infologin!== undefined) {
			pub_infologin = "";
		}
		if (typeof pub_urlws!== undefined) {
			pub_urlws = "";
		}	
		if (typeof pub_caminho!== undefined) {
			pub_caminho = "";
		}	
		if (typeof pub_login!== undefined) {
			pub_login = "";
		}	
		if (typeof pub_pass!== undefined) {
			pub_pass = "";
		}	
		if (typeof pub_versaoapp!== undefined) {
			pub_versaoapp = datahora;
		}	
		if (typeof pub_bdados!== undefined) {
			pub_bdados = "";
		}	
		if (typeof validadecookies!== undefined) {
			validadecookies = 1;
		}	
		if (typeof pub_mnAutologout!== undefined) {
			pub_mnAutologout = 30;
		}	
		if (typeof pub_mnCookiesLogin!== undefined) {
			pub_mnCookiesLogin = 180;
		}	 
		callback("");		
	});
}

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

function Tts_notify(titulo,url,useravs){
	var strvalues='{"titulo":"' + titulo +'","durl":"' + url +'","tipo":"1","envcanais":"3","useravs":"['+useravs+']"}';
	jQuery.ajax({url:"../api/framework/sendAvsNotify",
        type: "POST",
		data: strvalues ,                        
        dataType: "json",
		contentType: "application/json; charset=utf-8",
        success: function(json) {
			console.log(json);
		},	
        error: function(data) {
            console.log(data);
        }
    });	
}

function OpenModalBox(header, inner, bottom){
	var modalbox = jQuery('#modalbox');
	var cabecalho = header + '<button id="event_cancel" type="cancel" class="btn btn-default btn-xs bt-fechar-modalbox" >' 
	cabecalho += '				<i class="fa fa-close fechar-modalbox" data-original-title="" title="" data-tooltip="true" </i>'			
	cabecalho += '			</button>'
	
	modalbox.find('.modal-header-name span').html(cabecalho);
	modalbox.find('.devoops-modal-inner').html(inner);
	modalbox.find('.devoops-modal-bottom').html(bottom);
	modalbox.fadeIn('fast');
	jQuery('body').addClass("body-expanded");
}

function CloseModalBox(){
	var modalbox = jQuery('#modalbox');
	modalbox.fadeOut('fast', function(){
		modalbox.find('.modal-header-name span').children().remove();
		modalbox.find('.devoops-modal-inner').children().remove();
		modalbox.find('.devoops-modal-bottom').children().remove();
		jQuery('body').removeClass("body-expanded");
	});
}

function CloseAlertify(){	
	var _alertify = jQuery('#alertify');
	_alertify.addClass("alertify-hide"); 
	_alertify.addClass("alertify-hidden");
	_alertify.removeClass("alertify-confirm");
}

function cria_datatable(idtabela,json,_template,procura,numlinhas,colunaordenacao){
	
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
}


function limpa_datatable(idtabela){
	var table = $('#'+idtabela).DataTable();
	table.destroy();
	var _tbl = $("#"+idtabela);
	var tblBody = $("tbody", _tbl); 
		
	tblBody.empty();
}

function getCookie(cname) {
	 var name = cname.toLowerCase().trim() + "=";
	 var ca = document.cookie.split(';');
	 for(var i=0; i<ca.length; i++) {
		var compara = ca[i].toLowerCase().trim();
		var valor = ca[i].trim();
		while (compara.charAt(0)==' ') compara = c.substring(1);
		if(compara.indexOf(name) == 0)
		   return valor.substring(name.length,valor.length);
	 }
	 return "";
}	

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 

function TeclasDatas( event ) {

	if ((event.which===79) | (event.which===111)){
		event.preventDefault();
		var ID = event.target.id;
		$("[id='"+ID+"']").val(ontem());
	}	
	if ((event.which===65) | (event.which===97)){
		event.preventDefault();
		var ID = event.target.id;
		$("[id='"+ID+"']").val(amanha());
	}	
	if ((event.which===72) | (event.which===104)){
		event.preventDefault();
		var ID = event.target.id;
		$("[id='"+ID+"']").val(hoje());
	}		
};


// Retorna data de hoje em formato data	
function dthoje(){
	var uhoje = new Date();
	var dd = uhoje.getDate();
	var mm = uhoje.getMonth()+1; 

	var yyyy = uhoje.getFullYear();
	yyyy = yyyy.toString();
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
	return yyyy+'-'+mm+'-'+dd;	
}

// Retorna data de hoje em formato data	
function hoje(){
	var uhoje = new Date();
	var dd = uhoje.getDate();
	var mm = uhoje.getMonth()+1; 

	var yyyy = uhoje.getFullYear();
	yyyy = yyyy.toString();
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
	return dd+'-'+mm+'-'+yyyy;	
}

// Retorna da data de ontem em formato data	
function ontem(){
	var uhoje = new Date();
	var dd = uhoje.getDate();
	var mm = uhoje.getMonth()+1; 
	var yyyy = uhoje.getFullYear();
	if (dd===1){
		switch(mm) {
			 case 1:
				dd=31;
				mm=12; 
				yyyy=yyyy-1; 
				break;
			 case 2:
				dd=31;
				mm=mm-1; 
				break;
			 case 4:
				dd=31;
				mm=mm-1; 
				break;
			 case 6:
				dd=31;
				mm=mm-1; 
				break;
			 case 8:
				dd=31;
				mm=mm-1; 
				break;
			 case 9:
				dd=31;
				mm=mm-1; 
				break;
			 case 11:
				dd=31;
				mm=mm-1; 
				break;
			 case 5:
				dd=30;
				mm=mm-1; 
				break;
			 case 7:
				dd=30;
				mm=mm-1; 
				break;
			 case 10:
				dd=30;
				mm=mm-1; 
				break;
			 case 12:
				dd=30;
				mm=mm-1; 
				break;
			 default:
				if ((yyyy % 4)===0){
					dd=29
					mm=02
				}else{
					dd=28
					mm=02					
				}
		 } 
	}else{
		dd=dd-1;
	}

	yyyy = yyyy.toString();
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
	return dd+'-'+mm+'-'+yyyy;	
}

// Retorna da data de amanhã em formato data	
function amanha(){
	var uhoje = new Date();
	var dd = uhoje.getDate();
	var mm = uhoje.getMonth()+1; 
	var yyyy = uhoje.getFullYear();
	switch(mm) {
		 case 1:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 3:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 5:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 7:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 8:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 10:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 12:
			if (dd===31){
				dd=1;
				mm=1; 					
				yyyy=yyyy+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 4:
			if (dd===30){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 6:
			if (dd===30){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 9:
			if (dd===30){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 11:
			if (dd===30){
				dd=1;
				mm=1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 default:
			if ((yyyy % 4)===0){
				if (dd===29){
					dd=1;
					mm=3; 					
				}else{
					dd=dd+1;					
				}
			}else{
				if (dd===28){
					dd=1;
					mm=3; 					
				}else{
					dd=dd+1;					
				}
			}
	 } 
	yyyy = yyyy.toString();
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
	return dd+'-'+mm+'-'+yyyy;	
}

// Retorna da data do próximo mês em formato data	
function dtproximomes(){
	var uhoje = new Date();
	var dd = uhoje.getDate();
	var mm = uhoje.getMonth()+2; 
	var yyyy = uhoje.getFullYear();
	switch(mm) {
		 case 1:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 3:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 5:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 7:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 8:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 10:
			if (dd===31){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 12:
			if (dd===31){
				dd=1;
				mm=1; 					
				yyyy=yyyy+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 4:
			if (dd===30){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 6:
			if (dd===30){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 9:
			if (dd===30){
				dd=1;
				mm=mm+1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 case 11:
			if (dd===30){
				dd=1;
				mm=1; 					
			}else{
				dd=dd+1;					
			}
			break;
		 default:
			if ((yyyy % 4)===0){
				if (dd===29){
					dd=1;
					mm=3; 					
				}else{
					dd=dd+1;					
				}
			}else{
				if (dd===28){
					dd=1;
					mm=3; 					
				}else{
					dd=dd+1;					
				}
			}
	 } 
	yyyy = yyyy.toString();
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
	return yyyy+'-'+mm+'-'+dd;	
}

// Retorna valor horas decimal
function valtime(time){
	var qtdhour = 0;
	try{
		var atime = time.split(":");
		var nhora = parseInt(atime[0]);
		var nmin = parseInt(atime[1]);
		qtdhour = nhora + nmin/60
	}catch(e){
		qtdhour = 0;
	}
				
	return qtdhour;	
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

// Retorna Ramdom String 
function randomString(length) {
	chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

// Retorna Stamp único
function u_Stamp() {
    var result = '';
	var rString = randomString(8);
	var tempo = time();
	result = rString.substr(0,3) + dtoshoje() + tempo.replace(/[:]/g,"") + rString
    return result;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

function AnexMultipleFiles(evt) {

	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.

		var uIdResumo = $('#txtresumo');
		var uResumo = uIdResumo.val();
		
		if (uResumo!==""){
			
			var files = evt.target.files; 
			
			$("#nvanexos-spinner").show();
			
			if (files) {
				for (var i=0, f; f=files[i]; i++) {
					
					var filesize = files[i].size;
					//console.log(filesize);  

					if (filesize>15000000){
						$("#nvanexos-spinner").hide();
						alertify.error("Ficheiro com tamanho superior ao suportado!!")
					}else{
						
						var reader = new FileReader();					

						reader.onprogress = function(event) {
							//console.log("Total "+event.total);
							//console.log("Load "+event.loaded);
							if (event.lengthComputable) {
								//console.log("Total "+event.total);
								//console.log("Load "+event.loaded);
							}
						};

						reader.onload = (function(f) {
							return function(e) {
								
								var fileData = '';
								var byteArray = new Uint8Array(e.target.result)
								for (var i = 0; i < byteArray.byteLength; i++) {
							       fileData += String.fromCharCode(byteArray[i])
							    }

								//console.log(fileData);
								
								
								var contents = fileData;
								error    = e.target.error;

								if (error != null) {
									switch (error.code) {
										case error.ENCODING_ERR:
											//console.error("Encoding error!");
											break;

										case error.NOT_FOUND_ERR:
											//console.error("File not found!");
											break;

										case error.NOT_READABLE_ERR:
											//console.error("File could not be read!");
											break;

										case error.SECURITY_ERR:
											//console.error("Security issue with file!");
											break;

										default:
											//console.error("I have no idea what's wrong!");
									}
									$( "#nvanexos-window-ok" ).trigger('click');

								} else {
									
									//$( "#nvanexos-window-ok" ).trigger('click');

									//progressNode.max = 1;
									//progressNode.value = 1;
									//console.log("Contents: " + contents);
									
									//var uStrtoBin = StringToBin(e.target.result);
									//console.log(e.target.result);
									//var uBintoStr = binaryAgent(uStrtoBin);
									//console.log(uBintoStr);
									
									
									//pub_FileUpload = ABC.toBinary(e.target.result);
									//pub_FileUpload = reader.result;
									//console.log(pub_FileUpload);
									//pub_FileUpload = Base64.encode(e.target.result);
									pub_FileUpload = fileData;
									//console.log(pub_FileUpload);
									var extension = f.name.split('.').pop().toLowerCase();								
								
									var values = { 
											'Login'     : changeE(pub_login)
											,'Passw'     : changeE(pub_passw)
											,'FileStr'	: pub_FileUpload
											,'NomeFicheiro'     : changeE(f.name)
											,'Descricao'     : changeE(uResumo)
											,'Ndos'     : 0
											,'TabelaOrigem'     : changeE(evt.target.Tabela)
											,'DescTabela'     : changeE(evt.target.NmTabela)
											,'StampOrigem'     : changeE(evt.target.Stamp)
											,'BaseDados'     : changeE("newallianceit")
											,'Tipo'     : changeE("")
										};
										
									//CorreWs("GravaAnexoStr",values,function(json){    
										//console.log(json);
									//	if (json!==""){
									//		Anexos_PHC();
									//	}else{
									//		alertify.error("Erro ao anexar no PHC!!")		
									//	}
									//});  
			
									var query = "insert into wanexos (wanexosstamp,oritable,tabnm,resumo,recstamp,fullname,fname"
										query+= ",fext,flen,origem,bdados) values ('"
										query+= u_Stamp() + "','" + evt.target.Tabela+ "','" + evt.target.NmTabela + "','"
										query+= uResumo + "','" + evt.target.Stamp+ "','" + f.name+ "','" + f.name+ "','"
										query+= extension+ "'," + f.size.toString() + ",'','"+pub_FileUpload+"')"
										//console.log(query);	
									CorreNewWs("QueryJson",query,function(json){
										//console.log(json);
										if (json!==""){
											alertify.success("Anexo guardado!!");
											$( "#nvanexos-window-ok" ).trigger('click');
											$("[name='nvanexos-window-ok']").trigger('click'); 
											guardou_anexos(evt.target.Stamp,evt.target.Tabela,evt.target.NmTabela);
										}else{
											$( "#nvanexos-window-ok" ).trigger('click');
											alertify.error("Erro ao guardar anexo!!");			
										}
									});
								}

							};
						})(f);

						reader.readAsDataURL( f );
					}				
				}   
			} else {
				  alertify.error("Não consegui ler os ficheiros"); 
			}
		}else {
			  alertify.error("O resumo não pode estar vazio!!"); 
		}
	} else {
	  alertify.error('The File APIs are not fully supported in this browser.');
	}
}


            //Dim oReturn As New StringBuilder
            //'Dim Separator As String = ("")
            //For Each Character As Byte In ASCIIEncoding.ASCII.GetBytes(Text)
            //    oReturn.Append(Convert.ToString(Character, 2).PadLeft(8, "1"))
            //    oReturn.Append(Separator)
            //Next
            //TextBox2.Text = (oReturn.ToString)
			

var ABC = { 
	toAscii: function(bin) { 
     return bin.replace(/\s*[01]{8}\s*/g, function(bin) { 
       return String.fromCharCode(parseInt(bin, 2)) 
     }) 
   }, 
   toBinary: function(str, spaceSeparatedOctets) { 
     return str.replace(/[\s\S]/g, function(str) { 
       str = ABC.zeroPad(str.charCodeAt().toString(2)); 
       return !1 == spaceSeparatedOctets ? str : str + " " 
     }) 
   }, 
   zeroPad: function(num) { 
     return "00000000".slice(String(num).length) + num 
  } 
}; 

			
function StringToBin(uString) {
    output = "";
    for (i=0; i < uString.length; i++) {var e=uString[i].charCodeAt(0);var s = " ";
    do{
        var a =e%2;
        e=(e-a)/2;
        s=a+s;
        }while(e!=0);
        while(s.length<8){s="0"+s;}
        output+=s;
    }
	return output;
}

function binaryAgent(str) {

	var binString = '';

	str.split(' ').map(function(bin) {
		binString += String.fromCharCode(parseInt(bin, 2));
	  });
	return binString;
}


function Anexos_PHC(){
	alertify.success("Anexado no PHC!!"); 
}

function guardou_anexos(uStamp,uTabela,uNmTabela){
	
    var query = "select wanexosstamp,oritable,tabnm,resumo,recstamp,fullname,fname,fext,flen,origem from wanexos (nolock) where recstamp='" + uStamp + "' and oritable='"+uTabela+"'";

	CorreNewWs("ExecQueryJson",query,function(json){
        //console.log(json);
        if (json!==""){
			if (json.TbPhc.length>0){
				if (json.TbPhc[0].wanexosstamp!=="!#NA#!SEMDADOS"){
					validou_anexos(json,uStamp,uTabela,uNmTabela);
				}else{
					alertify.warning("Não existem anexos!!");
				}
			}else{
				alertify.warning("Não existem anexos!!");
			}           
        }else{
			alertify.warning("Não existem anexos!!");
        }
    });
		
}

function validou_anexos(json,uStamp,uTabela,uNmTabela){
	
	VerAnexos(json,uStamp,uTabela,uNmTabela);
	
}

function VerAnexos(json,uStamp,uTabela,uNmTabela){	

	if ( $(".anexos").length ){
		$( "#anexos-window-ok" ).trigger('click');	
		//$( ".nvanexos" ).remove();
	}
			
	jsonAnexos = json.TbPhc;
			
	var uTxtHtml="	<div class='anexos text-center' style='display: none;'>"
		uTxtHtml+="		<button id='anexos-window-lanch' class='demo btn btn-primary btn-lg' data-toggle='modal' href='#anexos-window'></button>"
		uTxtHtml+="	</div>"
		uTxtHtml+="	<div tabindex='-1' class='anexos modal fade' id='anexos-window' data-keyboard='true' data-backdrop='static'>"
		uTxtHtml+="		<div class='modal-body'>"
		uTxtHtml+="			<h2><i id='anexos-window-spinner' class='fa fa-paperclip'></i></h2>" 
		uTxtHtml+="			<h4>Anexos - " + uNmTabela + "</h4>" 
		uTxtHtml+="			<br>"

		uTxtHtml+="		<div class='table-responsive'>"
		uTxtHtml+="		<table id='tbAnexos' class='table table-bordered table-striped'>"
		uTxtHtml+="			<thead>" 
		uTxtHtml+="				<tr>"
		uTxtHtml+="				<th>Resumo</th>"
		uTxtHtml+="				<th></th>"
		uTxtHtml+="				<th></th>"
		uTxtHtml+="				<th style='display:none;' data-campo='wanexosstamp'>wanexosstamp</th>"
		uTxtHtml+="				</tr>"
		uTxtHtml+="			</thead>"
		uTxtHtml+="			<tbody>"
		for(var i in json.TbPhc){ 
			if (json.TbPhc[i].wecranstamp!=="!#NA#!SEMDADOS"){
				uTxtHtml+="				<tr><th>"+json.TbPhc[i].resumo+"</th>"
				uTxtHtml+="				<th><a class='icon-pointer' onclick='ApagaAnexo("+i.toString()+")'><i class='fa fa-eraser' data-toggle='tooltip' data-placement='right' title='Apagar'></i></a></th>"
				uTxtHtml+="				<th><a class='icon-pointer' onclick='AbreAnexo("+i.toString()+")'><i class='fa fa-folder-open-o' data-toggle='tooltip' data-placement='right' title='Abrir'></i></a></th>"
				uTxtHtml+="				<th style='display:none;' data-campo='wanexosstamp'>"+json.TbPhc[i].wanexosstamp+"</th></tr>"
			}
		}  
		uTxtHtml+="			</tbody>"
		uTxtHtml+="			</table>"
		uTxtHtml+="			</div>"
		
		uTxtHtml+="		</div>"
		uTxtHtml+="		<div id='anexos-window-group' class='modal-footer'>"
		uTxtHtml+="			<br>"
		uTxtHtml+="    		<button id='anexos-novo' type='button' class='btn btn-default btn-label-left' data-dismiss='modal'>"
		uTxtHtml+="        		<span><i class='fa fa-paperclip txt-white'></i></span>"
		uTxtHtml+="        		Novo Anexo"
		uTxtHtml+="    		</button>"
		uTxtHtml+="    		<button id='anexos-window-ok' type='button' class='btn btn-danger btn-label-left' data-dismiss='modal'>"
		uTxtHtml+="        		<span><i class='fa fa-ban txt-white'></i></span>"
		uTxtHtml+="        		Fechar"
		uTxtHtml+="    		</button>"
		uTxtHtml+="		</div>"
		uTxtHtml+="</div> "   
		//console.log(uTxtHtml);
		$("#main").append(uTxtHtml);
		
		$( "#anexos-window-lanch" ).trigger('click');	
				
		var uObj = document.getElementById('anexos-novo');
		uObj.addEventListener('click', NovoAnexo, false);
		uObj.Stamp = uStamp;
		uObj.Tabela = uTabela;
		uObj.NmTabela = uNmTabela;		
		
}

function NovoAnexo(evt){

	$( "#anexos-window-ok" ).trigger('click');			
	Anexos(evt.target.Stamp,evt.target.Tabela,evt.target.NmTabela);
	
}

function ApagaAnexo(linha){

	$( "#anexos-window-ok" ).trigger('click');

	setTimeout(function(){alertify.confirm("Anexos","Quer mesmo apagar o anexo?",
	function(){
		var uStamp = jsonAnexos[linha].recstamp;
		var uTabela = jsonAnexos[linha].oritable;
		var uNmTabela = jsonAnexos[linha].tabnm;
		
		var query = "delete from wanexos where wanexosstamp='" + jsonAnexos[linha].wanexosstamp + "'";

		CorreNewWs("QueryJson",query,function(json){
			//console.log(json);
			if (json!==""){
				ApagouAnexo(uStamp,uTabela,uNmTabela)
			}else{
				alertify.error("Erro ao apagar o anexo!!");		
			}
		});	
	},
	  function(){
		alertify.warning('Cancelado pelo utilizador!!');
	})},500);
}


function ApagouAnexo(uStamp,uTabela,uNmTabela){
	alertify.success("Anexo eliminado!!");	
								
	setTimeout(function(){guardou_anexos(uStamp,uTabela,uNmTabela);},1000);
	
}

function AbreAnexo(linha){
	
	//console.log(jsonAnexos[linha].wanexosstamp);
	var values = { 
		'Key' : sftkey("MAIN")
		,'Stamp' : changeE(jsonAnexos[linha].wanexosstamp)
	};
	//console.log(values);
	CorreWsSimples("CriaFileAnexo",values,function(json){
		//console.log(json);
		if (json!==""){
			AbriuAnexo(json)
		}else{
			alertify.error("Erro ao abrir o anexo!!");		
		}
	});		
}

function AbriuAnexo(json){
	if (json.Sucess.toString().toLowerCase()!=="false"){
		var myUrl = json.Msg;
		
		window.open(myUrl);
		
	}else{
		alertify.error("Erro ao abrir o anexo!!");
	}
}

function Anexos(uStamp,uTabela,uNmTabela){	

	if ( $(".nvanexos").length ){
		$( "#nvanexos-window-ok" ).trigger('click');	
		//$( ".nvanexos" ).remove();
	}
	
	var uTxtHtml="	<div class='nvanexosc text-center' style='display: none;'>"
		uTxtHtml+="		<button id='nvanexos-window-lanch' class='demo btn btn-primary btn-lg' data-toggle='modal' href='#nvanexos-window'></button>"
		uTxtHtml+="	</div>"
		uTxtHtml+="	<div tabindex='-1' class='nvanexos modal fade' id='nvanexos-window' data-keyboard='true' data-backdrop='static'>"
		uTxtHtml+="		<div class='modal-body'>"
		uTxtHtml+="			<h2><i id='nvanexos-window-spinner' class='fa fa-paperclip'></i></h2>" 
		uTxtHtml+="			<h4>Anexos - " + uNmTabela + "</h4>" 
		uTxtHtml+="			<br>"

		uTxtHtml+="			<div class='upload_form_cont'>"
        uTxtHtml+="				<form id='upload_form' enctype='multipart/form-data' method='post' action='php/upload.php'>"

		uTxtHtml+="					<label class='col-sm-12 control-label text-left'>Resumo do Anexo</label><br>"
		uTxtHtml+="					<input type='text' id='txtresumo' class='form-control' placeholder='Resumo do Anexo' data-toggle='tooltip' data-placement='top' title='Resumo do Anexo' data-campo='query'><br>"

        uTxtHtml+="			            <div>"
        uTxtHtml+="			                <div><label for='*'>Seleccionar ficheiro</label></div>"
        uTxtHtml+="			                <div><input type='file' name='FileInput' id='FileInput' onchange='fileSelected();' /></div>"
        uTxtHtml+="			                <div><input style='display:none;' type='text' name='Name' id='Name' /></div>"
        //uTxtHtml+="			                <div><input style='display:none;' type='text' name='Tabela' id='Tabela' /></div>"
        //uTxtHtml+="			                <div><input style='display:none;' type='text' name='NmTabela' id='NmTabela' /></div>"
        //uTxtHtml+="			                <div><input style='display:none;' type='text' name='Stamp' id='Stamp' /></div>"
        //uTxtHtml+="			                <div><input style='display:none;' type='text' name='Bdados' id='Bdados' /></div>"
        uTxtHtml+="			            </div>"
        uTxtHtml+="			            <div>"
		uTxtHtml+="			                <input type='button' value='Enviar' id='nvanexos'/>"
        uTxtHtml+="			            </div>"
        uTxtHtml+="			            <div id='fileinfo'>"
        uTxtHtml+="			                <div id='filename'></div>"
        uTxtHtml+="			                <div id='filesize'></div>"
        uTxtHtml+="			                <div id='filetype'></div>"
        uTxtHtml+="			                <div id='filedim'></div>"
        uTxtHtml+="			            </div>"
        uTxtHtml+="			            <div id='error'>Seleccionar ficheiro valido</div>"
        uTxtHtml+="			            <div id='error2'>Erro ao fazer o Upload</div>"
        uTxtHtml+="			            <div id='abort'>Upload cancelado pelo utilizador</div>"
        uTxtHtml+="			            <div id='warnsize'>Ficheiro demasiado grande</div>"

        uTxtHtml+="			            <div id='progress_info'>"
        uTxtHtml+="			                <div id='progress'></div>"
        uTxtHtml+="			                <div id='progress_percent'>&nbsp;</div>"
        uTxtHtml+="			                <div class='clear_both'></div>"
        uTxtHtml+="			                <div>"
        uTxtHtml+="			                    <div id='speed'>&nbsp;</div>"
        uTxtHtml+="			                    <div id='remaining'>&nbsp;</div>"
        uTxtHtml+="			                    <div id='b_transfered'>&nbsp;</div>"
        uTxtHtml+="			                    <div class='clear_both'></div>"
        uTxtHtml+="			                </div>"
        uTxtHtml+="			                <div id='upload_response'></div>"
        uTxtHtml+="			            </div>"
        uTxtHtml+="			        </form>"
        uTxtHtml+="			    </div>"		
		
		uTxtHtml+="			<br>"
		uTxtHtml+="			<div id='nvanexos-spinner'>"
        uTxtHtml+="				<h2><i id='nvanexos-spinner' class='fa fa-spinner fa-spin'></i> A anexar, Aguarde!! </h2>" 
		uTxtHtml+="			</div>"
        uTxtHtml+="			<br>"
		//uTxtHtml+="			<div class='progress'>"
		//uTxtHtml+="				<div id='my-progress' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>"
		//uTxtHtml+="					<span class='sr-only'></span>"
		//uTxtHtml+="				</div>"
		//uTxtHtml+="			</div>"
		
		uTxtHtml+="		</div>"
		uTxtHtml+="		<div id='nvanexos-window-group' class='modal-footer'>"
		uTxtHtml+="    		<button id='nvanexos-window-ok' type='button' class='btn btn-success btn-label-left' data-dismiss='modal'>"
		uTxtHtml+="        		<span><i class='fa fa-check-circle txt-white'></i></span>"
		uTxtHtml+="        		Fechar"
		uTxtHtml+="    		</button>"
		uTxtHtml+="		</div>"
		uTxtHtml+="</div> "   
		//console.log(uTxtHtml);
		$("#main").append(uTxtHtml);
				
		$( "#nvanexos-spinner" ).hide();			
		$( "#nvanexos-window-lanch" ).trigger('click');			
		
		//document.getElementById('nvanexos-window-spinner').style.visibility = "hidden";
		
		$("#txtresumo").val("");
		//var uObjWait = document.getElementById('nvanexos-spinner');
		//console.log(uObjWait);
		//uObjWait.style.visibility = "hidden";
		
		var uObj = document.getElementById('nvanexos');
		uObj.addEventListener('click', startUploading, false);
		uObj.Stamp = uStamp;
		uObj.Tabela = uTabela;
		uObj.NmTabela = uNmTabela;

}

//
//  Função para carregar o conteúdo Codificado do url e colocar em $('.ajax-content')
//
function LoadCodAjaxContent(url){
	$('.preloader').show();
	$('.erroecran').hide();
	$('#ajax-content').hide();
	try{
		 jQuery.ajax({
			mimeType: 'text/html; charset=utf-8', 
			url: url,
			type: 'GET',
			success: function(data) {
				//alert(data);
				$('#ajax-content').html(Decript(data));
				$('.preloader').hide();
				$('#ajax-content').show();				
		   },
		   error: function (jqXHR, textStatus, errorThrown) {
				$('#ajax-content').hide();
				$('.preloader').hide();
				$('.erroecran').show();
				if (url === "/"){
					$('.preloader').hide();
				}
			},
		   dataType: "html",
			async: false
		});            
	}catch(e){
		$('#ajax-content').hide();
		$('.preloader').hide();
		$('.erroecran').show();
	}
}


//
//  Função para carregar o conteúdo do url e colocar em $('.ajax-content')
//
function LoadAjaxContent(url){
/* 	$('.preloader').show();
	$('.erroecran').hide(); */
	jQuery('#ajax-content').hide();

	try{
		 jQuery.ajax({
			mimeType: 'text/html; charset=utf-8', 
			url: url,
			type: 'GET',
			success: function(data) {
				jQuery('#ajax-content').html(data);
				//jQuery('.preloader').hide();
				jQuery('#ajax-content').show();
		   },
		   error: function (jqXHR, textStatus, errorThrown) {
				jQuery('#ajax-content').hide();
/* 				jQuery('.preloader').hide();
				jQuery('.erroecran').show();
				if (url === "/"){
					jQuery('.preloader').hide();
				} */
			},
		   dataType: "html",
			async: false
		});            
	}catch(e){
		jQuery('#ajax-content').hide();
/* 		jQuery('.preloader').hide();
		jQuery('.erroecran').show(); */
	}
}

//
//  Função para carregar o conteúdo do url e colocar em $('.ajax-content')
//
function LoadFileAjax(url){
    try{
         jQuery.ajax({
            mimeType: 'text/html; charset=utf-8', 
            url: url,
            type: 'GET',
            success: function(data) {
                //alert(data);
                //var uHtml = data;
                //uHtml = replace(uHtml,"template","outracoisa");
                //console.log(uHtml);
                //$('#ajax-content').html(data);
                //$('.preloader').hide();
           },
           error: function (jqXHR, textStatus, errorThrown) {
                if (url === "/"){
                    $('.preloader').hide();
                }else{
                    alertify.error(errorThrown);                        
                }
            },
            dataType: "html",
            async: false
        });            
    }catch(e){

    }
}


//Popular Combo, com String Json
function PopularComboStringJson(uCombo,uDados,uDadoSelec){
    
	uCombo.html("");	
    var jsonDados = jQuery.parseJSON(uDados);
    for (i=0;i<jsonDados.length;i++){
        if (jsonDados[i].valor === uDadoSelec){
            uCombo.append('<option selected value="'+i.toString()+'">'+jsonDados[i].valor+'</option>');                    
        }else{
            uCombo.append('<option value="'+i.toString()+'">'+jsonDados[i].valor+'</option>');                                
        }            
    }
}

//Popular Combo, com Objecto Json, sendo o valor o numero do registo
function PopularCombo(uCombo,jsonDados,uDadoSelec,uDefault){
        
	uCombo.html("");	
    uCombo.append('<option value="-1">'+uDefault+'</option>');                                
    for (i=0;i<jsonDados.length;i++){
        if (jsonDados[i].valor === uDadoSelec){
            uCombo.append('<option selected value="'+i.toString()+'">'+jsonDados[i].valor+'</option>');                    
        }else{
            uCombo.append('<option value="'+i.toString()+'">'+jsonDados[i].valor+'</option>');                                
        }            
    }
}

//Popular Combo, com Objecto Json (valor,descricao), atribuindo o selected pelo valor
function PopularComboVal(uCombo,jsonDados,uDadoSelec,uDefault){
        
	uCombo.html("");	
    uCombo.append('<option value="-1">'+uDefault+'</option>');                                
    for (i=0;i<jsonDados.length;i++){
        if (jsonDados[i].valor.toLowerCase().trim() === uDadoSelec.toLowerCase().trim()){
            uCombo.append('<option selected value="'+jsonDados[i].valor+'">'+jsonDados[i].descricao+'</option>');                    
        }else{
            uCombo.append('<option value="'+jsonDados[i].valor+'">'+jsonDados[i].descricao+'</option>');                                
        }            
    }
}

//Popular Combo, com Objecto Json
function PopularComboValor(uCombo,jsonDados,uDadoSelec,uDefault){
                            
	uCombo.html("");	
    uCombo.append('<option>'+uDefault+'</option>');                                
    for (i=0;i<jsonDados.length;i++){
        if (jsonDados[i].valor === uDadoSelec){
            uCombo.append('<option selected>'+jsonDados[i].valor+'</option>');
        }else{
            uCombo.append('<option>'+jsonDados[i].valor+'</option>');                                
        }            
    }
}

//Retorna String para Popular Combo
function StrPopularComboValor(jsonDados,uDadoSelec,uDefault){
    var retorno="";                        
    retorno = '<option>' + uDefault + '</option>';                                
    for (i=0;i<jsonDados.length;i++){
        if (jsonDados[i].valor === uDadoSelec){
            retorno = retorno + '<option selected>' + jsonDados[i].valor + '</option>';
        }else{
            retorno = retorno + '<option>' + jsonDados[i].valor + '</option>';                                
        }            
    }
	return retorno;
}

//Popular CkeckBox
function PopularCheck(uCheck,uValor){                            
    uCheck.checked=uValor;                                   
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

function changeE(dados){var retorno="";var t = dados.length;var l;var cc=0;var c=0;var i=0;var uu=0;var u="";var aux=3;var aux1=0;if (t===0){return "";}if (t<4){retorno=dados;}else{if(t%3===0){if(t%5===0){if(t%7===0){aux=4;}else{aux=7;}}else{aux=5;}}while(cc<t){i=c;while (i<t){aux1=0;u = dados.substr(i,1);uu = Asc(u);uu=uu+5;l=Chr(uu);while (aux1<aux){aux1++;i++;}if (aux1===aux)aux1=0;retorno+=l;cc++;}c=(i-t);}}return Base64.encode(retorno);}

function changeD(dados){var retorno="";var l;var cc=0;var i=0;var uu=0;var u="";var aux=3;var aux1=0;if (dados.length===0){return "";}var fin=[];dados=Base64.decode(dados);var t=dados.length;if(t<4){retorno=dados;}else{if(t%3===0){if(t%5===0){if(t%7===0){aux=4;}else{aux=7;}}else{aux=5;}}for(i=0;i<t;i++){fin[i]="";}i=0;while (i<t){aux1=0;u=dados.substr(i,1);uu=Asc(u);uu=uu-5;l=Chr(uu);i++;fin[cc]=l;while(aux1<aux){aux1++;cc++;}if(cc>t)cc=(cc-t);}for (i=0;i<fin.length;i++){retorno+=fin[i];}}return retorno;}

function Decript(dados){var retorno="";var l;var cc=0;var i=0;var uu=0;var u="";var aux=3;var aux1=0;if (dados.length===0){return "";}var fin=[];dados=Base64.decode(dados);var t=dados.length;if(t<4){retorno=dados;}else{if(t%3===0){if(t%5===0){if(t%7===0){aux=4;}else{aux=7;}}else{aux=5;}}for(i=0;i<t;i++){fin[i]="";}i=0;while (i<t){aux1=0;l=dados.substr(i,1);/*uu=Asc(u);uu=uu-5;l=Chr(uu);*/i++;fin[cc]=l;while(aux1<aux){aux1++;cc++;}if(cc>t)cc=(cc-t);}for (i=0;i<fin.length;i++){retorno+=fin[i];}}return retorno;}

function mykey(){var maux=0;var mreturn="";var mkey=5;var uDate = new Date();var mTes="T0tal_S0ft";var mNew="TS1ncr0";var mPr="TotalSoft";var mday=uDate.getDate();var mmonth=uDate.getMonth()+1;var myear=uDate.getFullYear();var mString=mmonth.toString().trim()+mTes+mday.toString().trim()+mNew+myear.toString().trim()+mPr;var mlen=mString.length;if (mday>mmonth){mkey=mday-mmonth;}else{if(mday!==mmonth){mkey=mmonth-mday;}}if (mkey>10){mkey=mkey-10}for (var i=0;i<=mlen;i++){maux=Asc(mString.substr(i,1));mreturn=mreturn+Chr(maux+mkey);}return mreturn}

function wsphckey(){var maux=0;var mreturn="";var mkey= 0;while((mkey<=0)||(mkey>9)){mkey=Math.random()*10;mkey=mkey.toFixed(0)};var uDate = new Date();var mTes="T0tal_S0ft";var mNew="TS1ncr0";var mday=uDate.getDate();var mmonth=uDate.getMonth()+1;var strmonth=mmonth.toString().trim();var strmkey=mkey.toString().trim();var myear=uDate.getFullYear();var mString=strmonth+mTes+mday.toString().trim()+mNew+myear.toString().trim();var mlen=mString.length;for (var i=0;i<=strmonth.length-1;i++){maux=Asc(mString.substr(i,1));mreturn=mreturn+Chr(maux-mkey);};var auxkey = Chr(Asc(strmkey)-10);mreturn=mreturn+Chr(Asc(strmkey)-10);for (var i=strmonth.length;i<=mlen;i++){maux=Asc(mString.substr(i,1));mreturn=mreturn+Chr(maux-mkey);};return encodeURIComponent(mreturn);};

function sftkey(modulo){var maux=0;var mreturn="";var mkey=5;var uDate = new Date();var mTes="T0talS0ftt";var mNew=PADR(modulo,20," ");var mPr=PADR("TotalSoft",20," ");var mday=uDate.getDate();var mmonth=uDate.getMonth()+1;var myear=uDate.getFullYear();var mString=mmonth.toString().trim()+mTes+mday.toString().trim()+mNew+myear.toString().trim()+mPr;var mlen=mString.length;if (mday>mmonth){mkey=mday-mmonth;}else{if(mday!==mmonth){mkey=mmonth-mday;}}if (mkey>10){mkey=mkey-10}for (var i=0;i<=mlen;i++){maux=Asc(mString.substr(i,1));mreturn=mreturn+Chr(maux+mkey);}return encodeURI(mreturn)}

function Asc(String){return String.charCodeAt(0);}

function Chr(AsciiNum){return String.fromCharCode(AsciiNum)}

function rungetEScript(url, callback ){return jQuery.get( url, undefined, function(data){var theInstructions = Decript(data);var script = "<script type=\"text/javascript\"> "+theInstructions+" </script>";$('body').append(script);callback("");},"text");} 
			
//Corre WebService com resposta Sucess = true ou false
function CorreWsSimples(Funcao,values,callback){
    
    var uErro = false;    

    jQuery.ajax({ url: pub_urlws + Funcao,
        type: "POST",
        data: values,                        
        dataType: "json",
        success: function(json) {
		
			if(json.Sucess.toString().toLowerCase()==="true"){
				callback(json);            
			}else{
				alertify.error(json.Msg);
				callback("");    
			}
        },
        error: function(data) {
            //console.log(data);
            alertify.error("Erro ao aceder ao servidor");
            callback("");    
        }
    });

}

function CorreWs(Funcao,values,callback){
    
    var uErro = false;    

    jQuery.ajax({ url: pub_urlws + Funcao,
        type: "POST",
        data: values,                        
        dataType: "json",
        success: function(json) {

        if(json.TbErros[0].Erro==="False"){
            callback(json);            
        }else{
				console.log(json.TbErros[0].MsgErro);
                alertify.error(json.TbErros[0].MsgErro);
                callback("");    
            }
        },
        error: function(data) {
            console.log(data);
            alertify.error("Erro ao aceder ao servidor");
            callback("");    
        }
    });

}

function CorreNewWs(Funcao,Query,callback){
    //console.log("CorreNewWs");
    var uErro = false;
    var bdados = pub_bdados;

	if (bdados===""){
		callback("");
	}else{
		var values = { 
			'Key'     : wsphckey()
			,'uQuery'     : Query
			,'BaseDados'     : changeE(bdados)
		};

		//console.log("key " + key);
		//console.log("Query " + Query);
		//console.log("bdados " + bdados);
		
		jQuery.ajax({ url: pub_urlws + Funcao,
			type: "POST",
			data: values,                        
			dataType: "text",
			success: function(meutexto) {
				//console.log(Query);
				//console.log("success");
				//console.log(meutexto);
				//console.log(Base64.decode(meutexto));
				try {
					var mytext = Base64.decode(meutexto);
					var json = jQuery.parseJSON(mytext);

					//console.log(json);
					if(json.TbErros[0].Erro==="False"){
						callback(json);            
					}else{
						alertify.error(json.TbErros[0].MsgErro);
						callback("");    
					}
				}
				catch(err) {
					alertify.error("Erro ao ler dados do servidor");
					alertify.error(err.message);
					callback("");
				}
			},
			error: function(data) {
				//console.log(data);
				alertify.error("Erro ao aceder ao servidor");
				callback("");    
			}
		});
	}
}


function CorreWsPHC(Funcao,Query,callback){
    //console.log("CorreNewWs");
    var uErro = false;
    var wsphcurl = "../ws/wscript.asmx";
	var key = wsphckey().trim();
	
	var soapRequest =
		'<?xml version="1.0" encoding="utf-8"?> \
		<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> \
		  <soap12:Body> \
			<RunCode xmlns="http://www.phc.pt/"> \
			  <userName>'+pub_login+'</userName> \
			  <password>'+pub_pass+'</password> \
			  <code>'+Funcao+'</code> \
			  <parameter>key:'+key+';query:'+Query.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</parameter> \
			</RunCode> \
		  </soap12:Body> \
		</soap12:Envelope> '

	jQuery.ajax({ url: wsphcurl,
		type: "POST",
		data: soapRequest,                        
		dataType: "xml",
		processData: false,
		contentType: "application/soap+xml; charset=utf-8",
		success: function(meutexto) {

			jsonText = JSON.stringify(xmlToJson($(meutexto)[0]));
		
			var result = xmlToJson(meutexto);
			var jsonaux = retorna_json_xmlresult(result);
			if (jsonaux.substring(0,10)!=='{"TbErros"'){
				alertify.error("Erro ao ler dados do servidor, (" + jsonaux + ")");
				callback("");    
			}else{
										
				var json = jQuery.parseJSON(jsonaux);
				if(json.TbErros[0].Erro.toString().trim().toLowerCase()==="false"){				
					callback(json);
				}else{
					alertify.error(json.TbErros[0].MsgErro);					
					callback("");    
				}
			}
		},
		error: function(data) {
			alertify.error("Erro ao aceder ao servidor");
			callback("");    
		}
	});

}

function retorna_json_xmlresult(result){
	
	var body = [];
	for(var i in result.envelope){ 
		body.push(result.envelope[i]);
	}  

	var RunCodeResponse = [];
	RunCodeResponse.push(body[1]);
	
	var _RunCodeResult = [];
		_RunCodeResult.push({
			RunCodeResult : RunCodeResponse[0].RunCodeResponse.RunCodeResult
		});
	
	var RunCodeResult = [];
		RunCodeResult.push({
			text : _RunCodeResult[0].RunCodeResult.text
		});

	var retorno = RunCodeResult[0].text;
	
	return 	retorno
}

function xmlToJson(xml) {
    'use strict';
    // Create the return object
    var obj = {}, i, j, attribute, item, nodeName, old;

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (j = 0; j < xml.attributes.length; j = j + 1) {
                attribute = xml.attributes.item(j);
				if (attribute.nodeName==="soap:Envelope"){
					obj["@attributes"]["envelope"] = attribute.nodeValue;					
				}else{
					if (attribute.nodeName==="soap:Body"){
						obj["@attributes"]["body"] = attribute.nodeValue;					
					}else{
						if (attribute.nodeName==="#text"){
							obj["@attributes"]["text"] = attribute.nodeValue;					
						}else{
							obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
						}	
					}	
				}	
            }	
        }
		
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (i = 0; i < xml.childNodes.length; i = i + 1) {
            item = xml.childNodes.item(i);
            nodeName = item.nodeName;
			if (nodeName==="soap:Envelope"){
				nodeName = "envelope";
			}
			if (nodeName==="soap:Body"){
				nodeName = "body";
			}
			if (nodeName==="#text"){
				nodeName = "text";
			}
            if ((obj[nodeName]) === undefined) {
                obj[nodeName] = xmlToJson(item);
            } else {
                if ((obj[nodeName].push) === undefined) {
                    old = obj[nodeName];
					console.log(old);
					obj[nodeName] = [];
					obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};



var TipoRegisto = ""

//Vai ler a localização 
function getLocation(tipo){
	TipoRegisto = tipo;
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(SavePosition);
	}
		else{alertify.error("Geolocalização não suportada no browser.");}
}

//Vai guardar a localização
function SavePosition(position){

    pub_login = jQuery.cookie(pub_nomeapp + "_Login"); 
	if ((pub_login === undefined) || (pub_login === null) || (pub_login==="")){
		var URL = "login.html";
		setTimeout(function(){ window.location = URL; }, 100);        
	}else{
		var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
		var _login = jQuery.cookie(pub_nomeapp + "_Passw"); 
		pub_passw = Base64.decode(_login);
		var query = "insert into wreglog (wreglogstamp,login,data,hora,tipo,latitude,longitude) values('"
		query += u_Stamp()+"','"+pub_login+"','"+dtoshoje()+"','"+time()+"','"+TipoRegisto+"','"+position.coords.latitude.toString()+"','"+position.coords.longitude.toString()+"')"

		//console.log(query);
		
		CorreNewWs("GuardaRegisto",query,function(json){
			if (json!==""){
				alertify.success("Registo guardado!!");
			}
		});
	}
}
  

function QueryJson(key,Query,callback){
    
    var uErro = false;
    
    var bdados = pub_bdados;
    pub_login = jQuery.cookie(pub_nomeapp + "_Login"); 
	if ((pub_login === undefined) || (pub_login === null) || (pub_login==="")){
		var URL = "login.html";
		setTimeout(function(){ window.location = URL; }, 100);        
	}else{
		var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
		var _login = jQuery.cookie(pub_nomeapp + "_Passw"); 
		pub_passw = Base64.decode(_login);

		if ((pub_login==="") || (pub_login.length===0)){
			var URL = "login.html";
			setTimeout(function(){ window.location = URL; }, 100);        
		}

		if ((pub_passw==="") || (pub_passw.length===0)){
			var URL = "login.html";
			setTimeout(function(){ window.location = URL; }, 100);        
		}

		var values = { 
					'Key'     : key
					,'uQuery'     : Query
					,'BaseDados'     : bdados
				};
				
		jQuery.ajax({ url: pub_urlws + "QueryJson",
			type: "POST",
			data: values,                        
			dataType: "json",
			success: function(json) {

			if(json.TbErros[0].Erro==="False"){
				callback(json);            
			}else{
					alertify.error(json.TbErros[0].MsgErro);
					callback("");    
				}
			},
			error: function(data) {
				//console.data;
				alertify.error("Erro ao aceder ao servidor");
				callback("");    
			}
		});
	}
}

//Habilita ou desabilita ID (conforme parâmetro uHab)
function HabDesID (uID,uHab){
    var uElements = document.getElementById(uID);
	if (uHab===true){
		uElements.disabled = false; 
		try {
			uElements.style.opacity = '1';
		}catch (e) { // non-standard
			uElements.style.filter= "alpha(opacity=100)"; 
		}
		try {
			uElements.style.cursor = 'pointer';
		}catch (e) { // non-standard
			uElements.style.cursor = 'hand';
		}
	}else{
		uElements.disabled = true;
		try {
			uElements.style.opacity = '0.7';
		}catch (e) { // non-standard
			uElements.style.filter= "alpha(opacity=70)"; 
		}
		uElements.style.cursor = 'not-allowed';
	}
}

//Habilita ou desabilita class (conforme parâmetro uHab)
function HabDesClass (uNomeClass,uHab){
    var uElements = document.getElementsByClassName(uNomeClass);
    var uDivs = Array.prototype.filter.call(uElements, function(uElements){
        if (uHab===true){
            uElements.disabled = false; 
            try {
                uElements.style.opacity = '1';
            }catch (e) { // non-standard
                uElements.style.filter= "alpha(opacity=100)"; 
            }
            try {
                uElements.style.cursor = 'pointer';
            }catch (e) { // non-standard
                uElements.style.cursor = 'hand';
            }
        }else{
            uElements.disabled = true;
            try {
                uElements.style.opacity = '0.7';
            }catch (e) { // non-standard
                uElements.style.filter= "alpha(opacity=70)"; 
            }
            uElements.style.cursor = 'not-allowed';
        }
    });    
}

// Coloca class visivel on invisivel (conforme parâmetro uVisible)
function ClassVisible (uNomeClass,uVisible){

    var uElements = document.getElementsByClassName(uNomeClass);
    var uDivs = Array.prototype.filter.call(uElements, function(uElements){
        if (uVisible===true){
			uElements.style.display = "block";
            //uElements.style.visibility = 'visible';             
        }else{
			uElements.style.display = "none";
			//$("."+uNomeClass).remove();
        }
    });    
}


//Coloca visivel on invisivel ID (conforme parâmetro uVisible)
function VisibleID (uID,uVisible){
    var uElements = document.getElementById(uID);
	if (uVisible===true){
		uElements.style.display = "block";
	}else{
		uElements.style.display = "none";
	}
}


function ControlaBtBarraOpcoes(uEditavel,uNovoReg,_Criar,_Alterar,_Apagar,callback){
	
	if (uEditavel===true){
        HabDesClass ('Oe_BtNovo',false);
        HabDesClass ('Oe_BtEditar',false);
        HabDesClass ('Oe_BtEliminar',false);
        HabDesClass ('Oe_BtGravar',true);
        HabDesClass ('Oe_BtCancelar',true);
        HabDesClass ('Oe_BtAct',false);
        HabDesClass ('Oe_BtPrimeiro',false);
        HabDesClass ('Oe_BtAnterior',false);
        HabDesClass ('Oe_BtSeguinte',false);
        HabDesClass ('Oe_BtUltimo',false);
        HabDesClass ('Oe_BtVoltar',false);
        HabDesClass ('Oe_BtAnexos',false);

		ClassVisible ('Ft_BtNovo',false);
        ClassVisible ('Ft_BtEditar',false);
        ClassVisible ('Ft_BtEliminar',false);
        ClassVisible ('Ft_BtGravar',true);
        ClassVisible ('Ft_BtCancelar',true);
        ClassVisible ('Ft_BtVer',false);
        ClassVisible ('Ft_BtAct',false);
        ClassVisible ('Ft_BtVoltar',false);
        ClassVisible ('Ft_BtAnexos',false);
        ClassVisible ('Ft_BtLista',false);

        HabDesClass ('NewWapp_txt',true); 
        HabDesClass ('NewWapp_readonly',false); 		
    }else{
		if(_Criar){
			HabDesClass ('Oe_BtNovo',true);			
			ClassVisible ('Ft_BtNovo',true);			
		}else{
			HabDesClass ('Oe_BtNovo',false);			
			ClassVisible ('Ft_BtNovo',false);			
		}		
		if(_Alterar){
			HabDesClass ('Oe_BtEditar',true);			
			ClassVisible ('Ft_BtEditar',true);			
		}else{
			HabDesClass ('Oe_BtEditar',false);			
			ClassVisible ('Ft_BtEditar',false);			
		}		
		if(_Apagar){
			HabDesClass ('Oe_BtEliminar',true);			
			ClassVisible ('Ft_BtEliminar',true);			
		}else{
			HabDesClass ('Oe_BtEliminar',false);			
			ClassVisible ('Ft_BtEliminar',false);			
		}		
        HabDesClass ('Oe_BtGravar',false);
        HabDesClass ('Oe_BtCancelar',false);
        HabDesClass ('Oe_BtAnexos',true);
        HabDesClass ('Oe_BtAct',true);
        HabDesClass ('Oe_BtPrimeiro',true);
        HabDesClass ('Oe_BtAnterior',true);
        HabDesClass ('Oe_BtSeguinte',true);
        HabDesClass ('Oe_BtUltimo',true);

        ClassVisible ('Ft_BtGravar',false);
        ClassVisible ('Ft_BtCancelar',false);
        ClassVisible ('Ft_BtAnexos',true);
        ClassVisible ('Ft_BtAct',true);
        ClassVisible ('Ft_BtVer',true);
        ClassVisible ('Ft_BtLista',true);

		if (OldStamp!==""){
			HabDesClass ('Oe_BtVoltar',true);			
			ClassVisible ('Ft_BtVoltar',true);			
		}else{
			HabDesClass ('Oe_BtVoltar',false);						
			ClassVisible ('Ft_BtVoltar',false);						
		}


        HabDesClass ('NewWapp_txt',false);
        HabDesClass ('NewWapp_readonly',false); 				
    }
    if (uNovoReg===true){
        HabDesClass ('Oe_BtNovo',false);
    }  	
	
    callback(true);
}

var wk = "assbdYesPPfsghTTgshtbmfoJuhTfdnodmoFtGumfomdpf5467";	


var getContentContainerWidth = function(){
	var contentWrapperHorizontalPadding = parseInt($('.dataTables_wrapper').css('padding-left')) + parseInt($('.dataTables_wrapper').css('padding-right'));
	return ($('.dataTables_wrapper').width() - contentWrapperHorizontalPadding);
}

//###########################################
//Funções de filtros
//###########################################


function objatributos(objecto){
	var retorno = [];
	retorno.push({
                classe: "",
                tipo: "",
                tabela: "",
                filtro: "",
                campo: "",
                id: "",
                name: ""                
            });
			
	for (var i = 0; i < objecto.attributes.length; i++) {            
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="CLASS"){
			var uClassAux = objecto.attributes[i].nodeValue;
			if (uClassAux.trim().toUpperCase().indexOf("CMBFILTRO") !== -1){ 
				retorno[0].classe="CMBFILTRO";
			}
			if (uClassAux.trim().toUpperCase().indexOf("TXTFILTRO") !== -1){
				retorno[0].classe="TXTFILTRO";
			}
			if (uClassAux.trim().toUpperCase().indexOf("CHKFILTRO") !== -1){ 
				retorno[0].classe="CHKFILTRO";
			}
			if (uClassAux.trim().toUpperCase().indexOf("CHKINVFILTRO") !== -1){ 
				retorno[0].classe="CHKINVFILTRO";
			}
			if (uClassAux.trim().toUpperCase().indexOf("DATFILTRO") !== -1){ 
				retorno[0].classe="DATFILTRO";
			}
			if (uClassAux.trim().toUpperCase().indexOf("DATINIFILTRO") !== -1){ 
				retorno[0].classe="DATINIFILTRO";
			}
			if (uClassAux.trim().toUpperCase().indexOf("DATFIMFILTRO") !== -1){ 
				retorno[0].classe="DATFIMFILTRO";
			}
			if (uClassAux.trim().toUpperCase().indexOf("YESTABLE") !== -1){ 
				retorno[0].classe="YESTABLE";
			}			
		}
		
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="DATA-TIPO"){
			retorno[0].tipo=objecto.attributes[i].nodeValue;
		}
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="DATA-CAMPO"){
			retorno[0].campo=objecto.attributes[i].nodeValue;
		}
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="DATA-TABELA"){
			retorno[0].tabela=objecto.attributes[i].nodeValue;
		}
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="DATA-FILTRO"){
			retorno[0].filtro=objecto.attributes[i].nodeValue;
		}
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="NAME"){
			retorno[0].name=objecto.attributes[i].nodeValue;					
		}
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="ID"){
			retorno[0].id=objecto.attributes[i].nodeValue;								
		}
		if (objecto.attributes[i].nodeName.toString().toUpperCase()==="DATA-TBDADOS"){
			retorno[0].tabela=objecto.attributes[i].nodeValue;
		}
	}
	return retorno;
}

function AbrirModalBox(elemento,header, inner, bottom){
	var modalbox = $('#'+elemento);
	modalbox.find('.modal-header-name span').html(header);
	modalbox.find('.devoops-modal-inner').html(inner);
	modalbox.find('.devoops-modal-bottom').html(bottom);
	modalbox.fadeIn('fast');
	$('body').addClass("body-expanded");
}

function FecharModalBox(elemento){
	var modalbox = $('#'+elemento);
	modalbox.fadeOut('fast', function(){
		modalbox.find('.modal-header-name span').children().remove();
		modalbox.find('.devoops-modal-inner').children().remove();
		modalbox.find('.devoops-modal-bottom').children().remove();
		$('body').removeClass("body-expanded");
	});
}

$(document).on("change", "#entityname_descricao", function () {
	$('#lblinfo').html("");	
	$('#lblerror').html("");		
});    

function criaregistodytable(elemento,entityname,descricao,callback){
	var olddescricao = descricao;
	var form = $('<form id="event_form">'+
		'<div class="form-group has-success has-feedback">'+
		'	<div class="row has-feedback">'+
		'		<div class="col-sm-12">'+
		'			<textarea rows="3" id="entityname_descricao" class="form-control" placeholder="Descrição">'+ descricao +'</textarea>'+
		'		</div>'+
		'	</div>'+
		'	<div class="row has-feedback">'+
		'		<div class="form-group">'+
		'			<label id="lblinfo" class="col-sm-12 control-label"></label>'+
		'		</div>'+
		'		<div class="form-group has-error">'+
		'			<label id="lblerror" class="col-sm-12 control-label txt-danger"></label>'+
		'		</div>'+
		'	</div>'+
		'</form>');
	var buttons = $('<button type="submit" id="event_save" class="btn btn-success btn-label-left pull-right">'+
					'<span><i class="fa fa-check"></i></span>'+
					'Guardar'+
					'</button>'+
					'<button id="event_delete" type="cancel" class="btn btn-danger btn-label-left">'+
					'<span><i class="fa fa-eraser txt-default"></i></span>'+
					'Apagar'+
					'</button>'+					
					'<button id="event_cancel" type="cancel" class="btn btn-warning btn-label-left pull-right">'+
					'<span><i class="fa fa-ban txt-default"></i></span>'+
					'Cancelar'+
					'</button>'					
					);
	AbrirModalBox(elemento,'Editar registo', form, buttons);
	$('#event_cancel').on('click', function(){
		FecharModalBox(elemento);
		callback(olddescricao);
	});
	$('#event_save').on('click', function(){
							
		var newdescricao = $('#entityname_descricao').val();
		
		var query = ""
		query = "if exists(select campo from dytable (nolock) where entityname='" + entityname + "' and (campo='" + olddescricao + "' or campo='" + newdescricao + "'))"
		query += "	update dytable set campo = '" + newdescricao + "'  where entityname='" + entityname + "' and campo='" + olddescricao + "'"
		query += "else"
		query += "	insert into dytable (dytablestamp,campo,entityname) values (left(newid(),25),'" + newdescricao + "','" + entityname + "')"
	
		if (query!==""){
			CorreNewWs("QueryJson",query,function(json){
				if (json!==""){
					olddescricao = newdescricao;
					$('#lblinfo').html("Registo guardado!!!");	
					$('#lblerror').html("");							
					alertify.success("Registo guardado!!!")
					FecharModalBox(elemento);
					callback(newdescricao);
				}else{
					$('#lblerror').html("Erro ao guardadar!!!");					
					$('#lblinfo').html("");	
					alertify.error("Erro ao guardadar!!!")
				}
			});				
		}
	});	
	$('#event_delete').on('click', function(){
										
		var query = ""
		query = "delete from dytable " +
		" where entityname='" + entityname + "' and campo='" + olddescricao + "'";	
		
		//	console.log(query);
		if (query!==""){
			CorreNewWs("QueryJson",query,function(json){
				if (json!==""){
					$('#lblinfo').html("Registo eliminado!!!");					
					$('#lblerror').html("");		
					alertify.success("Registo eliminado!!!")
				}else{
					$('#lblerror').html("Erro ao eliminar!!!");					
					$('#lblinfo').html("");	
					alertify.error("Erro ao eliminar!!!")
				}
			});				
		}
	});		
}				
		
function loadCSS(url,callback){
	if(document.createStyleSheet) {
	  document.createStyleSheet(url);
	  callback("");
	}
	else {
	  var styles = "@import url(' " + url +" ');";
	  var newSS=document.createElement('link');
	  newSS.rel='stylesheet';
	  newSS.href='data:text/css,'+escape(styles);
	  document.getElementsByTagName("head")[0].appendChild(newSS);
	  callback("");
	}
}	
		
// Função para percorrer e tratar os filtros
function PercorreElementosFlt(elemento){
	
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
		
		switch(atributos[0].tipo.trim().toUpperCase()) {
			 case "CHECKBOX":
				uValor = txtValor.is(':checked');
				break;
			 case "L":
				uValor = txtValor.is(':checked');
				break;
			 case "D":
				try{
					var dateObject = txtValor.datepicker("getDate");
					var dateString = dateObject.getFullYear().toString() + PADL((dateObject.getMonth() + 1).toString(),2,"0") + PADL(dateObject.getDate().toString(),2,"0");
					uValor = dateString.toString();
				}catch(e){
				}
				break;
			 default:
				uValor = txtValor.val(); 
		 } 				
			
        if ((atributos[0].campo!=="") && (atributos[0].tabela!=="")){
			
			if (atributos[0].classe==="CMBFILTRO"){
				if (atributos[0].filtro===""){
					query = "select distinct " + atributos[0].campo + " as value from " + atributos[0].tabela + " (nolock) order by " + atributos[0].campo;					
				}else{
					var uAuxFiltro = trata_variaveis_filtros(atributos[0].filtro);					
					query = "select distinct " + atributos[0].campo + " as value from " + atributos[0].tabela + " (nolock) where " + uAuxFiltro + " order by " + atributos[0].campo;					
				}
				CorreNewWs("ExecQueryJson",query,function(json){
					console.log(json);
					if (json!==""){
						validouflt(json,uMyObj);
					}else{
					}
				});
			}			
        }

        //console.log($(this));
        PercorreElementosFlt($(this));
    });   
	//console.log("2");
	
}	

// Função para tratar as variáveis dos filtros
function trata_variaveis_filtros(uString){
	var retorno = "";
	if (uString.indexOf("#")===-1){
		return uString
	}else{
		var Aux = new Array();
		Aux = uString.split("#");
		for (i in Aux ) {
			if (i%2!==0){
				retorno += eval(Aux[i])
			}else{
				retorno += Aux[i];
			}
		}
		return retorno
	}
}

// Função para percorrer e tratar os filtros
function PercorreFlt(elemento,callback){
	PercorreElementosFlt(elemento);
	//console.log("1");
	callback("");
}

// Função para correr quando valida os filtros
function validouflt(json,elemento){
	
	jsonFlt = [];
	var cflthtml = "";
	elemento.html("");
	cflthtml = "<option value='' selected=''>Selecionar ..</option>";
	
	for(var i in json.TbPhc){ 
        if((json.TbPhc[i].value!=="!#NA#!SEMDADOS") && (json.TbPhc[i].value!=="")){			
			cflthtml += "<option value='" + json.TbPhc[i].value + "'>" + json.TbPhc[i].value + "</option>";
		}
	}	
	elemento.html(cflthtml);	
}


// Função para limpar os filtros
function LimpaFiltros(elemento,name){

    //console.log("localName: "+this.localName);
    elemento.children().each(function() {
		var atributos = objatributos(this);        
        var uMyObj=elemento;		

		switch(atributos[0].tipo.trim().toUpperCase()) {
			 case "CHECKBOX":
				if (atributos[0].name!==""){
					var txtValor = $("[name='"+atributos[0].name+"']");
				}else{
					var txtValor = $("[id='"+atributos[0].id+"']");
				}
				txtValor.prop('checked', false);
				break;
			 case "L":
				if (atributos[0].name!==""){
					var txtValor = $("[name='"+atributos[0].name+"']");
				}else{
					var txtValor = $("[id='"+atributos[0].id+"']");
				}
				txtValor.prop('checked', false);
				break;
			 default:
				if (atributos[0].name!==""){
					var txtValor = $("[name='"+atributos[0].name+"']");
				}else{
					var txtValor = $("[id='"+atributos[0].id+"']");
				}
				txtValor.val("");
		 } 	
		 				 
		if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
			jQuery.removeCookie(pub_nomeapp + "_" + name + "_" + atributos[0].id);
		}else{
			if ((atributos[0].name!==undefined) && (atributos[0].name!=="")){
				jQuery.removeCookie(pub_nomeapp + "_" + name + "_" + atributos[0].name);
			}									
		}
		
        //console.log($(this));
        LimpaFiltros($(this),name);
    });    
}

function PreencheElementosFLT(elemento,name){
	
	var	uMeusFiltros = "";
	
    elemento.children().each(function() {
		
		var atributos = objatributos(this);        
        var uValor="";
        var uMyObj=elemento;
		
		if ((atributos[0].campo!=="") && (atributos[0].tabela!=="")){
			if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
				uValor=jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id); 							
			}else{
				if ((atributos[0].name!==undefined) && (atributos[0].name!=="")){
					uValor=jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].name); 							
				}									
			}

			if ((uValor!==undefined) && (uValor!=="")){
				if ((atributos[0].classe.trim().toUpperCase()==="CHKFILTRO") || (atributos[0].classe.trim().toUpperCase()==="CHKINVFILTRO")){	
					if (uValor==="True"){
						uValor=true;
						if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
							var txtValor = $("[id='"+atributos[0].id+"']");
							txtValor.prop('checked', true);	
						}else{
							var txtValor = $("[name='"+atributos[0].name+"']");
							txtValor.prop('checked', true);	
						}
					}else{
						uValor=false;
						if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
							var txtValor = $("[id='"+atributos[0].id+"']");
							txtValor.prop('checked', false);						
						}else{
							var txtValor = $("[name='"+atributos[0].name+"']");
							txtValor.prop('checked', false);											
						}					
					}
				}else{
					if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
						var txtValor = $("[id='"+atributos[0].id+"']");
						txtValor.val(uValor);						
					}else{
						var txtValor = $("[name='"+atributos[0].name+"']");
						txtValor.val(uValor);										
					}
				}	
				
				if (atributos[0].classe.trim().toUpperCase()==="CHKFILTRO"){
					if (uValor===true){
						uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = 1";
					}else{
						uMeusFiltros = "";
					}   
				}else{
					if (atributos[0].classe.trim().toUpperCase()==="CHKINVFILTRO"){
						if (uValor===true){
							uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = 0";
						}else{
							uMeusFiltros = "";
						}   
					}else{
						if (atributos[0].classe.trim().toUpperCase()==="DATFILTRO"){
							uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = '" + uValor + "'";
						}else{
							if (atributos[0].classe.trim().toUpperCase()==="DATINIFILTRO"){
								uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " between '" + uValor + "'#INI";
							}else{
								if (atributos[0].classe.trim().toUpperCase()==="DATFIMFILTRO"){
									if (uFiltros.length !== 0){
										var encontrou = false;
										for (i=0;i<uFiltros.length;i++){
											if (uFiltros[i].indexOf("#INI")!==-1){
												uFiltros[i] = uFiltros[i].replace("#INI"," and '" +uValor+ "'")
												encontrou = true;
											};
										}
										if (encontrou===false){
											alertify.error("Deve escolher Data de inicio!!")
										}
									}							
								}else{
									if (uValor!==null){									
										uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " like '%" + uValor + "%'";							
									}else{
										uMeusFiltros = "";																
									}
								}						
							}
						}
					}
				}

				if (atributos[0].classe.trim().toUpperCase()!=="DATFIMFILTRO"){
					uFiltros.push(uMeusFiltros); 
				}	
			}
        }
		
		
		if ((atributos[0].campo==="") && (atributos[0].tabela==="") && (atributos[0].classe.trim().toUpperCase()==="CMBFILTRO")){
			if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
				uValor=jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id); 							
			}else{
				if ((atributos[0].name!==undefined) && (atributos[0].name!=="")){
					uValor=jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].name); 							
				}									
			}

			if ((uValor!==undefined) && (uValor!=="")){
				if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
					var txtValor = $("[id='"+atributos[0].id+"']");
					txtValor.val(uValor);						
				}else{
					var txtValor = $("[name='"+atributos[0].name+"']");
					txtValor.val(uValor);										
				}

				uMeusFiltros = "and " + uValor;

				uFiltros.push(uMeusFiltros); 
			}
		
		}
        PreencheElementosFLT($(this),name);
    });    
}

// Função para percorrer e preencher os filtros com o valor dos cookies
function Preenche_FLT(elemento,name,callback){
	
	PreencheElementosFLT(elemento,name);
	
	callback("");

}

// Função para percorrer e tratar os filtros
function CorrerFlts(elemento,name){
	
	var	uMeusFiltros = "";
		
    elemento.children().each(function() {
		var atributos = objatributos(this);        
        var uValor="";
        var uMyObj=elemento;

		if (atributos[0].id!==""){
			var txtValor = $("[id='"+atributos[0].id+"']");
		}else{
			var txtValor = $("[name='"+atributos[0].name+"']");			
		}		
	
		uMyObj = txtValor;
		
		switch(atributos[0].tipo.trim().toUpperCase()) {
			 case "CHECKBOX":
				uValor = txtValor.is(':checked');
				break;
			 case "L":
				uValor = txtValor.is(':checked');
				break;
			 case "D":
				try{
					var dateObject = txtValor.datepicker("getDate");
					var dateString = dateObject.getFullYear().toString() + PADL((dateObject.getMonth() + 1).toString(),2,"0") + PADL(dateObject.getDate().toString(),2,"0");
					uValor = dateString.toString();							
				}catch(e){
					uValor="";
				}
				break;
			 default:
				uValor = txtValor.val(); 
		 } 		
		 
        if ((atributos[0].campo!=="") && (atributos[0].tabela!=="")){
			
			if ((uValor!=="") && (uValor!==null) && (uValor!==undefined)){
				if (atributos[0].classe.trim().toUpperCase()==="CHKFILTRO"){
					if (uValor===true){
						uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = 1";
					}else{
						uMeusFiltros = "";
					}   
				}else{
					if (atributos[0].classe.trim().toUpperCase()==="CMBFILTRO"){
						if (uValor.toString().trim()!=="-1"){
							if (atributos[0].tipo==="N"){									
								uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = " + uValor;							
							}else{
								uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " like '%" + uValor + "%'";							
							}							
						}else{
							uMeusFiltros = "";
						}   
					}else{
						if (atributos[0].classe.trim().toUpperCase()==="CHKINVFILTRO"){
							if (uValor===true){
								uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = 0";
							}else{
								uMeusFiltros = "";
							}   
						}else{
							if (atributos[0].classe.trim().toUpperCase()==="DATFILTRO"){
								uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = '" + uValor + "'";
							}else{
								if (atributos[0].classe.trim().toUpperCase()==="DATINIFILTRO"){
									uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " between '" + uValor + "'#INI";
								}else{
									if (atributos[0].classe.trim().toUpperCase()==="DATFIMFILTRO"){
										if (uFiltros.length !== 0){
											var encontrou = false;
											for (i=0;i<uFiltros.length;i++){
												if (uFiltros[i].indexOf("#INI")!==-1){
													uFiltros[i] = uFiltros[i].replace("#INI"," and '" +uValor+ "'")
													encontrou = true;
												};
											}
											if (encontrou===false){
												alertify.error("Deve escolher Data de inicio!!")
											}
										}							
									}else{
										if (atributos[0].tipo==="N"){									
											if (uValor!==null){								
												uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " = " + uValor;							
											}else{
												uMeusFiltros = "";																
											}
										}else{
											if (uValor!==null){								
												uMeusFiltros = " and " + atributos[0].tabela + "." + atributos[0].campo + " like '%" + uValor + "%'";							
											}else{
												uMeusFiltros = "";																
											}
										}
									}						
								}
							}
						}
					}
				}	
			}
			
			if (atributos[0].classe.trim().toUpperCase()!=="DATFIMFILTRO"){
				uFiltros.push(uMeusFiltros); 
					
				var date = new Date();
				date.setTime(date.getTime() + (pub_mnCookiesLogin * 60 * 1000));
				
				var valor=$(uMyObj).val();
				if ((atributos[0].classe.trim().toUpperCase()==="CHKFILTRO") || (atributos[0].classe.trim().toUpperCase()==="CHKINVFILTRO")){						
					if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
						if (uValor===true){
							jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,"True"); 							
						}else{
							jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,"False"); 														
						}				
					}else{
						if ((atributos[0].name!==undefined) && (atributos[0].name!=="") && (uValor===true)){
							jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].name,"True"); 							
						}else{
							jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,"False"); 														
						}									
					}
				}else{
					if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
						if (valor!==undefined){
							jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,valor); 								
						}				
					}else{
						if ((atributos[0].name!==undefined) && (atributos[0].name!=="") && (valor!==undefined)){
							jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].name,valor); 							
						}									
					}
				}	
			}
			
        }
		 
		if ((atributos[0].campo==="") && (atributos[0].tabela==="") && (atributos[0].classe.trim().toUpperCase()==="CMBFILTRO")){
			if ((uValor.toString().trim()!=="-1") && (uValor.toString().trim()!=="")){
				uMeusFiltros = " and " + uValor;							
			}else{
				uMeusFiltros = "";
			} 
			
			uFiltros.push(uMeusFiltros);  

			var date = new Date();
			date.setTime(date.getTime() + (pub_mnCookiesLogin * 60 * 1000));
			
			var valor=$(uMyObj).val();
			if ((atributos[0].classe.trim().toUpperCase()==="CHKFILTRO") || (atributos[0].classe.trim().toUpperCase()==="CHKINVFILTRO")){						
				if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
					if (uValor===true){
						jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,"True"); 							
					}else{
						jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,"False"); 														
					}				
				}else{
					if ((atributos[0].name!==undefined) && (atributos[0].name!=="") && (uValor===true)){
						jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].name,"True"); 							
					}else{
						jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,"False"); 														
					}									
				}
			}else{
				if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
					if (valor!==undefined){
						jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].id,valor); 								
					}				
				}else{
					if ((atributos[0].name!==undefined) && (atributos[0].name!=="") && (valor!==undefined)){
						jQuery.cookie(pub_nomeapp + "_" + name + "_" + atributos[0].name,valor); 							
					}									
				}
			}				
		}
		
        CorrerFlts($(this),name);
    });    
}


//###########################################
//Funções com objectos
//###########################################

// Função que devolve String, para guardar os dados de tabelas html
function StrSaveTable(tabela,bdtabela){
	
	var uInsert = false;
    var uString = "";
    var uAuxString = "";
    var uCampoStamp = "";
    var uValorStamp = "";
	tabela.find('tr').each(function (rowIndex, r) {
		if (rowIndex!==0){
            var campos = [];
            var valores = [];            

            $(this).find('th,td').each(function (colIndex, c) {
				var uObj = "";
				var uCampo = "";
				var uTipo = "";
				var uValor = "";
				var uTabela = "";
				var uHtml = $(this).html();
				//console.log(uHtml);				
				var res = uHtml.split('"');
				for (i=0;i<res.length;i++){
					if (i>0){
						if(res[i-1].search("data-campo=")>0){
							uCampo = res[i];                    
						}
						if(res[i-1].search("data-tipo=")>0){
							uTipo = res[i];                    
						}                       
						if(res[i-1].search("data-tabela=")>0){
							uTabela = res[i];                    
						}
						if(res[i-1].search("name=")>0){
							uObj = res[i];    
						}						
					}
				}
				var uMObj=$("[name='"+uObj+"']");
				switch(uTipo.trim().toUpperCase()) {
					 case "CHECKBOX":
						uValor = uMObj.is(':checked');	
						if (uValor.toString().toLowerCase()==="true"){
							uValor = "1";
						}else{
							uValor = "0";
						}	
						break;
					 case "L":
						uValor = uMObj.is(':checked');	
						if (uValor.toString().toLowerCase()==="true"){
							uValor = "1";
						}else{
							uValor = "0";
						}	
						break;
					 case "N":
						uValor = uMObj.val();	
						if (uValor === "")
							uValor = "0";
						break;
					 case "I":
						uValor = uMObj.val();							
						if (uValor === "")
							uValor = "0";
						break;
					 default:
						uValor = uMObj.val();
						if (uValor!==undefined && uValor!=="")
							uValor = uValor.replace(/'/g,"''");
						uValor = "'"+uValor+"'"; 						
				} 
				
				if ((uCampo!=="") && (uTabela.toString().toUpperCase()===bdtabela.toString().toUpperCase())){
					if(uCampo.toString().toUpperCase()===bdtabela.toString().toUpperCase()+"STAMP"){
						if ((uValor.toString()!=="") && (uValor.toString()!=="''")){
							uInsert = false;
							uCampoStamp = uCampo;   
							uValorStamp = uValor;
						}else{
							uInsert = true; 
							uCampo="";
						}                          
					}
					if (uCampo!==""){
						//console.log("Campo "+uCampo);
						//console.log("Valor "+uValor);
						campos.push(uCampo);     
						valores.push(uValor);                                   	
					}					
				}
            });
            if (campos.length !== 0){
                if (uInsert === true){
                    uAuxString = "insert into " + bdtabela + "(" +bdtabela.toLowerCase().replace("w_","")+"stamp,";
                    for (i=0;i<campos.length;i++){
                        if (i===0){
                            uAuxString = uAuxString + campos[i];                    
                        }else{
                            uAuxString = uAuxString + "," + campos[i];                    
                        }
                    }
                    uAuxString = uAuxString + ") values('"+u_Stamp()+"',";
                    for (i=0;i<valores.length;i++){
                        if (i===0){
                            uAuxString = uAuxString + valores[i];                    
                        }else{
                            uAuxString = uAuxString + "," + valores[i];                    
                        }
                    }
                    uAuxString = uAuxString + ")";                
                }else{
                    uAuxString = "update " + bdtabela + " set ";
                    for (i=0;i<campos.length;i++){
                        if (i===0){
                            if (campos[i]!=="")
                                uAuxString = uAuxString + campos[i] + "=" + valores[i];                    
                        }else{
                            if (campos[i]!=="")
                                uAuxString = uAuxString + "," + campos[i] + "=" + valores[i];                    
                        }
                    }
                    uAuxString = uAuxString + " where  " + uCampoStamp + " = " + uValorStamp;
                }                
            }
        }
        if (uString === ""){
            uString = uAuxString;                                               
        }else{
            uString = uString + SepTran + uAuxString;                                                           
        }				
	});  
	return uString;
}

// Função que devolve String, para guardar os dados de tabelas html
// DESCONTINUADA
function SaveTable(tabela,bdtabela){
    var uInsert = false;
    var uString = "";
    var uAuxString = "";
    var uCampoStamp = "";
    var uValorStamp = "";
    tabela.find('tr').each(function (rowIndex, r) {
        if (rowIndex!==0){
            var campos = [];
            var valores = [];
            
            var linha = $(this).closest("[data-type]");

            $(this).find('th,td').each(function (colIndex, c) {
                var uObj = "";
                var uCampo = "";
                var uValor = "";
                var uTabela = "";
                var uHtml = $(this).html();
                var res = uHtml.split('"');
                for (i=0;i<res.length;i++){
                    if (i>0){
                        if(res[i-1].search("data-campo=")>0){
                            uCampo = res[i];                    
                        }
                        if(res[i-1].search("value=")>0){
                            uValor = res[i];
                        }                        
                        if(res[i-1].search("data-tabela=")>0){
                            uTabela = res[i];                    
                        }
                        if(res[i-1].search("name=")>0){
                            uObj = res[i];    
                        }
                    }
                }    
                if ((uCampo!=="") && (uObj!=="") && (uTabela.toString().toUpperCase()===bdtabela.toString().toUpperCase())){
                    if(uCampo.toString().toUpperCase()===bdtabela.toString().toUpperCase()+"STAMP"){
                        if (uValor.toString()!=="" ){
                            uInsert = false;
                            uCampoStamp = uCampo;   
                            var txtValor = $("[name='"+uObj+"']", linha);
                            uValor = txtValor.val();
                            uValorStamp = uValor;
                        }else{
                            uInsert = true; 
                            uCampo="";
                        }                          
                    }
                    if ((uCampo!=="") && (uObj!=="")){
                        campos.push(uCampo);     
                        var txtValor = $("[name='"+uObj+"']", linha);
                        uValor = txtValor.val();
                        valores.push(uValor);                                   
                    }                    
                }
            });
            if (campos.length !== 0){
                if (uInsert === true){
                    uAuxString = "insert into " + bdtabela + "(" +bdtabela.toLowerCase().replace("w_","")+"stamp,";
                    for (i=0;i<campos.length;i++){
                        if (i===0){
                            uAuxString = uAuxString + campos[i];                    
                        }else{
                            uAuxString = uAuxString + "," + campos[i];                    
                        }
                    }
                    uAuxString = uAuxString + ") values(left(newid(),25),";
                    for (i=0;i<valores.length;i++){
                        if (i===0){
                            uAuxString = uAuxString + "'" + valores[i];                    
                        }else{
                            uAuxString = uAuxString + "','" + valores[i];                    
                        }
                    }
                    uAuxString = uAuxString + "')";                
                }else{
                    uAuxString = "update " + bdtabela + " set ";
                    for (i=0;i<campos.length;i++){
                        if (i===0){
                            if (campos[i]!=="")
                                uAuxString = uAuxString + campos[i] + "='" + valores[i] + "'";                    
                        }else{
                            if (campos[i]!=="")
                                uAuxString = uAuxString + "," + campos[i] + "='" + valores[i] + "'";                    
                        }
                    }
                    uAuxString = uAuxString + " where  " + uCampoStamp + " = '" + uValorStamp + "'";
                }                
            }
        }
        if (uString === ""){
            uString = uAuxString;                                               
        }else{
            uString = uString + SepTran + uAuxString;                                                           
        }
    });    
    return uString;
}


// Função que valida index do stamp da tabela
function ValidaIndexStamp(tabela,bdtabela){

    var uIndex = 0;
	console.log("tabela -> " + tabela);
    tabela.find('tr').each(function (rowIndex, r) {
        if (rowIndex!==0){
            $(this).find('th,td').each(function (colIndex, c) {
                var campo = $(this).attr('data-campo');
				console.log("Campo -> "+campo);
				if (campo!==undefined){
					if (campo.toString().toLowerCase()===bdtabela.toString().toLowerCase()+"stamp") {
						uIndex=colIndex;
						//console.log(uIndex);
						return uIndex;
					}
				}
            });
        }
    });    
    return uIndex;
}


// Função que valida estrutura de um Json
function CamposJson(json){
    for(var numReg in json){         
        for (var prop in json[numReg]) {
            if (json[numReg].hasOwnProperty(prop)) {
                var uCampo = prop;            
                var valor=eval('json[numReg].' + uCampo) ;
            }
        }
    }    
}    

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Função que devolve String, para guardar os dados de um Json
function SaveJson(json,tabela){
    
    var uInsert = false;
    var uCampoStamp = "";
    var uAuxString = "";
    var uStringFinal = "";
	var uValorStamp = "";
   
    for(var numReg in json){ 
        uInsert=false;
        campos = [];
        valores = [];    
        uAuxString = "";
        for (var prop in json[numReg]) {
			valor = "";
            if (json[numReg].hasOwnProperty(prop)) {
                var uCampo = prop;            
                var valor=eval('json[numReg].' + uCampo);
				if (isNumber(valor)!==true){
					if ((valor!==undefined) && (valor!=="")){
						var valoraux = "";
						valoraux = valor.toString().replace(",",".");
						if (isNumber(valoraux)===true){
							valor = valoraux;
						}					
					}					
				}					

                if(uCampo.toString().toLowerCase()===tabela.toString().toLowerCase().replace("w_","")+"stamp"){
					if (valor!==undefined){
						if (valor.toString()!==""){
							uInsert = false;
							uCampoStamp = uCampo;   
							uValorStamp = valor;
						}else{
							uInsert = true; 
							uCampo="";
						}						
					}else{
                        uInsert = true; 
                        uCampo="";						
					}
                }

                if ((uCampo!=="") && (uCampo!==uCampoStamp)) {
                    campos.push(uCampo);     
                    valores.push(valor);                                   
                }                    
            }            
        }

        if (campos.length !== 0){
            if (uInsert === true){
                uAuxString = "insert into " + tabela + "(" +tabela.toLowerCase().replace("w_","")+"stamp,";
                for (i=0;i<campos.length;i++){
                    if (i===0){
                        uAuxString = uAuxString + campos[i];                    
                    }else{
                        uAuxString = uAuxString + "," + campos[i];                    
                    }
                }
                uAuxString = uAuxString + ") values('"+u_Stamp()+"',";
                for (i=0;i<valores.length;i++){
                    if (i===0){
                        uAuxString = uAuxString + "'" + valores[i];                    
                    }else{
                        uAuxString = uAuxString + "','" + valores[i];                    
                    }
                }
                uAuxString = uAuxString + "')";                
            }else{
                uAuxString = "update " + tabela + " set ";
                for (i=0;i<campos.length;i++){
                    if (i===0){
                        if (campos[i]!=="")
                            uAuxString = uAuxString + campos[i] + "='" + valores[i] + "'";                    
                    }else{
                        if (campos[i]!=="")
                            uAuxString = uAuxString + "," + campos[i] + "='" + valores[i] + "'";                    
                    }
                }
                uAuxString = uAuxString + " where  " + uCampoStamp + " = '" + uValorStamp + "'";
            }                
        }
        if (uStringFinal.length === 0) {
            uStringFinal = uAuxString;           
        }else{
            uStringFinal = uStringFinal + SepTran + uAuxString;                        
        }
    }
    return uStringFinal;
}    

// Função para fazer guardar registo em tabela
// Vai percorrer todos os elementos filhos do elemento atribuido
function StrGuardarElementos(elemento,bdtabela,_Novo,Stamp,callback){

    var uParaInserir = false;
    var uCampoStampGr = "";
    var uValorStampGr = "";
    uCamposGr = [];
    uValoresGr = [];
    
    if (_Novo===true){
        uParaInserir = true;
    }else{
        uParaInserir = false;
        uCampoStampGr = bdtabela.toLowerCase().replace("w_","")+"stamp";
        uValorStampGr = Stamp;        
    }
    
    var uAuxString = "";
    
    StrPercorreElementos(elemento,bdtabela);
		  //console.log(uCamposGr.length);
		if (uCamposGr.length !== 0){
			if (uParaInserir === true){
				uAuxString = "insert into " + bdtabela + "(" +bdtabela.toLowerCase().replace("w_","")+"stamp,";
				for (i=0;i<uCamposGr.length;i++){
					if (i===0){
						uAuxString = uAuxString + uCamposGr[i];                    
					}else{
						uAuxString = uAuxString + "," + uCamposGr[i];                    
					}
				}
				uAuxString = uAuxString + ") values('" + Stamp + "',";
				for (i=0;i<uValoresGr.length;i++){
					uValor = uValoresGr[i];
					if ((uValor!==undefined) & (uValor!==null)){
						//uValor = uValor.replace(/'/g,"''");						
						uValor = uValor.replace(/"/g,"&#0034;").replace(/'/g,"&#0039;");												
					}else{
						uValor = "";  						
					}
					if (i===0){
						uAuxString = uAuxString + "'" + uValor;                    
					}else{
						uAuxString = uAuxString + "','" + uValor;                    
					}
				}
				uAuxString = uAuxString + "')";                
			}else{
				uAuxString = "update " + bdtabela + " set ";
				for (i=0;i<uCamposGr.length;i++){
					uValor = uValoresGr[i];
					if ((uValor!==undefined) & (uValor!==null)){
						//uValor = uValor.replace(/'/g,"''");						
						uValor = uValor.replace(/"/g,"&#0034;").replace(/'/g,"&#0039;");												
						//console.log(uValor);						
					}else{
						uValor = "";  						
					}
					if (i===0){
						if (uCamposGr[i]!=="")
							uAuxString = uAuxString + uCamposGr[i] + "='" + uValor + "'";                    
					}else{
						if (uCamposGr[i]!=="")
							uAuxString = uAuxString + "," + uCamposGr[i] + "='" + uValor + "'";                    
					}
				}
				uAuxString = uAuxString + " where  " + uCampoStampGr + " = '" + uValorStampGr + "'";
			}                
		}    
	//console.log(uAuxString);
    callback(uAuxString);  
}



// Função para fazer renderização dos elementos e dos filhos
// Só faz para os elementos div e cujo atributo data-render == true
function StrPercorreElementos(elemento,bdtabela){

    //console.log("localName: "+this.localName);
    elemento.children().each(function() {
		var atributos = objatributos(this); 
		var txtValor="";
        var uValor="";                

		if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
			txtValor = $("[id='"+atributos[0].id+"']");
		}else{
			txtValor = $("[name='"+atributos[0].name+"']");			
		}
		switch(atributos[0].tipo.trim().toUpperCase()) {
			 case "CHECKBOX":
				uValor = txtValor.is(':checked');
				break;
			 case "L":
				uValor = txtValor.is(':checked');
				break;
			 case "D":
				var uDataVal = txtValor.val().toString().trim();
				if (uDataVal.indexOf("/") !== -1){
					try{
						var dateObject = txtValor.datepicker("getDate");
						var dateString = dateObject.getFullYear().toString() + PADL((dateObject.getMonth() + 1).toString(),2,"0") + PADL(dateObject.getDate().toString(),2,"0");
						uValor = dateString.toString();					
					}catch(e){
						uValor="19000101";
					}						
				}else{
					uValor = uDataVal.substring(6, 10)+uDataVal.substring(3, 5)+uDataVal.substring(0, 2);
				}				
				break;
			case "N":
				uValor = txtValor.val();
				uValor = uValor.replace(",",".");					
				break;
			 case "I":
				uValor = txtValor.val();
				uValor = uValor.replace(",",".");					
				break;				
			 default:
				uValor = txtValor.val(); 
		 } 
		 
        if ((atributos[0].campo!=="") && (atributos[0].tabela.toString().toUpperCase()===bdtabela.toString().toUpperCase())){
			//console.log(atributos[0].campo.trim().toLowerCase());
            if ((atributos[0].campo!=="") & (atributos[0].campo.trim().toLowerCase()!=="na_bdados")){
                uCamposGr.push(atributos[0].campo);     
                if ((atributos[0].tipo.toUpperCase()==="CHECKBOX") || (atributos[0].tipo.toUpperCase()==="L")) {
                    if (uValor===true){
                        uValoresGr.push("1");                                                                               
                    }else{
                        uValoresGr.push("0");                                                                                                       
                    }                    
                }else{
                    uValoresGr.push(uValor);                                                       
                }
            }                    
        }

		StrPercorreElementos($(this),bdtabela);
    });  
}


function DataValueElemento(elementopai,campo,callback){
	var atrrcampo = elementopai.attr("data-campo");
	var Valor="";
		
	if ((atrrcampo!==undefined) && (atrrcampo!=="") && (atrrcampo===campo)){
		Valor = elementopai.attr("data-value");
		callback(Valor);
	}else{		
		elementopai.children().each(function() {
			atrrcampo = $(this).attr("data-campo"); 
			Valor="";
			
			if ((atrrcampo!==undefined) && (atrrcampo!=="") && (atrrcampo===campo)){
				Valor = $(this).attr("data-value");
				callback(Valor);
			}else{
				DataValueElemento($(this),campo,function(valor){
					callback(valor);
				});			
			}
		});  
	}
}

function FindElement(elementopai,campo,callback){
	var atrrcampo = elementopai.attr("data-campo");
		
	if ((atrrcampo!==undefined) && (atrrcampo!=="") && (atrrcampo===campo)){
		callback(elementopai);
	}else{		
		elementopai.children().each(function() {
			atrrcampo = $(this).attr("data-campo"); 			
			if ((atrrcampo!==undefined) && (atrrcampo!=="") && (atrrcampo===campo)){
				callback($(this));
			}else{
				DataValueElemento($(this),campo,function(elemento){
					callback(elemento);
				});			
			}
		});  
	}
}

function ValorElemento(elementopai,campo,callback){
	var atrrcampo = elementopai.attr("data-campo");
	var Valor="";
		
	if ((atrrcampo!==undefined) && (atrrcampo!=="") && (atrrcampo===campo)){
		Valor = elementopai.text();
		callback(Valor);
	}else{		
		elementopai.children().each(function() {
			atrrcampo = $(this).attr("data-campo"); 
			Valor="";
			
			if ((atrrcampo!==undefined) && (atrrcampo!=="") && (atrrcampo===campo)){
				Valor = $(this).val();
				callback(Valor);
			}else{
				ValorElemento($(this),campo,function(valor){
					callback(valor);
				});			
			}
		});  
	}
}

function AjustaTabela(idtabela){

	var tabela = jQuery('#'+idtabela).dataTable();
		
	var newContentContainerWidth = getContentContainerWidth()+30;
	
	tabela.parent().siblings('.dataTables_scrollHead').width(newContentContainerWidth + 'px');
	tabela.parent().siblings('.dataTables_scrollHead').next('.dataTables_scrollBody').width(newContentContainerWidth + 'px');
  
	tabela.fnAdjustColumnSizing(true);
}
		
// Função para guardar variaveis de ecran em storage
function GuardarVariaveisLocalStorage(ecran,tabela,callback){
	var storage=jQuery.localStorage;
	var valor = eval("_"+tabela+"Edicao")
	storage.set(ecran.trim()+'_Edicao',valor.toString().trim())
	valor = eval("_"+tabela+"Novo")
	storage.set(ecran.trim()+'_Novo',valor.toString().trim())
	valor = eval("_"+tabela+"Alterar")
	storage.set(ecran.trim()+'_Alterar',valor.toString().trim())
	valor = eval("_"+tabela+"Criar")
	storage.set(ecran.trim()+'_Criar',valor.toString().trim())
	valor = eval("_"+tabela+"Apagar")
	storage.set(ecran.trim()+'_Apagar',valor.toString().trim())
	valor = eval("_"+tabela+"Stamp")
	storage.set(ecran.trim()+'_Stamp',valor.toString().trim())
	valor = eval("_"+tabela+"_Bdados")
	storage.set(ecran.trim()+'_Bdados',valor.toString().trim())
	valor = eval("_"+tabela+"RegNum")
	storage.set(ecran.trim()+'_RegNum',valor.toString().trim())
	callback("");
}


// Função para ler variaveis de ecran do storage
function RetornaVariaveisLocalStorage(ecran,tabela,callback){
	var storage=jQuery.localStorage;
	var valor = "";
	valor = storage.get(ecran.trim()+'_Edicao');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"Edicao = "+valor.toString().trim()+";" );
	}
	valor = storage.get(ecran.trim()+'_Novo');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"Novo = "+valor.toString().trim()+";" );
	}
	valor = storage.get(ecran.trim()+'_Alterar');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"Alterar = "+valor.toString().trim()+";" );
	}
	valor = storage.get(ecran.trim()+'_Criar');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"Criar = "+valor.toString().trim()+";" );
	}
	valor = storage.get(ecran.trim()+'_Apagar');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"Apagar = "+valor.toString().trim()+";" );
	}
	valor = storage.get(ecran.trim()+'_Stamp');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"Stamp = '"+valor.toString().trim()+"';" );		
	}
	valor = storage.get(ecran.trim()+'_Bdados');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"_Bdados = '"+valor.toString().trim()+"';" );
	}
	valor = storage.get(ecran.trim()+'_RegNum');
	if ((valor!==undefined) && (valor!=="") && (valor!==null)){
		jQuery.globalEval( "_"+tabela.trim()+"RegNum = "+valor.toString().trim()+";" );		
	}
	callback("");
}

function LimpaLocalStorage(ecran,callback){
	var storage = localStorage;
	var keys = [];
	var exceptions = [].concat(exceptions); //prevent undefined

	//get storage keys
	jQuery.each(localStorage, function(key, val){
		keys.push(key);
	});

	//loop through keys
	for( i=0; i<keys.length; i++ ){
		var key = keys[i];
		var deleteItem = false;

		if( key.trim().toUpperCase().indexOf(ecran.trim().toUpperCase()) === 0 ){
			deleteItem = true;
		}

		//delete key
		if( deleteItem ){
			localStorage.removeItem(key);
		}
	}
	callback("");
}

// Função para carregar registo da storage
// Vai percorrer todos os elementos filhos do elemento atribuido
function CarregaElementosLocalStorage(elemento,ecran,comtabela,callback){

    var uParaInserir = false;
    var uCampoStampGr = "";
    var uValorStampGr = "";    
	uCamposGr = [];
    uValoresGr = [];
	uObjGr = [];
    
    var uAuxString = "";
    var valor = "";
    var campo = "";
    var uObj = "";
    
    PercorreElementosLocalStorage(elemento,ecran);
		if (uObjGr.length !== 0){			
			var storage=jQuery.localStorage;
			for (nAux=0;nAux<uObjGr.length;nAux++){
				if (uTiposGr[nAux].trim()==="YESTABLE"){
					if (comtabela===true){
						jsonAux = [];
						var tabela = storage.get(ecran.trim()+'_'+uObjGr[nAux].trim()+'_tb');
						if ((tabela!==undefined) & (tabela!==null)){
							jsonAux = storage.get(ecran.trim()+'_'+uObjGr[nAux].trim()+'_dados');		
							valor = jQuery.globalEval( tabela+"=[];" );					
							for(var numAux in jsonAux){ 
								valor = jQuery.globalEval( tabela+".push(jsonAux[numAux]);" );					
							}
							console.log("CarregaElementosLocalStorage");
							valor = jQuery.globalEval("jsCarregaGrelhas_"+ecran+"(jsonAux,true,function(){});");																	
						}						
					}
				}else{
					uValor = uObjGr[nAux];
					campo = uCamposGr[nAux];
					if ((uValor!==undefined) & (uValor!==null)){
						valor = storage.get(ecran.trim()+'_'+uObjGr[nAux].trim())
						if ((valor!==undefined) && (valor!==null) && (valor!=="")){
							uObj = $(uObjGr[nAux].trim());
							if (uTiposGr[nAux].trim()==="L") {						
								jQuery.globalEval( ecran+"[0]."+campo+"="+valor+";" );					
								if (valor.toString().toUpperCase()==="TRUE"){
									uObj.prop('checked', true);
								}else{
									uObj.prop('checked', false);
								}	
							}else{
								if	((uTiposGr[nAux].trim()==="N") || (uTiposGr[nAux].trim()==="I")){
									jQuery.globalEval( ecran+"[0]."+campo+"="+valor+";" );													
								}else{
									jQuery.globalEval( ecran+"[0]."+campo+"='"+valor+"';" );																					
								}
								uObj.val(valor);
							}	
						}
					}
				}	
			}            
		}    
    callback(uAuxString);  
}


// Função para carregar registo da storage
// Vai percorrer todos os elementos filhos do elemento atribuido
function CarregaDatatableLocalStorage(mDatatable,ecran,callback){

    var jsLinhasAux=[];
	var jsLinhas = storage.get(ecran.trim()+'_'+mDatatable.toString().trim()+'_Datatable')
	
	if ((jsLinhas!=="") && (jsLinhas!==undefined) && (jsLinhas!==null)){	
		for ( var i = 0; i < jsLinhas.length; i++) {
			jsLinhasAux.push(jsLinhas[i]);		
		}
	}

	CarregaDataTable_lst_w_bo(jsLinhasAux,function(){callback("");});	
      
}

// Função para guardar registo em storage
// Vai percorrer todos os elementos filhos do elemento atribuido
function GuardarElementosLocalStorage(elemento,ecran,comtabela,callback){

    var uParaInserir = false;
    var uCampoStampGr = "";
    var uValorStampGr = "";
    uCamposGr = [];
	uObjGr = [];
    uValoresGr = [];
    uTiposGr = [];
    
    var uAuxString = "";
    PercorreElementosLocalStorage(elemento,ecran);
	if (uObjGr.length !== 0){			
		var storage=jQuery.localStorage
		for (i=0;i<uObjGr.length;i++){
			if (uTiposGr[i].trim()==="YESTABLE"){
				if (comtabela===true){
					uValorStampGr = uCamposGr[i];	
					var jsLinhas = eval(uValorStampGr);
					var strLinhas = JSON.stringify(jsLinhas);
					console.log("GuardarElementosLocalStorage - strLinhas - comtabela");
					console.log(strLinhas);
					if ((strLinhas!==undefined) && (strLinhas!==null) && (strLinhas!=="")){							
						storage.set(ecran.trim()+'_'+uObjGr[i].trim()+'_dados',strLinhas);
						storage.set(ecran.trim()+'_'+uObjGr[i].trim()+'_tb',uValorStampGr.trim());
					}				
				}
			}else{
				uValor = uValoresGr[i];				
				if ((uValor!==undefined) & (uValor!==null)){					
					storage.set(ecran.trim()+'_'+uObjGr[i].trim(),uValoresGr[i].trim())
				}				
			}
		}            
	}    
    callback(uAuxString);  
}



// Função para fazer renderização dos elementos e dos filhos
// Só faz para os elementos div e cujo atributo data-render == true
function PercorreElementosLocalStorage(elemento,ecran){

    //console.log("localName: "+this.localName);
    elemento.children().each(function() {
		var atributos = objatributos(this); 
		var txtValor="";
        var uValor="";                

		if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
			txtValor = $("[id='"+atributos[0].id+"']");
		}else{
			txtValor = $("[name='"+atributos[0].name+"']");			
		}
		switch(atributos[0].tipo.trim().toUpperCase()) {
			 case "CHECKBOX":
				uValor = txtValor.is(':checked');
				break;
			 case "L":
				uValor = txtValor.is(':checked');
				break;
			 case "D":
				var uDataVal = txtValor.val().toString().trim();
				if (uDataVal.indexOf("/") !== -1){
					try{
						var dateObject = txtValor.datepicker("getDate");
						var dateString = PADL(dateObject.getDate().toString(),2,"0") + "/" + PADL((dateObject.getMonth() + 1).toString(),2,"0") + "/" + dateObject.getFullYear().toString();
						uValor = dateString.toString();					
					}catch(e){
						uValor="01/01/1900";
					}						
				}else{
					uValor = uDataVal;
				}				
				break;
			case "N":
				uValor = txtValor.val();
				uValor = uValor.replace(",",".");					
				break;
			 case "I":
				uValor = txtValor.val();
				uValor = uValor.replace(",",".");					
				break;				
			 default:
				uValor = txtValor.val(); 
		 } 
		 
        if (atributos[0].campo!==""){
			//console.log(atributos[0].campo.trim().toLowerCase());
            if (atributos[0].campo!==""){
				uTiposGr.push(atributos[0].tipo.trim().toUpperCase());     
				uCamposGr.push(atributos[0].campo);  					
				if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
					uObjGr.push("[id='"+atributos[0].id+"']");  
				}else{
					uObjGr.push("[name='"+atributos[0].name+"']");     
				}
                if ((atributos[0].tipo.toUpperCase()==="CHECKBOX") || (atributos[0].tipo.toUpperCase()==="L")) {
                    if (uValor===true){
                        uValoresGr.push("true");                                                                               
                    }else{
                        uValoresGr.push("false");                                                                                                       
                    }                    
                }else{
                    uValoresGr.push(uValor);                                                       
                }
            }                    
        }
		if (atributos[0].classe.trim().toUpperCase()==="YESTABLE"){
			uTiposGr.push(atributos[0].classe.trim().toUpperCase());     
			uCamposGr.push(atributos[0].tabela);  					
			if ((atributos[0].id!==undefined) && (atributos[0].id!=="")){
				uObjGr.push("[id='"+atributos[0].id+"']");  
			}else{
				uObjGr.push("[name='"+atributos[0].name+"']");     
			}			
            uValoresGr.push("");                                                                                                       
		}
		PercorreElementosLocalStorage($(this),ecran);
    });  
}


// Função para devolver a String (uString) com o tamanho definido (uTamanho), aumentando a esquerda com o caracter (uStrSubst)
function PADL(uString,uTamanho,uStrSubst){
    
	var uTamStr = uString.toString().trim().length;
	if (uTamStr<uTamanho){
		for (i=uTamStr; i < uTamanho; i++){
			uString = uStrSubst.slice(0,1) + uString;
		}
	}

	return uString
}


// Função para devolver a String (uString) com o tamanho definido (uTamanho), aumentando a direita com o caracter (uStrSubst)
function PADR(uString,uTamanho,uStrSubst){
    
	var uTamStr = uString.toString().trim().length;
	if (uTamStr<uTamanho){
		for (i=uTamStr; i < uTamanho; i++){
			uString = uString + uStrSubst.slice(0,1);
		}
	}

	return uString
}



// Função para fazer guardar registo em tabela
// Vai percorrer todos os elementos filhos do elemento atribuido
function ValidaGuardarElementos(elemento,bdtabela,callback){
    
    var uPodeGravar = true;
    
    PodeGravar = true;
    
    ValidaElementos(elemento,bdtabela);

    uPodeGravar = PodeGravar;
    
    callback(uPodeGravar);
}



// Função para fazer renderização dos elementos e dos filhos
// Só faz para os elementos div e cujo atributo data-render == true
function ValidaElementos(elemento,bdtabela){

    //console.log("localName: "+this.localName);
    elemento.children().each(function() {
        var uValor="";
        var uTabela="";
        var uCampo="";
        var uTipo="";
        var uDescricao="";
        var uObrigatorio=false;
        var uName="";
        var uId="";
                    
        for (var i = 0; i < this.attributes.length; i++) {            
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-TIPO"){
                uTipo = this.attributes[i].nodeValue;
                //console.log("Tipo: "+uTipo);
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-CAMPO"){
                uCampo = this.attributes[i].nodeValue;
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-TABELA"){
                uTabela = this.attributes[i].nodeValue;
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="NAME"){
                var uObj = this.attributes[i].nodeValue;
                var txtValor = $("[name='"+uObj+"']");
				uName=uObj;
				
				switch(uTipo.trim().toUpperCase()) {
					 case "CHECKBOX":
						uValor = txtValor.is(':checked');
						break;
					 case "D":
						try{
							var dateObject = txtValor.datepicker("getDate");
							var dateString = dateObject.getFullYear().toString() + PADL((dateObject.getMonth() + 1).toString(),2,"0") + PADL(dateObject.getDate().toString(),2,"0");
							uValor = dateString.toString();
						}
						catch(err){
							uValor = "";						
						}	
						break;
					 case "N":
						uValor = txtValor.val();
						uValor = uValor.replace(",",".");		
						break;
					 case "I":
						uValor = txtValor.val();
						uValor = uValor.replace(",",".");					
						break;
					default:
						uValor = txtValor.val(); 
				 } 
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="ID"){
                var uObj = this.attributes[i].nodeValue;
                var txtValor = $("[id='"+uObj+"']");
				uId=uObj;

				switch(uTipo.trim().toUpperCase()) {
					 case "CHECKBOX":
						uValor = txtValor.is(':checked');
						break;
					 case "D":
						try{
							var dateObject = txtValor.datepicker("getDate");
							var dateString = dateObject.getFullYear().toString() + PADL((dateObject.getMonth() + 1).toString(),2,"0") + PADL(dateObject.getDate().toString(),2,"0");
							uValor = dateString.toString();
						}
						catch(err){
							uValor = "";
						}	
						break;
					 case "N":
						uValor = txtValor.val();
						uValor = uValor.replace(",",".");						
						break;
					 case "I":
						uValor = txtValor.val();
						uValor = uValor.replace(",",".");						
						break;
					 default:
						uValor = txtValor.val(); 
				 } 
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="PLACEHOLDER"){
                uDescricao = this.attributes[i].nodeValue;
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-OBRIGATORIO"){
                uObrigatorio = this.attributes[i].nodeValue;
            }
        }
        //console.log("O tipo: "+uTipo);
        //console.log("O valor: "+uValor);
        //console.log("O campo: "+uCampo);
        //console.log("Obrigatorio: "+uObrigatorio);
        //console.log("A tabela: "+uTabela.toString().toUpperCase());

        if ((uCampo!=="") && (uTabela.toString().toUpperCase()===bdtabela.toString().toUpperCase())){       
	   
			switch(uTipo.trim().toUpperCase()) {
				 case "CHECKBOX":
					if (uName!==""){
						var txtValor = $("[name='"+uName+"']");
					}else{
						var txtValor = $("[id='"+uId+"']");
					}
					uValor = txtValor.is(':checked');
					break;
				 case "L":
					if (uName!==""){
						var txtValor = $("[name='"+uName+"']");
					}else{
						var txtValor = $("[id='"+uId+"']");
					}

					uValor = txtValor.is(':checked');
					break;
				 case "D":
					if (uName!==""){
						var txtValor = $("[name='"+uName+"']");
					}else{
						var txtValor = $("[id='"+uId+"']");
					}

					var uDataVal = txtValor.val().toString().trim();
					if (uDataVal.indexOf("/") !== -1){
						var dateObject = txtValor.datepicker("getDate");
						var dateString = dateObject.getFullYear().toString() + PADL((dateObject.getMonth() + 1).toString(),2,"0") + PADL(dateObject.getDate().toString(),2,"0");
						uValor = dateString.toString();						
					}else{
						uValor = uDataVal.substring(6, 10)+uDataVal.substring(3, 5)+uDataVal.substring(0, 2);
					}
					break;
				 case "N":
					uValor = txtValor.val();
					uValor = uValor.replace(",",".");						
					break;
				 case "I":
					uValor = txtValor.val();
					uValor = uValor.replace(",",".");						
					break;
				 default:
					uValor = txtValor.val(); 
			 }
	
	
            if (uCampo!==""){			
				if ((uTipo.toUpperCase()==="N") && (jQuery.isNumeric(uValor)===false)){
					if (uName!==""){
						var txtValor = $("[name='"+uName+"']");
					}else{
						var txtValor = $("[id='"+uId+"']");
					}
					txtValor.val("0");
					uValor = txtValor.val();
					uValor = uValor.replace(",",".");
                }else{
					if ((uTipo.toUpperCase()==="D") && (uValor.length===0)){
						if (uName!==""){
							var txtValor = $("[name='"+uName+"']");
						}else{
							var txtValor = $("[id='"+uId+"']");
						}
						txtValor.val("01-01-1900");
						uValor = "19000101";
					}else{
						if ((uValor===undefined) || (uValor===null)){
							uValor="";
						}
					}
				}				
			}
			
            if (uCampo!==""){
			
				if ((uTipo.toUpperCase()==="N") && (jQuery.isNumeric(uValor)===false)){					
                    alertify.error("O valor do campo " + uDescricao + ", é inválido!!");
                    PodeGravar = false;
                }
                if ((uTipo.toUpperCase()==="D") && (uValor.length===0)){					
					alertify.error("O valor do campo " + uDescricao + ", é inválido!!");
                    PodeGravar = false;
                }
                if (uObrigatorio.toString().toLowerCase()==="true"){
		
                    if ((uTipo.toUpperCase()==="N") && ((uValor==="0") || (uValor===0))){                        
                        alertify.error("O campo " + uDescricao + ", não pode estar vazio!!");
                        PodeGravar = false;
                    }
                    if (uValor.length===0){
                        alertify.error("O campo " + uDescricao + ", não pode estar vazio!!");
                        PodeGravar = false;                        
                    }
                }
            }                    
        }

        ValidaElementos($(this),bdtabela);
    });    
}




// Função para fazer renderização dos elementos de uma tabela
function RenderTabela(elemento,json,linha){
    
    //console.log(elemento);
    //console.log(elemento.children().length.toString());
    elemento.children().each(function() {
		alert("1");
        var uTipo="";
        var uName="";
        var uId="";
        var uCampo="";
		var Renderiza = false;
        
        for (var i = 0; i < this.attributes.length; i++) {
			//console.log("num: "+i.toString());
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-TIPO"){
                uTipo = this.attributes[i].nodeValue;
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-CAMPO"){
                uCampo = this.attributes[i].nodeValue.toLowerCase();
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="NAME"){
                var uObj = this.attributes[i].nodeValue;
				uName=uObj;
			}
            if (this.attributes[i].nodeName.toString().toUpperCase()==="ID"){
                var uObj = this.attributes[i].nodeValue;
				uId=uObj;
			}			
        }

		if (uCampo!==""){
			if (uTipo==="L") {
				var valor=eval('json['+linha.toString()+'].' + uCampo) ;	
				if (valor!==undefined){
					if (uName!==""){
						var txtValor = $("[name='"+uName+"']");
					}else{
						var txtValor = $("[id='"+uId+"']");
					}
					if (valor.toString().toUpperCase()==="TRUE"){
						txtValor.prop('checked', true);
					}else{
						txtValor.prop('checked', false);
					}	
				}					
			}			
		}
        
        //console.log($(this));
        RenderTabela($(this),json,linha);
    });   
}


// Função para fazer renderização dos elementos e dos filhos
// Só faz para os elementos div e cujo atributo data-render == true
function RenderElementos(elemento,json){
    
    elemento.children().each(function() {
        var uTipo="";
        var uName="";
        var uId="";
        var uCampo="";
		var Renderiza = false;
        
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-TIPO"){
                uTipo = this.attributes[i].nodeValue;
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="DATA-CAMPO"){
                uCampo = this.attributes[i].nodeValue.toLowerCase();
            }
            if (this.attributes[i].nodeName.toString().toUpperCase()==="NAME"){
                var uObj = this.attributes[i].nodeValue;
				uName=uObj;
			}
            if (this.attributes[i].nodeName.toString().toUpperCase()==="ID"){
                var uObj = this.attributes[i].nodeValue;
				uId=uObj;
			}
			if ((this.attributes[i].nodeName.toString().toUpperCase()==="DATA-RENDER") 
                    && (this.attributes[i].nodeValue.toString().toUpperCase()==="TRUE")){
                Renderiza = true;   				
            }
        }

        if ((this.localName.toString().toUpperCase()==="DIV") && (Renderiza === true)){
            var uDiv = this;
            var varTmplate = jQuery(uDiv).html();
			//console.log("HTML-DIV: "+varTmplate);
			if ((varTmplate.indexOf("{{")>0) && (varTmplate.indexOf("}}")>0)){
				var Tmpl = jQuery.templates(varTmplate);
				//console.log("Tmpl: "+Tmpl);

				var uHtmlOutput = Tmpl.render(json).replace(/&#0034;/g,'"');
				//console.log("FINAL-DIV: "+uHtmlOutput);
				jQuery(uDiv).html(uHtmlOutput);
			}
        }else{
			if ((Renderiza === true) && (uCampo!=="")){
				var valor=eval('json[0].' + uCampo) ;
				if ((valor!==undefined)&&(valor!=="")){
					valor = valor; //.replace(/&#0034;/g,'"') ;
				}
				if (uName!==""){
					var txtValor = $("[name='"+uName+"']");
				}else{
					var txtValor = $("[id='"+uId+"']");
				}
				if (uTipo==="L") {						
					if (valor!==undefined){						
						if (valor.toString().toUpperCase()==="TRUE"){
							txtValor.prop('checked', true);
						}else{
							txtValor.prop('checked', false);
						}	
					}					
				}else{
					txtValor.val(valor);
				}			
			}
		}
        
        //console.log($(this));
        RenderElementos($(this),json);
    });   
}


//  Dynamically load jQuery Select2 plugin
//  homepage: https://github.com/ivaynberg/select2  v3.4.5  license - GPL2
//
function LoadSelect2Script(callback){
    if (!jQuery.fn.select2){
        jQuery.getScript('plugins/select2/select2.min.js', callback);
    }
    else {
        if (callback && typeof(callback) === "function") {
            callback();
        }
    }
}
 
//###########################################
//Funções do wait window
//###########################################

//Reset do wait window
function resetww(){
    //Vamos fazer reset dos dados do ecrã waitwindow
    $( "#wait-window-spinner" ).show();
    $( "#wait-window-info" ).show();
    $( "#wait-window-question" ).hide();
    $( "#wait-window-exclamation" ).hide();
    $( "#wait-window-warning" ).hide();
    $( "#wait-window-error" ).hide();
    $( "#wait-window-group" ).hide();
    $( "#wait-window-cancel" ).hide();
    $( "#wait-window-ok" ).hide();
    $( "#wait-window-txt").html("Aguarde por favor!!");
    $( "#wait-window-nota").html("");
}

//Reset do confirm window
function resetcw(){
    //Vamos fazer reset dos dados do ecrã waitwindow
    wwId = "";
    $( "#confirm-window-spinner" ).show();
    $( "#confirm-window-info" ).show();
    $( "#confirm-window-question" ).hide();
    $( "#confirm-window-exclamation" ).hide();
    $( "#confirm-window-warning" ).hide();
    $( "#confirm-window-error" ).hide();
    $( "#confirm-window-group" ).hide();
    $( "#confirm-window-cancel" ).hide();
    $( "#confirm-window-ok" ).hide();
    $( "#confirm-window-txt").html("Aguarde por favor!!");
    $( "#confirm-window-nota").html("");
}

//Função WaitWindow
function waitwindow(Texto){
    jQuery.blockUI({message: "<h3><i class='fa fa-spinner fa-spin'></i>  " + Texto + "</h3>"},{baseZ: 9999});
}

//Função Fecha WaitWindow
function fechawaitwindow(){
    setTimeout(jQuery.unblockUI, 20); 
    //$("[name='wait-window-ok']").trigger('click'); 
    //resetww();
}

//Função WaitWindow
function fechaconfirmwindow(){
    wwId = "";    
    $("[name='confirm-window-ok']").trigger('click'); 
}

//Função para perguntas
function pergunta(Texto,Nota,callback){
	
	var uRetorno = "";
	
	alertify.confirm('<h4><span class="fa fa-info-circle"> Confirma!!</span></h4>'
		, '<h2><span class="fa fa-question-circle"></span></h2><h5>'+Texto+'</h5><br><br><h6><span class="fa fa-newspaper-o"> Nota: '+Nota+'</span></h6>'
		, function(){ 
			uRetorno ="Sim";
			callback(true);
			}
		, function(){ 
			uRetorno ="Não";
			callback(false);			
			return true;
			}
	).setting('labels',{'ok':'Sim', 'cancel': 'Não'});
 
}


//Função para perguntas
function perguntapw(Texto,Nota,Id){

    resetcw();
    //Vamos fazer reset dos dados do ecrã waitwindow
    wwId = Id;
    $("#passw-window-spinner" ).hide();
    $("#passw-window-info" ).hide();
    $("#passw-window-group" ).show();
    $("#passw-window-cancel" ).show();
    $("#passw-window-ok" ).show();
    $("#passw-window-question").show();
    $("#passw-window-txt").html(Texto);
    $('#passw-window-nota').html(Nota);
    $("#passw-window-lanch").trigger('click');
    
}
//###########################################
// Fim Funções do wait window 
//###########################################

