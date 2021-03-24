//Get menu elements
var baseColorSelectors = document.getElementsByClassName("baseColorSelector");
var geneColorSelectors = document.getElementsByClassName("geneColorSelector");
var lineartMenu = document.getElementById("lineartSelect");
var geneMenus = document.getElementsByClassName("geneMenu");
var bodyGeneMenu = document.getElementById("bodyGeneSelect");
var hairGeneMenu = document.getElementById("hairGeneSelect");
var tertiaryGeneMenu = document.getElementById("tertiaryGeneSelect");
var eyeGeneMenu = document.getElementById("eyeGeneSelect");
var hornGeneMenu = document.getElementById("hornGeneSelect");
var hoofGeneMenu = document.getElementById("hoofGeneSelect");
var previewButton = document.getElementById("previewer");
var submitButton = document.getElementById("builderSubmit");
var submitButton2 = document.getElementById("customizerSubmit");
var unicornSelector = document.getElementById("unicornSelect");
var colors;
var currentGenes;
var currentId;
var breedGeneImgs = [];
var breedLineart;
var BaseChild;
var Child;
var Gene;
var breedBaseColors;
var breedGenes;
var Lineart;
var CurrentLineartId;
var lineart = 	{
					"src": "",
					"id": ""
				};
var selectedGenes = {
	"bodyGene": {
					"src": "",
					"id": "",
					"colorable": "",
					"name": ""
				},
	"hairGene":	{
					"src": "",
					"id": "",
					"colorable": "",
					"name": ""
				},
	"tertiaryGene":	{
					"src": "",
					"id": "",
					"colorable": "",
					"name": ""
				},
	"eyeGene": 	{
					"src": "",
					"id": "",
					"colorable": "",
					"name": ""
				},
	"hornGene": {
					"src": "",
					"id": "",
					"colorable": "",
					"name": ""
				},
	"hoofGene": {
					"src": "",
					"id": "",
					"colorable": "",
					"name": ""
				},
}
