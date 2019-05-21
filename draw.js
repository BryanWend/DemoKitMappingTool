
'use strict'

var upperLayCanvas;
var lowerHoleCanvas;
var grid = 25;
var lineCounter = 0;
var shapeLocationArray = [];

window.onload = function drawPage(){

	shapeLocationArray.length = 0;
	upperLayCanvas = new fabric.Canvas('upperCanvas', { selection: false });
	lowerHoleCanvas = new fabric.Canvas('lowerCanvas', { selection: false });

	//Create and size the grid
	drawGrid(upperLayCanvas, upperLayCanvas.width, upperLayCanvas.height);
	drawGrid(lowerHoleCanvas, lowerHoleCanvas.width, lowerHoleCanvas.height);

	//Draw all the required Objects in a default position
	drawObjects(upperLayCanvas);
	if(localStorage.length === 1)
		loadFromStorage(upperLayCanvas);

	//Draw grey inclusive border
	drawBorder(upperLayCanvas);
	drawBorder(lowerHoleCanvas);

	upperLayCanvas.on('object:moving', function(options){
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
	});

	lowerHoleCanvas.on('mouse:up', function(options){
   		console.log(options.e.layerX, options.e.layerY);

   		if(options.target == null){
	   		lowerHoleCanvas.add(new fabric.Rect({
			  width: grid, 
			  height: grid, 
			  left: options.e.layerX - grid / 2, 
			  top: options.e.layerY - grid / 2, 
			  fill: '#faa', 
			  // hasControls: false
	   		}))
   		}

  //  		options.target.set({
		//    left: Math.round(options.target.left / grid) * grid,
		//    top: Math.round(options.target.top / grid) * grid
		// });
	});

	// lowerHoleCanvas.on('object:moving', function(options){

	// 	//Snap to the grid when moving
	// 	options.target.set({
	// 	   left: Math.round(options.target.left / grid) * grid,
	// 	   top: Math.round(options.target.top / grid) * grid
	// 	});
	// });

}


function loadFromStorage(canvas){
	//Convert stored string back to JS objects
	shapeLocationArray.length = 0;
	shapeLocationArray = JSON.parse(localStorage.getItem('coords'));
	//Loop through canvas objects from end to start since main 
	//shapes are drawn last
	for (var i = canvas._objects.length - 1; i > 0; i--) {
		//Check if object type == group, otherwise break out
		if (canvas._objects[i].type === "group") {
			//Check if it matches a saved object
			for (var j = 0; j < shapeLocationArray.length; j++) {
				if(canvas._objects[i]._objects[1].text === shapeLocationArray[j].name){
					//Set the new shape location
					canvas._objects[i].set({
						left: shapeLocationArray[j].left,
						top: shapeLocationArray[j].top
					});
					canvas._objects[i].setCoords();
					//Remove from array when found to lower iterations
					shapeLocationArray.splice(j,1);
				}
			}
		}
		//Prevent unecessary iterations
		else
			break;
	}
	//Render a new canvas to show the changed positions
	canvas.renderAll();
}

//This will eventually need to be changed to support both canvases
function save(){
	//Loop through canvas objects from end to start since main 
	//shapes are drawn last
	shapeLocationArray.length = 0;
	for (var i = upperLayCanvas._objects.length - 1; i > 0; i--) {
		//Check it is a shape and not part of the gridlines
		if(upperLayCanvas._objects[i].type === "group"){
			//Add info as object to an array
			shapeLocationArray.push({
				name: upperLayCanvas._objects[i]._objects[1].text,
				top: upperLayCanvas._objects[i].top,
				left: upperLayCanvas._objects[i].left
				});
		}
		else
			break;
		//Convert array to string and store it for next load
		localStorage.setItem("coords", JSON.stringify(shapeLocationArray));
	}
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
	var kvmObj = new fabric.Rect({ 
	  left: 600, 
	  top: 50, 
	  width: 325, 
	  height: 75, 
	  fill: '#faa', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	var kvmText = new fabric.Text("KVM Switch",{
		left: 650, 
		top: 62.5, 
		originX: 'left', 
		originY: 'top',
	});

	var kvmGroup = new fabric.Group([kvmObj, kvmText]);
	canvas.add(kvmGroup);

	//Make the NUC shapes
	var nuc1Obj = new fabric.Rect({ 
	  left: 600, 
	  top: 175, 
	  width: 225,
	  height: 100,
	  fill: '#9f9', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	var nuc1Text = new fabric.Text("NUC 1",{
		left: 660, 
		top: 200, 
		originX: 'left', 
		originY: 'top',
	});

	var nuc1Group = new fabric.Group([nuc1Obj, nuc1Text]);
	canvas.add(nuc1Group);

	var nuc2Obj = new fabric.Rect({ 
	  left: 600, 
	  top: 300, 
	  width: 225,
	  height: 100,
	  fill: '#9f9', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	var nuc2Text = new fabric.Text("NUC 2",{
		left: 660, 
		top: 325, 
		originX: 'left', 
		originY: 'top',
	});

	var nuc2Group = new fabric.Group([nuc2Obj, nuc2Text]);
	canvas.add(nuc2Group);

	//Make the keyboard shapes
	var keyboardObj = new fabric.Rect({ 
	  left: 300, 
	  top: 400, 
	  width: 875,
	  height: 50,
	  fill: '#96daff', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	var keyboardText = new fabric.Text("Keyboard",{
		left: 660, 
		top: 405, 
		originX: 'left', 
		originY: 'top',
	});

	var keyboardGroup = new fabric.Group([keyboardObj, keyboardText]);
	canvas.add(keyboardGroup);

	//Make the monitor shapes
	var screenObj = new fabric.Rect({ 
	  left: 25, 
	  top: 25, 
	  width: 625,
	  height: 425,
	  fill: '#ffee8e', 
	  originX: 'left', 
	  originY: 'top',
	  centeredRotation: true
	});

	var screenText = new fabric.Text("Monitor",{
		left: 250, 
		top: 200, 
		originX: 'left', 
		originY: 'top',
	});

	var screenGroup = new fabric.Group([screenObj, screenText]);
	canvas.add(screenGroup);
}

//Create a non-selectable border that you can drag/snap object over
function drawBorder(canvas){

	var pelTopBorderObj = new fabric.Rect({
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

	var pelBotBorderObj = new fabric.Rect({
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

	var pelLeftBorderObj = new fabric.Rect({
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

	var pelRightBorderObj = new fabric.Rect({
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

	var borderGroup = new fabric.Group([pelTopBorderObj, 
		pelBotBorderObj, pelLeftBorderObj, pelRightBorderObj]);
	canvas.add(borderGroup);
	borderGroup.selectable = false;

	//Prevent border group from interfering with mousedown events
	borderGroup.evented = false;

	//Prevent blocking movement of other shapes
	canvas.sendToBack(borderGroup);

}
