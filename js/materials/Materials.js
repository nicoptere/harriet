
var Materials = function()
{
    new Skybox();

    var noise = new THREE.Texture( CanvasNoise( 256,256, 64,128, false, false ) );
    noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
    noise.needsUpdate = true;
    var earth_night = THREE.ImageUtils.loadTexture( 'img/earth_night.jpg', null, function(){
        earth_night.needsUpdate = true;
    } );

    var heightMap = THREE.ImageUtils.loadTexture( 'img/heightmap_1024.png', null, function(){
        heightMap.needsUpdate = true;
    } );

    var gradient = THREE.ImageUtils.loadTexture( 'img/gradient.jpg', null, function(){
        gradient.needsUpdate = true;
    } );

    var rubber = THREE.ImageUtils.loadTexture( 'img/rubber.jpg', null, function(){
        rubber.needsUpdate = true;
    } );
    var copper = THREE.ImageUtils.loadTexture( 'img/copper_1.png', null, function(){
        copper.needsUpdate = true;
    } );
    var brass = THREE.ImageUtils.loadTexture( 'img/brass.png', null, function(){
        brass.needsUpdate = true;
    } );
    var steel = THREE.ImageUtils.loadTexture( 'img/steel.jpg', null, function(){
        steel.needsUpdate = true;
    } );
    var wing = THREE.ImageUtils.loadTexture( 'img/wing.png', null, function(){
        wing.needsUpdate = true;
    } );
    var wood = THREE.ImageUtils.loadTexture( 'img/wood.jpg', null, function(){
        wood.needsUpdate = true;
    } );

    var harriet_tra = THREE.ImageUtils.loadTexture( 'img/tr_harriet.png', null, function(){
        harriet_tra.wrapS = harriet_nrm.wrapT = THREE.RepeatWrapping;
        //harriet_tra.repeat.set( 2, 1 );
        harriet_tra.needsUpdate = true;
    } );
    var harriet_nrm = THREE.ImageUtils.loadTexture( 'img/nr_harriet.png', null, function(){
        harriet_nrm.wrapS = harriet_nrm.wrapT = THREE.RepeatWrapping;
        //harriet_nrm.repeat.set( 2, 1 );
        harriet_nrm.needsUpdate = true;
    } );



    Materials.SEM = new THREE.ShaderMaterial( {

        uniforms:
        {

            environment:{ type: 't', value: copper },
            texture:{   type: 't', value: noise },
            bump: {   type: 't', value: noise },
            bumpAmount:{ type: 'f', value:0 },

            time:{ type: 'f', value:0 },
            type:{ type: 'i', value:1 },
            grain:{ type: 'f', value:0.4 },
            alpha:{ type: 'f', value:1. }

        },
        vertexShader: ShaderLoader.get( 'sem_vs' ),
        fragmentShader: ShaderLoader.get( 'sem_fs' ),

        shading: THREE.SmoothShading,
        ambient:0x808080,
        side:THREE.DoubleSide,
        transparent:true


    } );

    Materials.SEM.uniforms.environment.value.wrapS =
    Materials.SEM.uniforms.environment.value.wrapT =
    Materials.SEM.uniforms.texture.value.wrapS =
    Materials.SEM.uniforms.texture.value.wrapT =
    Materials.SEM.uniforms.bump.value.wrapS =
    Materials.SEM.uniforms.bump.value.wrapT = THREE.ClampToEdgeWrapping;


    Materials.WOOD = Materials.SEM.clone();//new THREE.MeshPhongMaterial({ map:wood, ambient:0x808080 });
    Materials.WOOD.uniforms.environment.value = rubber;
    Materials.WOOD.uniforms.texture.value = wood;
    Materials.WOOD.uniforms.alpha.value = 1;
    Materials.WOOD.uniforms.type.value = 1;


    Materials.WING = Materials.SEM.clone();
    Materials.WING.uniforms.environment.value = gradient;
    Materials.WING.uniforms.texture.value = wood;
    Materials.WING.uniforms.alpha.value = .85;
    Materials.WING.uniforms.type.value = 3;
    Materials.WING.uniforms.grain.value = .5;
    Materials.WING.side = THREE.FrontSide;

    Materials.WIRE = new THREE.MeshBasicMaterial( { wireframe:true, color:0x808080} );


    Materials.MONUMENT = new THREE.MeshLambertMaterial(
        {
            color: 0xEEEEEE,
            side : THREE.DoubleSide
        });

   Materials.GLOBE = new THREE.MeshPhongMaterial({
        color      :  0xEEEEEE,
        shininess  :    20,
        envMap:         Skybox.material,
        bumpMap        :  heightMap,
        bumpScale  :  .25
    });

    Materials.GLOBE = Materials.SEM.clone();
    Materials.GLOBE.uniforms.grain.value = 0.5;
    Materials.GLOBE.uniforms.type.value = 3;
    Materials.GLOBE.uniforms.environment.value = gradient;
    Materials.GLOBE.uniforms.texture.value = earth_night;
    Materials.GLOBE.uniforms.bump.value = heightMap;
    Materials.GLOBE.uniforms.bumpAmount.value = .05;

    Materials.MONUMENT = Materials.GLOBE;


    Materials.NOISE=  noise;
    Materials.SECTION = new THREE.MeshBasicMaterial({map:noise});

    Materials.RING = Materials.SEM.clone();
    Materials.RING.uniforms.environment.value = brass;
    Materials.RING.uniforms.texture.value = noise;
    Materials.RING.uniforms.bump.value = noise;
    Materials.RING.uniforms.bumpAmount.value = .005;
    Materials.RING.uniforms.type.value = 4;
    Materials.RING.uniforms.grain.value = .5;

    Materials.PORTRAIT = Materials.SEM.clone();

    Materials.PORTRAIT.side = THREE.FrontSide;
    Materials.PORTRAIT.uniforms.environment.value = gradient;
    Materials.PORTRAIT.uniforms.texture.value = harriet_tra;
    Materials.PORTRAIT.uniforms.bump.value = harriet_nrm;
    Materials.PORTRAIT.uniforms.bumpAmount.value = .01;
    Materials.PORTRAIT.uniforms.type.value = 3;
    Materials.PORTRAIT.uniforms.grain.value = .65;


    Materials.plane = [



    ];

};
