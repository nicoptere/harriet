var Cable = function( el0, el1, side, position, size )
{

    THREE.Object3D.call( this );

    this.side = side || "front";
    position = position ||  ["left", "center", "right"][ parseInt( Math.random() * 3 )];

    this.p0 = el0.pivots[ this.side ][ position];
    this.p1 = el1.pivots[ this.side ][ position];

    this.cp0 = this.p0.clone();
    this.cp0.y -= .5;
    this.cp0.z += this.side == "front" ? .1 : -.1;

    this.mid = this.p0.clone().add( this.p1 ).multiplyScalar(.5 );
    this.mid.y = Math.min( this.p0.y, Math.min( this.p1.y, -1 ) );

    this.cp1 = this.p1.clone();
    this.cp1.y -= .5;
    this.cp1.z += this.side == "front" ? .1 : -.1;


    this.size = size || 0.01;


    var section = Section.createRegularSection(  this.size, 3 );

    this.precision = .1;
    this.path = QuadraticBezier.compute( [ this.p0, this.cp0, this.mid, this.cp1, this.p1 ], this.precision );
    this.mesh = new Loft( this.path, section, Materials.SEM  );
    this.mesh .castShadow = true;

    this.add( this.mesh );
    Plane3d.container.add( this );

    this.type = T.CABLE;

};
Cable.prototype = Object.create( THREE.Object3D.prototype );
Cable.prototype.animate = function( deltaTime )
{
    this.cp0.copy( this.p0 );
    this.cp0.y -= .5;
    this.cp0.z += this.side == "front" ? .1 : -.1;

    this.mid.copy( this.p0 ).add( this.p1 ).multiplyScalar(.5 );
    this.mid.y = Math.min( this.p0.y, Math.min( this.p1.y, -1 ) );

    this.cp1.copy( this.p1 );
    this.cp1.y -= .5;
    this.cp1.z += this.side == "front" ? .1 : -.1;

    this.path = QuadraticBezier.compute( [ this.p0, this.cp0, this.mid, this.cp1, this.p1 ], this.precision );
    this.mesh.update( this.path );

    //var d = distance( this.p0, this.p1 );
    //var a = angle( this.p0, this.p1 );
    //
    //this.mesh.position.x = ( this.p0.x + this.p1.x ) * .5;
    //this.mesh.position.y = ( this.p0.y + this.p1.y ) * .5;
    //this.mesh.position.z = this.p0.z;
    //this.mesh.scale.set(  this.size,this.size, d );
    //this.mesh.lookAt( this.p0 );
};