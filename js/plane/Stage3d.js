'use strict';

function Stage3d(){}

Stage3d.init = function()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	this.camera = new THREE.PerspectiveCamera( 40, width / height,.5, 10000000 );
	this.camera.position.z = 100;
	this.scene = new THREE.Scene();

	// Fast renderer wihout any buffer
	this.renderer = new THREE.WebGLRenderer({
		alpha:false,
		precision:"highp",
		antialias:true
	});

	this.domElement = this.renderer.domElement;
	document.body.appendChild( this.domElement );

	this.renderer.setSize( width, height );
    this.control = new THREE.OrbitControls( this.camera, document.body );//this.domElement );//this.camera.position.z );
	this.control.minPolarAngle = Math.PI / 4;
	this.control.maxPolarAngle = Math.PI / 2;
	this.locked = false;

	this.control.minDistance = 10;
	this.control.maxDistance = 25;

};

Stage3d.add = function(o){
	this.scene.add( o )
};

Stage3d.remove = function(o){
	this.scene.remove( o )
};


Stage3d.initComposer = function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
    this.composer = new Composer( width, height, this.renderer, this.scene, this.camera );
};



Stage3d.render = function()
{
	if( !this.locked )
	{
		this.control.update();
		this.camera.lookAt(this.scene.position);
	}
	this.renderer.render(this.scene, this.camera);
};


Stage3d.resize = function()
{		
	var width = window.innerWidth;
	var height = window.innerHeight;

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( width, height );

};