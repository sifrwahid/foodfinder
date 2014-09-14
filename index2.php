<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<!--
 Create by Ryan Gerety, Social Compact, Inc.
 Copyright (c) 2008 Social compact Inc. All rights reserved.
-->

<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<title>Comida Saludable y Al Alcance de Todos: El Buscador de Comida de DC</title>
<LINK href="style.css" rel="stylesheet" type="text/css">
    
<script src="http://maps.google.com/maps/api/js?key=AIzaSyBIEERN9Hl0d99NRPsv4s8oHJm6Z_kpNts&sensor=false&libraries=geometry" type="text/javascript"></script>
<!--<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAv_1Iwa1uMBaqWA_UzLWu7RThmwWf-VoNn8i4khsurl38gAkaxBSGrtKdVhraJ7VoSHQq4UTcSShRGg" type="text/javascript"></script>-->

<script type="text/javascript">
//<![CDATA[
   find = "";
//]]>
</script>
<script src="foodfinder.js" type="text/javascript"></script>
</head>

<body onload="load()" id="body">

<div id="mainbox" style="width:960px; padding:5px;margin:10px;align:left;">
<div style="height: 40px; float: right; text-align: right; font-size: 18px;"><b>
	<a href="index.php" alt="English Translation of this Page">English</a> - <a href="index2.php" alt="Spanish Translation of this page">Espa&ntilde;ol</a>
</b></div>
  <div id="spread_the_word">
<b><u>PASE LA VOZ:</u></b>
<ul id="spreadUL">
<li>Imprima el folleto informativo en <a href="pdf/dcff_flyer.pdf">Ingles</a> y <a href="pdf/dcff_flyer_espanol.pdf">Espa&ntilde;ol</a>.</li>
<li>Imprima las <a href="pdf/DCFF_computer_cut_outs.pdf">tarjetas para el computador</a>.</li>
<li><a href="linktous.php">Con&eacute;ctese con nosotros!</a></li>
<li><a href="#" onClick="this.style.behavior='url(#default#homepage)';this.setHomePage('http://www.dcfoodfinder.org');">Convi&eacute;rtanos en su p&aacute;gina inicial</a></li>
</ul>
<script type="text/javascript" src="http://w.sharethis.com/button/sharethis.js#publisher=7fdce9a8-5f82-4840-9afc-e539baa9d0f3&amp;type=website&amp;post_services=facebook%2Cdigg%2Cdelicious%2Creddit%2Ctwitter%2Cstumbleupon%2Ctechnorati%2Cmixx%2Cblogger%2Cybuzz%2Ctypepad%2Cwordpress%2Cgoogle_bmarks%2Cwindows_live%2Cmyspace%2Cfark%2Cbus_exchange%2Cpropeller%2Cnewsvine%2Clinkedin"></script>
</div>

<table cellpadding="0" cellspacing="0" width="700">
<tr>
<td width="230"><img src="logos/DCFoodMedwWeb.jpg" width="180" align="left" 
style="margin-left:10px;"></td>
<td valign="center" width="600">
<div class="pagetitle">
Bienvenidos al Buscador de Comida de DC:<br \>
Un Mapa Interactivo con los Recursos Alimenticios de DC
</div>

<div class="subtitle">Un Proyecto de <a href="about.html" target="_blank">Comida Saludable y Al Alcance de Todos</a></div>

<div class="getstarted">Comience ahora:</div>
<div class="getstarted_help">
* Simplemente marque la cajita junto al recurso que esta buscando y escriba su direccion en la barra buscadora. 
</div>
</td>
<td>
</td>
</tr>
</table>

<br \>

<div style="margin-left:20px;margin-top:0px;margin-bottom:10px;" id="mapsection">
<table cellpadding="0" cellspacing="0" border="0" width="950"><tr>
<td width="220">
    <table cellpadding=0 cellspacing=0 width="220"><tr>
    <td width="40"><img src="one.png" width="30"></td>
    <td style="font-weight:bold;" nowrap>Seleccione los recursos</td>
    </tr></table>
</td>
<td width="400">
    <form onsubmit="adjust(this.origin_address.value);return false;" class="enter_address">

    <table cellpadding="0" cellspacing="0"><tr>
    <td width="40">
    <img src="two.png" width="30">
    </td>
    <td>
    <div style="font-weight:bold;font-size:12px;">Ingrese una direccion para encontrar las opciones de Comida cercanas</div>
    <input type="text" name="origin_address" class="form_field" value="Enter address to find nearest food options" size="35" style="font-size:9pt;" onfocus="this.value=''; this.onfocus=null;"/>
    <input type="submit" value="Search" class="form_submit" />

    <div style="font-size:8pt; color:grey;">
    (ejemplo: 738 7th st se, washington dc; ward 8; etc.)
    </div>
    <div id="error"></div>
    </td>
    </tr></table>
    </form>
</td>

