
'use strict'

let upperLayCanvas;
let lowerHoleCanvas;
let grid = 25;
let lineCounter = 0;

window.onload = function drawPage(){

	upperLayCanvas = new fabric.Canvas('upperCanvas', { selection: false });
	lowerHoleCanvas = new fabric.Canvas('lowerCanvas', { selection: false });

	//Create and size the grid
	drawGrid(upperLayCanvas, upperLayCanvas.width, upperLayCanvas.height);
	drawGrid(lowerHoleCanvas, lowerHoleCanvas.width, lowerHoleCanvas.height);

	//Draw all the required Objects in a default position
	drawObjects(upperLayCanvas);
	if(localStorage.length > 0)
		loadFromStorage();

	//Draw grey inclusive border
	drawBorder(upperLayCanvas);
	drawBorder(lowerHoleCanvas);

	//Wire events
	upperLayCanvas.on({'object:moving': setBoundary});

	lowerHoleCanvas.on('mouse:up', function(options){
   		if(options.target == null)
   			drawRect(options.e.layerY - grid / 2, options.e.layerX - grid / 2);		
	});

	lowerHoleCanvas.on('object:moving', setBoundary);
}

function loadFromStorage(){
	//Convert stored string back to JS objects
	let loadLocation;
	loadLocation = JSON.parse(localStorage.getItem('topCoords'));
	//Loop through canvas objects from end to start since main 
	//shapes are drawn last
	for (let i = upperLayCanvas._objects.length - 1; i > 0; i--) {
		//Check if object type == group, otherwise break out
		if (upperLayCanvas._objects[i].type === "group") {
			//Check if it matches a saved object
			for (let j = 0; j < loadLocation.length; j++) {
				if(upperLayCanvas._objects[i]._objects[1].text === loadLocation[j].name){
					//Set the new shape location
					upperLayCanvas._objects[i].set({
						left: loadLocation[j].left,
						top: loadLocation[j].top
					});
					upperLayCanvas._objects[i].setCoords();
					//Remove from array when found to lower iterations
					loadLocation.splice(j,1);
				}
			}
		}
		//Prevent unecessary iterations
		else
			break;
	}
	loadLocation = JSON.parse(localStorage.getItem('botCoords'));
		for (let coord in loadLocation){
			drawRect(loadLocation[coord].top, loadLocation[coord].left);
		}
	//Render a new canvas to show the changed positions
	upperLayCanvas.renderAll();
	lowerHoleCanvas.renderAll();
}

//This will eventually need to be changed to support both canvases
function save(){
	//Loop through canvas objects from end to start since main 
	//shapes are drawn last
	let savedLocation = [];
	for (let i = upperLayCanvas._objects.length - 1; i > 0; i--) {
		//Check it is a shape and not part of the gridlines
		if(upperLayCanvas._objects[i].type === "group"){
			//Add info as object to an array
			savedLocation.push({
				name: upperLayCanvas._objects[i]._objects[1].text,
				top: upperLayCanvas._objects[i].top,
				left: upperLayCanvas._objects[i].left
				});
		}
		else
			break;
	}
	//Convert array to string and store it for next load
	localStorage.setItem("topCoords", JSON.stringify(savedLocation));
	savedLocation = [];
	for (let i = lowerHoleCanvas._objects.length - 1; i > 0; i--){
		if(lowerHoleCanvas._objects[i].type === "rect"){

			savedLocation.push({
				top: lowerHoleCanvas._objects[i].top,
				left: lowerHoleCanvas._objects[i].left
			});
		}
		else
			break;
		}
	localStorage.setItem("botCoords", JSON.stringify(savedLocation));
}

function drawGrid(canvas, width, height){

	for (lineCounter = 0; lineCounter < (width / grid); lineCounter++) {
	  //columns	
	  if(lineCounter != 19)
	  	canvas.add(new fabric.Line([lineCounter * grid, 0, lineCounter * grid, height], 
	  		{stroke: '#ccc', selectable: false}));
	  //rows
	  if(lineCounter != 11  && lineCounter <= (height / grid))
	  	canvas.add(new fabric.Line([ 0, lineCounter * grid, width, lineCounter * grid], 
	  		{stroke: '#ccc', selectable: false}))
	}
}

