var Connect = require('connect');
var qs = require('qs')
var url = require('url')

// dummy data -> get these from the database backend
var parts =
{
"1":	{ "type": "c",  cap_min:"3.3nF", cap_max:"3.3nF", u:"500V", type:"ker.", amount:"6", },
"2":	{ "type": "c",  cap_min:"1nF", cap_max:"1nF", type:"ker.", amount:"8", },
"3":	{ "type": "c",  cap_min:"100pF", cap_max:"100pF", type:"ker.", amount:"12", },
"4":	{ "type": "c",  cap_min:"100nF", cap_max:"100nF", type:"ker.", amount:"15", },
"5":	{ "type": "c",  cap_min:"47nF", cap_max:"47nF", type:"foil", amount:"15", },
"6":	{ "type": "c",  cap_min:"68nF", cap_max:"68nF", type:"foil", amount:"2", },
"7":	{ "type": "c",  cap_min:"220uF", cap_max:"220uF", u:"25V", type:"elkouni", bauform:"radial", amount:"100", },
"8":	{ "type": "c",  cap_min:"1000uF", cap_max:"1000uF", u:"35V", type:"elkouni", bauform:"radial", amount:"40", },
"9":	{ "type": "c",  cap_min:"100uF", cap_max:"100uF", u:"25V", type:"elkouni", bauform:"radial", amount:"44", },
"10":	{ "type": "conn",  desc:"schraubklemme 2-pol", amount:"8", },
"11":	{ "type": "conn",  desc:"schraubklemme 3-pol", amount:"1", },
"12":	{ "type": "storage",  type:"SD Card", c:"64MB", amount:"3", },
"13":	{ "type": "trafo",  type:"transformer", u_in:"220V", u_out:"24V", i_out:"0.2A", amount:"2", },
"14":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"5mm", bauform:"oval", colour:"blau", wl:"", br_min:"", br_max:"", i:"", amount:"2", },
"15":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"5mm", bauform:"oval", colour:"orange", wl:"", br_min:"", br_max:"", i:"", amount:"7", },
"16":	{ "type": "led",  type:"led", dimx:"2mm", dimy:"3mm", bauform:"oval", colour:"gruen", wl:"", br_min:"", br_max:"", i:"", amount:"22", },
"17":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"5mm", bauform:"oval", colour:"gruen", wl:"522nm", br_min:"1500mcd", br_max:"1900mcd", i:"20mA", amount:"29", },
"18":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"cyan", wl:"502nm", br_min:"7200mcd", br_max:"9300mcd", i:"20mA", amount:"20", },
"19":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"orange", wl:"605nm", br_min:"1150mcd", br_max:"1500mcd", i:"20mA", amount:"25", },
"20":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"3mm", bauform:"rund", colour:"gelb", wl:"583nm", br_min:"26.5mcd", br_max:"42.3mcd", i:"10mA", amount:"52", },
"21":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"gruen", wl:"466nm", br_min:"4200mcd", br_max:"5500mcd", i:"20mA", amount:"54", },
"22":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"5mm", bauform:"oval", colour:"orange", wl:"", br_min:"", br_max:"", i:"", amount:"69", },
"23":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"rot", wl:"635nm", br_min:"12mcd", br_max:"19mcd", i:"10mA", amount:"78", },
"24":	{ "type": "led",  type:"led", dimx:"1mm", dimy:"5mm", bauform:"rechteck", colour:"orange", wl:"", br_min:"", br_max:"", i:"", amount:"40", },
"25":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"weiss", wl:"", br_min:"7200mcd", br_max:"9300mcd", i:"20mA", amount:"19", },
"26":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"weiss", wl:"", br_min:"", br_max:"", i:"", amount:"63", },
"27":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"rotorange", wl:"615nm", br_min:"12mcd", br_max:"16mcd", i:"20mA", amount:"65", },
"28":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"amber", wl:"591nm", br_min:"3200mcd", br_max:"4200mcd", i:"20mA", amount:"51", },
"29":	{ "type": "led",  type:"led", dimx:"5mm", dimy:"5mm", bauform:"rund", colour:"amber", wl:"588nm", br_min:"1150mcd", br_max:"1500mcd", i:"20mA", amount:"90", },
"30":	{ "type": "led",  type:"led", dimx:"0mm", dimy:"0mm", bauform:"rund", colour:"rot", wl:"630nm", br_min:"4200mcd", br_max:"5600mcd", i:"20mA", amount:"48", },
"31":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"5mm", bauform:"oval", colour:"amber", wl:"", br_min:"", br_max:"", i:"", amount:"84", },
"32":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"5mm", bauform:"oval", colour:"blau", wl:"", br_min:"", br_max:"", i:"", amount:"48", },
"33":	{ "type": "led",  type:"led", dimx:"2mm", dimy:"3mm", bauform:"oval", colour:"", wl:"", br_min:"", br_max:"", i:"", amount:"50", },
"34":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"3mm", bauform:"rund", colour:"gruen", wl:"568mm", br_min:"78.5mcd", br_max:"125.7mcd", i:"20mA", comment:"Sockel", amount:"82", },
"35":	{ "type": "led",  type:"led", dimx:"3mm", dimy:"3mm", bauform:"rund", colour:"gruen", wl:"572mm", br_min:"2.9mcd", br_max:"4.7mcd", i:"2mA", comment:"Sockel", amount:"58", },
"36":	{ "type": "xtal",  type:"", f:"1.8432MHz", case:"", amount:"6", },
"37":	{ "type": "tr",  model:"BC546B", amount:"50", },
"38":	{ "type": "l74",  model:"74ALS32N", desc:"quad 2 input OR", amount:"11", },
"39":	{ "type": "l74",  model:"74HCT138", desc:"3 to 8 inverting line decoder", amount:"44", },
"40":	{ "type": "l74",  model:"74ALS541N", desc:"octal 3 state line driver", amount:"16", },
"41":	{ "type": "l74",  model:"74ALS191N", desc:"4 bit counter", amount:"13", },
"42":	{ "type": "l74",  model:"74LS08N", desc:"quad 2 input AND", amount:"21", },
"43":	{ "type": "l74",  model:"74ALS74AN", desc:"dual D pos. edge trig. D flip flop", amount:"23", },
"44":	{ "type": "l74",  model:"74LS00N", desc:"quad 2 input nand", amount:"12", },
"45":	{ "type": "l74",  model:"74ALS150AN", desc:"", amount:"1", },
"46":	{ "type": "l40",  model:"HEF4053BP", desc:"triple 2 chan. analog multiplexer", amount:"7", },
"47":	{ "type": "oc",  model:"ACPL772L 020E", desc:"Optokoppler", amount:"15", },
"48":	{ "type": "oc",  model:"HCNW137", desc:"Optokoppler", amount:"15", },
"49":	{ "type": "oc",  model:"HCPL260L", desc:"Optokoppler", amount:"5", },
"50":	{ "type": "opa",  model:"TL074CN", desc:"quad op amp", amount:"13", },
"51":	{ "type": "ic",  model:"TA7358", desc:"FM frontend", amount:"8", },
"52":	{ "type": "ic",  model:"RTC58321A", desc:"4 bit real time clock", amount:"2", },
"53":	{ "type": "ic",  model:"LM311N", desc:"voltage comparator", amount:"8", },
"54":	{ "type": "c",  type:"kervs", cap_min:"100nF", cap_max:"100nF", rm:"2.5mm", u:"", tol:"", char:"", axis:"", deg:"", ann:"", amount:"103", },
"55":	{ "type": "c",  type:"kers", cap_min:"22pF", cap_max:"22pF", rm:"", u:"50V", tol:"", char:"", axis:"", deg:"", ann:"", amount:"99", },
"56":	{ "type": "c",  type:"elkouni", cap_min:"4.7uF", cap_max:"4.7uF", rm:"", u:"100V", tol:"", char:"", axis:"radial", deg:"", ann:"", amount:"100", },
"57":	{ "type": "r",  model:"", type:"kohleschicht", r:"0Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"58":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.0Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"59":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.2Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"60":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.5Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"61":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.8Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"62":	{ "type": "r",  model:"", type:"kohleschicht", r:"2.2Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"63":	{ "type": "r",  model:"", type:"kohleschicht", r:"2.7Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"64":	{ "type": "r",  model:"", type:"kohleschicht", r:"3.3Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"65":	{ "type": "r",  model:"", type:"kohleschicht", r:"3.9Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"66":	{ "type": "r",  model:"", type:"kohleschicht", r:"4.7Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"67":	{ "type": "r",  model:"", type:"kohleschicht", r:"5.6Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"68":	{ "type": "r",  model:"", type:"kohleschicht", r:"6.8Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"69":	{ "type": "r",  model:"", type:"kohleschicht", r:"8.2Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"70":	{ "type": "r",  model:"", type:"kohleschicht", r:"10Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"71":	{ "type": "r",  model:"", type:"kohleschicht", r:"12Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"72":	{ "type": "r",  model:"", type:"kohleschicht", r:"15Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"73":	{ "type": "r",  model:"", type:"kohleschicht", r:"18Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"74":	{ "type": "r",  model:"", type:"kohleschicht", r:"22Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"75":	{ "type": "r",  model:"", type:"kohleschicht", r:"27Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"76":	{ "type": "r",  model:"", type:"kohleschicht", r:"33Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"77":	{ "type": "r",  model:"", type:"kohleschicht", r:"39Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"78":	{ "type": "r",  model:"", type:"kohleschicht", r:"47Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"79":	{ "type": "r",  model:"", type:"kohleschicht", r:"56Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"80":	{ "type": "r",  model:"", type:"kohleschicht", r:"68Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"81":	{ "type": "r",  model:"", type:"kohleschicht", r:"82Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"82":	{ "type": "r",  model:"", type:"kohleschicht", r:"100Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"83":	{ "type": "r",  model:"", type:"kohleschicht", r:"120Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"84":	{ "type": "r",  model:"", type:"kohleschicht", r:"150Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"85":	{ "type": "r",  model:"", type:"kohleschicht", r:"180Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"86":	{ "type": "r",  model:"", type:"kohleschicht", r:"220Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"87":	{ "type": "r",  model:"", type:"kohleschicht", r:"270Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"88":	{ "type": "r",  model:"", type:"kohleschicht", r:"330Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"89":	{ "type": "r",  model:"", type:"kohleschicht", r:"390Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"90":	{ "type": "r",  model:"", type:"kohleschicht", r:"470Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"91":	{ "type": "r",  model:"", type:"kohleschicht", r:"560Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"92":	{ "type": "r",  model:"", type:"kohleschicht", r:"680Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"93":	{ "type": "r",  model:"", type:"kohleschicht", r:"820Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"94":	{ "type": "r",  model:"", type:"kohleschicht", r:"1000Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"95":	{ "type": "r",  model:"", type:"kohleschicht", r:"1200Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"96":	{ "type": "r",  model:"", type:"kohleschicht", r:"1500Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"97":	{ "type": "r",  model:"", type:"kohleschicht", r:"1800Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"98":	{ "type": "r",  model:"", type:"kohleschicht", r:"2200Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"99":	{ "type": "r",  model:"", type:"kohleschicht", r:"2700Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"100":	{ "type": "r",  model:"", type:"kohleschicht", r:"3300Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"101":	{ "type": "r",  model:"", type:"kohleschicht", r:"3900Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"102":	{ "type": "r",  model:"", type:"kohleschicht", r:"4700Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"103":	{ "type": "r",  model:"", type:"kohleschicht", r:"5600Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"104":	{ "type": "r",  model:"", type:"kohleschicht", r:"6800Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"105":	{ "type": "r",  model:"", type:"kohleschicht", r:"8200Ohm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"106":	{ "type": "r",  model:"", type:"kohleschicht", r:"10kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"107":	{ "type": "r",  model:"", type:"kohleschicht", r:"12kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"108":	{ "type": "r",  model:"", type:"kohleschicht", r:"15kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"109":	{ "type": "r",  model:"", type:"kohleschicht", r:"18kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"110":	{ "type": "r",  model:"", type:"kohleschicht", r:"22kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"111":	{ "type": "r",  model:"", type:"kohleschicht", r:"27kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"112":	{ "type": "r",  model:"", type:"kohleschicht", r:"33kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"113":	{ "type": "r",  model:"", type:"kohleschicht", r:"39kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"114":	{ "type": "r",  model:"", type:"kohleschicht", r:"47kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"115":	{ "type": "r",  model:"", type:"kohleschicht", r:"56kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"116":	{ "type": "r",  model:"", type:"kohleschicht", r:"68kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"117":	{ "type": "r",  model:"", type:"kohleschicht", r:"82kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"118":	{ "type": "r",  model:"", type:"kohleschicht", r:"100kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"119":	{ "type": "r",  model:"", type:"kohleschicht", r:"120kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"120":	{ "type": "r",  model:"", type:"kohleschicht", r:"150kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"121":	{ "type": "r",  model:"", type:"kohleschicht", r:"180kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"122":	{ "type": "r",  model:"", type:"kohleschicht", r:"220kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"123":	{ "type": "r",  model:"", type:"kohleschicht", r:"270kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"124":	{ "type": "r",  model:"", type:"kohleschicht", r:"330kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"125":	{ "type": "r",  model:"", type:"kohleschicht", r:"390kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"126":	{ "type": "r",  model:"", type:"kohleschicht", r:"470kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"127":	{ "type": "r",  model:"", type:"kohleschicht", r:"560kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"128":	{ "type": "r",  model:"", type:"kohleschicht", r:"680kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"129":	{ "type": "r",  model:"", type:"kohleschicht", r:"820kOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"130":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.0MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"131":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.2MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"132":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.5MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"133":	{ "type": "r",  model:"", type:"kohleschicht", r:"1.8MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"134":	{ "type": "r",  model:"", type:"kohleschicht", r:"2.2MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"135":	{ "type": "r",  model:"", type:"kohleschicht", r:"2.7MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"136":	{ "type": "r",  model:"", type:"kohleschicht", r:"3.3MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"137":	{ "type": "r",  model:"", type:"kohleschicht", r:"3.9MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"138":	{ "type": "r",  model:"", type:"kohleschicht", r:"4.7MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"139":	{ "type": "r",  model:"", type:"kohleschicht", r:"5.6MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"140":	{ "type": "r",  model:"", type:"kohleschicht", r:"6.8MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"141":	{ "type": "r",  model:"", type:"kohleschicht", r:"8.2MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"142":	{ "type": "r",  model:"", type:"kohleschicht", r:"10MOhm", u:"", tol:"5%", p:"0.25W", char:"", axis:"", deg:"", elements:"1", amount:"100", },
"143":	{ "type": "diode",  model:"1N4148", u:"", i:"", p:"", type:"rect", amount:"1000", },
"144":	{ "type": "diode",  model:"1N4007", u:"", i:"", p:"", type:"rect", amount:"100", },
"145":	{ "type": "oc",  model:"CNY17-F1", case:"DIL6", entities:"1", desc:"Optokoppler", amount:"24", },
"146":	{ "type": "atmel",  model:"ATtiny2313-20PU", case:"DIP20", iopins:"", mem:"", lowvoltage:"0", amount:"20", },
"147":	{ "type": "atmel",  model:"ATmega8-16PU", case:"DIP28", iopins:"", mem:"", lowvoltage:"0", amount:"20", },
"148":	{ "type": "atmel",  model:"ATmega48-20PU", case:"DIP28", iopins:"", mem:"", lowvoltage:"0", amount:"10", },
"149":	{ "type": "sup",  model:"7805", case:"", u:"", i:"", p:"", lowdrop:"0", operation:"linear", amount:"30", },
"150":	{ "type": "ic",  model:"MAX323N", case:"DIL14", desc:"", amount:"0", },
"151":	{ "type": "xtal",  model:"", f:"8MHz", case:"flat", amount:"10", },
"152":	{ "type": "xtal",  model:"", f:"12MHz", case:"flat", amount:"20", },
"153":	{ "type": "xtal",  model:"", f:"16MHz", case:"flat", amount:"10", },
"154":	{ "type": "xtal",  model:"", f:"20MHz", case:"flat", amount:"20", },
"155":	{ "type": "conn",  type:"", g:"m", pinlayout:"40x1", pincount:"40", dimx:"", dimy:"", u:"", i:"", desc:"Stiftleiste 40x1-pol gerade", amount:"200", },
"156":	{ "type": "conn",  type:"", g:"m", pinlayout:"40x1", pincount:"40", dimx:"", dimy:"", u:"", i:"", desc:"Stiftleiste 40x1-pol gewinkelt", amount:"25", },
"157":	{ "type": "conn",  type:"", g:"f", pinlayout:"20x1", pincount:"20", dimx:"", dimy:"", u:"", i:"", desc:"Praezisionsbuchsenleiste 20x1-pol gerade", amount:"1", },
"158":	{ "type": "conn",  type:"", g:"m", pinlayout:"40x2", pincount:"80", dimx:"", dimy:"", u:"", i:"", desc:"Stiftleiste 40x2-pol gerade", amount:"50", },
"159":	{ "type": "conn",  type:"", g:"m", pinlayout:"40x2", pincount:"80", dimx:"", dimy:"", u:"", i:"", desc:"Stiftleiste 40x2-pol gewinkelt", amount:"25", },
"160":	{ "type": "conn",  type:"", g:"f", pinlayout:"2x4", pincount:"8", dimx:"", dimy:"", u:"", i:"", desc:"IC-Fassung DIL8", amount:"20", },
"161":	{ "type": "conn",  type:"", g:"f", pinlayout:"2x10", pincount:"20", dimx:"", dimy:"", u:"", i:"", desc:"IC-Fassung DIL20S", amount:"24", },
"162":	{ "type": "conn",  type:"", g:"f", pinlayout:"2x14", pincount:"28", dimx:"", dimy:"", u:"", i:"", desc:"IC-Fassung DIL28S", amount:"20", },
"163":	{ "type": "switch",  model:"", uac:"", udc:"", i:"", pushbutton:"1", twoway:"0", breaker:"0", shutter:"1", dimx:"", dimy:"", light:"0", move:"0", desc:"Minitaster 6x6 4.3mm", amount:"50", },
"164":	{ "type": "board",  xdim:"75mm", ydim:"100mm", type:"grid", appl:"", amount:"10", },
"165":	{ "type": "board",  xdim:"160mm", ydim:"100mm", type:"grid", appl:"", amount:"10", },
}
;

//var templates = { "shemale" :{ '00001' : '2000 [stueck]' , '00003' : '>9001 stueck' }, "doublepenisbob" : {"00000" : "2", "00001" : "1"} }
// end of dummy data

var log = {}
function getAllMatching(datatypes, query) {
  log.debug("Query: "+query)
  var ret = {}
  var queries = query.split(/ +/g);
  //if (query === '') return ret
  Object.keys(datatypes).forEach(function (data_key) {
    var data = datatypes[data_key];
    var query_set = {};
    queries.forEach(function (key) {
      if (query_set.hasOwnProperty(key)) {
        query_set[key]++;
      } else {
        query_set[key] = 1;
      };
    });
    Object.keys(data).forEach(function (attr_key) {
      var attr = data[attr_key];
      Object.keys(query_set).forEach(function (qpart) {
        try {
          var res = attr.search(qpart);
        } catch (exn) {
          res = -1;
        };
        if (res !== -1) {
          log.debug(qpart + " in " +attr_key + " from " + data_key);
          if (--query_set[qpart] === 0) {
            delete query_set[qpart];
          };
        }
      });
      if (Object.keys(query_set).length === 0) {
        ret[data_key] = data;
      };
    });
  });
  return ret
}
exports.search = function (server) {
  log = server.log
  return Connect(
    Connect.router(function (app) {
        app.get('/parts', function(req, res){
            var parsedParams = qs.parse(url.parse(req.url).query)
            var ret = {}
            server.store.parts.all(function (err,xparts) {
              if (err) {
                res.error().json({ message: "you are made of stupid." + err.stack});
                return 23
              }
              if ('fulltext' in parsedParams)
              {
                query = parsedParams['fulltext']
                ret = getAllMatching(parts,query)
              }
              res.end(JSON.stringify(ret));
            });
          });

        app.get('/templates', function(req, res){
            var parsedParams = qs.parse(url.parse(req.url).query)
            var ret = {}
            if ('fulltext' in parsedParams )
            {
              var query = parsedParams['fulltext']

              server.store.parts.all(function (err,templates) {
                if (err) {
                  res.error().json({ message: "you are made of stupid." + err.stack});
                  return 23
                }
                Object.keys(templates).forEach(function (template_key)
                {
                  var template = templates[template_key] 
                  var all_parts = {} 
                  Object.keys(template).forEach(function (part_key) // resolve parts
                  {
                    all_parts[part_key] = parts[part_key]
                  });
                  var found_parts = getAllMatching(all_parts,query)
                  log.debug("found parts:"+ JSON.stringify(found_parts))
                  if ( Object.keys(found_parts).length > 0 )
                  {
                    log.debug(template_key)
                    ret[template_key] = template
                    log.debug(JSON.stringify(ret))
                  }
                });
              res.end(JSON.stringify(ret));
              });
            }
          });
      })
  );
}
