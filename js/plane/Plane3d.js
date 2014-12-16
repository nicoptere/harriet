var Plane3d = function( seed )
{
    THREE.Object3D.call( this );

    this.seed = seed || 0;
    this.elements = [];


    this.generator = new Generator();

    this.container = Plane3d.container = new THREE.Object3D();

    this.add( Plane3d.container );

    Plane3d.castShadow = true;
    Stage3d.scene.add( this );


    this.reset = function( length, cableRatio, thickness )
    {

        if( this.seed == null )
        {
            this.seed = Date.now();
        }

        PRNG.initialize_generator( this.seed );
        window.location.hash = "model=" + this.seed;

        this.generator.generate( this, length );

        this.generator.build( this, cableRatio ||.5, thickness || 1 );

    };

    this.update = function( ctx, t )
    {
        this.elements.forEach( function( el )
        {
            el.animate(t);

        });
    };

};
Plane3d.prototype = Object.create( THREE.Object3D.prototype );