//Add Shape Objects
function drawObjects(canvas){
	//Make KVM shapes
	let kvmObj = new fabric.Rect({ 
	  left: 600, 
	  top: 50, 
	  width: 325, 
	  height: 75, 
	  fill: '#faa', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true,
	});

	let kvmText = new fabric.Text("KVM Switch",{
		left: 650, 
		top: 62.5, 
		originX: 'left', 
		originY: 'top',
	});

	let kvmGroup = new fabric.Group([kvmObj, kvmText],{
		hasControls: false
	});
	canvas.add(kvmGroup);

	//Make the NUC shapes
	let nuc1Obj = new fabric.Rect({ 
	  left: 600, 
	  top: 175, 
	  width: 225,
	  height: 100,
	  fill: '#9f9', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	let nuc1Text = new fabric.Text("NUC 1",{
		left: 660, 
		top: 200, 
		originX: 'left', 
		originY: 'top',
	});

	let nuc1Group = new fabric.Group([nuc1Obj, nuc1Text],{
		hasControls: false
	});
	canvas.add(nuc1Group);

	let nuc2Obj = new fabric.Rect({ 
	  left: 600, 
	  top: 300, 
	  width: 225,
	  height: 100,
	  fill: '#9f9', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	let nuc2Text = new fabric.Text("NUC 2",{
		left: 660, 
		top: 325, 
		originX: 'left', 
		originY: 'top',
	});

	let nuc2Group = new fabric.Group([nuc2Obj, nuc2Text],{
		hasControls: false
	});
	canvas.add(nuc2Group);

	//Make the keyboard shapes
	let keyboardObj = new fabric.Rect({ 
	  left: 300, 
	  top: 400, 
	  width: 875,
	  height: 50,
	  fill: '#96daff', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	let keyboardText = new fabric.Text("Keyboard",{
		left: 660, 
		top: 405, 
		originX: 'left', 
		originY: 'top',
	});

	let keyboardGroup = new fabric.Group([keyboardObj, keyboardText],{
		hasControls: false
	});
	canvas.add(keyboardGroup);

	//Make the monitor shapes
	let screenObj = new fabric.Rect({ 
	  left: 25, 
	  top: 25, 
	  width: 625,
	  height: 425,
	  fill: '#ffee8e', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	let screenText = new fabric.Text("Monitor",{
		left: 250, 
		top: 200, 
		originX: 'left', 
		originY: 'top',
	});

	let screenGroup = new fabric.Group([screenObj, screenText],{
		hasControls: false
	});
	canvas.add(screenGroup);
}

//Create a non-selectable border that you can drag/snap object over
function drawBorder(canvas){

	let pelTopBorderObj = new fabric.Rect({
	  left: 0, 
	  top: 0, 
	  width: 1000,
	  height: 25,
	  fill: '#c0c0c0', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true,
	  selectable: false
	});

	let pelBotBorderObj = new fabric.Rect({
	  left: 0, 
	  top: 525, 
	  width: 1000,
	  height: 25,
	  fill: '#c0c0c0', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true,
	  selectable: false
	});

	let pelLeftBorderObj = new fabric.Rect({
	  left: 0, 
	  top: 0, 
	  width: 25,
	  height: 550,
	  fill: '#c0c0c0', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true,
	  selectable: false
	});

	let pelRightBorderObj = new fabric.Rect({
	  left: 975, 
	  top: 0, 
	  width: 25,
	  height: 550,
	  fill: '#c0c0c0', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true,
	  selectable: false
	});

	let borderGroup = new fabric.Group([pelTopBorderObj, 
		pelBotBorderObj, pelLeftBorderObj, pelRightBorderObj]);
	canvas.add(borderGroup);
	borderGroup.selectable = false;

	//Prevent border group from interfering with mousedown events
	borderGroup.evented = false;

	//Prevent blocking movement of other shapes
	canvas.sendToBack(borderGroup);

}

function drawRect(top, left){
	lowerHoleCanvas.add(new fabric.Rect({
		width: grid, 
		height: grid, 
		left: left, 
		top: top, 
		fill: '#faa', 
		hasControls: false
	}))	
}

function setBoundary(options){
	//Prevent from leaving the canvas area
	if (options.target.left <= 0) {
		options.target.left = 0;
	}
	if (options.target.top <= 0) {
		options.target.top = 0;
	}
	if (options.target.left >= (upperLayCanvas.width - options.target.width)) {
		options.target.left = upperLayCanvas.width - options.target.width;
	}
	if (options.target.top >= (upperLayCanvas.height - options.target.height)) {
		options.target.top = upperLayCanvas.height - options.target.height;
	}
	//Snap to the grid when moving
	options.target.set({
	   left: Math.round(options.target.left / grid) * grid,
	   top: Math.round(options.target.top / grid) * grid
	});
}