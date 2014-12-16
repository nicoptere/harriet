var Stick = function( el0, el1, side, position, size )
{

    THREE.Object3D.call( this );
    side = side || "front";
    position = position ||  ["left", "center", "right"][ parseInt( Math.random() * 3 )];

    this.p0 = el0.pivots[ side ][ position ];
    this.p1 = el1.pivots[ side ][ position ];
    this.size = size || 0.01;

    this.mesh = new THREE.Mesh(Part.CUBE, Part.MAT);
    this.mesh.castShadow = true;
    this.add( this.mesh );
    Plane3d.container.add( this );

    this.type = T.STICK;

};
Stick.prototype = Object.create( THREE.Object3D.prototype );

Stick.prototype.animate = function( deltaTime )
{
    var d = distance( this.p0, this.p1 );
    this.mesh.position.x = ( this.p0.x + this.p1.x ) * .5;
    this.mesh.position.y = ( this.p0.y + this.p1.y ) * .5;
    this.mesh.position.z = this.p0.z;
    this.mesh.scale.set(  this.size,this.size, d );
    this.mesh.lookAt( this.p0 );
};