<td width="300" valign="middle">
 <div style="font-weight:bold;margin-left:10px;width:300px;visibility:hidden;" id="printLink"> 
    <img src="xmag.png" hspace="2" style="vertical-align:middle;"><span id="count"></span>&nbsp;Recursos Encontrados <a href="#" onclick="javascript:openlist(); return false;">(print list)</a>

 </div>
</td>
</tr></table>

<table cellpadding=0 cellspacing=0 border=0><tr>
<td valign="top" width="220">
   <form name="typeform" onsubmit="reload(0); return false;" style="">
   <div id="markerCategorySelect"></div>
   </form>
</td>

<td valign="top" width="400">
    <div id="map" style="width: 400px; height: 400px;">

      <div style="margin-left:200px;margin-top:200px;">Cargando...</div>
    </div>
    <table cellpadding=0 cellspacing="0" style="font-size:10pt;">
	<tr>
	<td width="20" align="left"><a href="about.html"><img src="icon_info.jpg" border=0 width=20></a></td>
	<td><div class="lowerLink"><a href="about.html">Sobre la Coalicion de Comida Saludable y Alcance de Todos (HAFA - por sus siglas en ingles) </a></div></td>
	<td width="20" align="left"><a href="mailto:info@dcfoodfinder.org"><img src="icon_email.jpg" border=0 width=20></td>
	<td><div class="lowerLink"><a href="mailto:info@dcfoodfinder.org">Contactenos</a></div></td>

	<td width=20 align="left"><a href="http://creator.zoho.com/dcfoodfinder/rss/3/complete=true/"><img src="icon_rss.gif" border=0 width="18"></td>
	<td><div class="lowerLink"><a href="http://creator.zoho.com/dcfoodfinder/rss/3/complete=true/">RSS feed</a></div></td>
	</tr>
    </table>
</td>

<td valign="top" width="300">
    <div id="controls" class="controls" style="font-weight:bold;padding-left:10px;">
    <table><tr>
        <td width="30" nowrap align="right">

	 <div id="back" class="" style="width:90px;visibility:hidden;">
	    <a href="#" onclick="javascript:setPage(-1); return false;" 
style="text-decoration:none;">&lt&lt;&lt; ANTERIOR</a>
	 </div>
	 </td>
	 <td width="80" align="center" nowrap>
	    <div id="current" class="" style="width:100px;align:center"></span>
	</td>
	<td width="30" align="left" nowrap>

	    <div id="forward" class="" style="width:90px;align:right;visibility:hidden;">
	      <a href="#" onclick="javascript:setPage(1); return false;" 
style="text-decoration:none;">SIGUIENTE &gt;&gt;&gt;</a>
    	    </div>
    </td>
    </tr></table>
    </div>
    <div id="mylist" class="markers"></div>
</td>
</tr>

</table>

</div>

<table width="100%"><tr>
<td width="50%" height="134">
   <div style="font-weight:bold;margin-top:5px;"><a href="" target="_blank"></a></div>
<div style="margin-top:5px;"> Tambien puede conseguir assistencia a traves de <strong> la linea de ayuda para prevencion del hambre del Capital Area Food Bank (Banco de Comida)  </strong> llamando al  <strong>202-644-9807</strong>.
</div>
<div style="margin-top:5px;">

<p><span class="copyright"> Esta pagina esta manejada por <a href="http://www.socialcompact.org">Social Compact, Inc.</a> &copy; 2008</span></p>

</div>
   
</td>
</tr></table>
  </div>

<!-- LOGOS -->
<div id="logos" style="width:900px;text-align:center;">
<a href="http://www.breadforthecity.org/" target="_blank">

  <img src="logos/breadforcity.jpg" height="50" border="0" hspace="10">
</a>
<a href="http://www.capitalareafoodbank.org/" target="_blank">
  <img src="logos/foodbank.jpg" height="50" border="0" hspace="10">
</a>
<a href="http://www.dccentralkitchen.org" target="_blank"><img 
src="logos/dccentralkitchen.jpg" height="50" border="0" hspace="10"></a>
<a href="http://www.dchunger.org" target="_blank"><img 
src="logos/dchungersolutions.gif" height="50" border="0" 
hspace="10"></a>
<a href="http://the7thstreetgarden.squarespace.com/" target="_blank">
  <img src="logos/commongood_logo_small.png" height="59" border="0" hspace="10">
</a>
<a href="http://www.socialcompact.org" target="_blank">
  <img src="logos/socialcompact.gif" height="50" border="0" 
hspace="10"></a>
<a href="http://www.some.org" target="_blank"><img src="logos/some.jpg" 
height="50" 
border="0" hspace="10"></a>
<a href="http://sharedc.org/" target="_blank" ><img src="logos/share.jpg" 
 border="0" ></a>
</div>
<!-- END LOGOS -->
</div>

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
var pageTracker = _gat._getTracker("UA-4988980-1");
pageTracker._initData();
pageTracker._trackPageview();
</script>

  </body>
</html>
