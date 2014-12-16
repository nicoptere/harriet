var i = 0;
var T = {};
T.ELEMENT = i++;
T.ENGINE = i++;
T.EXTRA_ENGINE = i++;
T.COCKPIT = i++;
T.DIRECTION = i++;
T.WING = i++;
T.WHEEL = i++;
T.BLOCK = i++;
T.STICK = i++;
T.CABLE = i++;
T.EMPTY = i++;
T.MONUMENT = i++;

var Generator = function()
{
    this.config = [];
    this.minY = 0;
};


Generator.prototype =
{

    generate  :function( plane, length )
    {

        length = length || 3;

        this.config =
        [
            this.getParamObject( "c", T.COCKPIT )
        ];

        var i;
        for( i = 0; i< length; i++ )
        {
            var r = PRNG.random();

            var el = this.getParamObject( "b_" + i, PRNG.random() >.75 ? T.BLOCK : T.EMPTY );
            el.pos.y = random( -1, 2 );

            if( PRNG.random() > .5  )
            {
                this.config.unshift( el );
            }
            else
            {
                this.config.push( el );
            }
        }

        this.config.unshift( this.getParamObject( "e", T.ENGINE ) );
        this.config.push( this.getParamObject( "d", T.DIRECTION ) );

        var offx = 0;
        var offy = 0;
        for( i = 0; i < this.config.length - 1; i++ )
        {

            var el0 = this.config[ i ];
            var el1 = this.config[ i + 1 ];
            offx += 1;
            offy += el1.pos.y;
            el1.pos.x = offx;
            el1.pos.y = offy;

        }
        offy-=1;
        //console.log( this.config, offx, offy );
        plane.offset = new THREE.Vector3( -offx / 2, -offy / 2, 0 );

    },

    build : function( plane, cableRatio, thickness )
    {

        var scope = this;

        Plane3d.container.children.reverse();
        if( Plane3d.container.children.length > 0 )
        {
            var d = 1;

            Plane3d.container.children.forEach( function( m, i, arr ) {

                    TweenLite.to(m, 0, {
                        delay:.5  * ( i / arr.length ),
                        //value:0,
                        onComplete: function () {
                            Plane3d.container.remove(m);
                        }
                    } );

            } );

            TweenLite.to( plane.rotation,.5,
                {
                    y:-Math.PI * 2 + plane.rotation.y,
                    onComplete : function()
                    {
                        scope.build( plane, cableRatio, thickness  );
                    } } );
            return;


        }

        plane.elements = [];


        var min = new Point(10e10, 10e10, 10e10);
        var max = new Point(10e-10, 10e-10, 10e-10);

        this.config.forEach( function( el )
        {

            var part = new Part( el.pos, el.type );
            plane.elements.push( part );

            if( el.pos.x < min.x )min.x = el.pos.x;
            if( el.pos.y < min.y )min.y = el.pos.y;

            if( el.pos.x > max.x )max.x = el.pos.x;
            if( el.pos.y > max.y )max.y = el.pos.y;

        });


        var validType = [ T.ENGINE, T.DIRECTION, T.COCKPIT ];
        plane.elements.forEach( function( e,i,arr )
        {

            //if( e.type == T.ENGINE    )scope.appendWheels( plane, e, 1 );
            if( e.type == T.COCKPIT   )scope.appendWheels( plane, e,1 );
            if( validType.indexOf(e.type )!=-1 )scope.wings( plane, e, min.y );

            if( e.type == T.COCKPIT && arr[ i - 1].type == T.EMPTY )
            {

                if( PRNG.random() > 0 )
                {
                    var pos = e.position.clone();
                    pos.x -= .5;
                    pos.y -= .5;
                    var p = new Part( pos, T.EXTRA_ENGINE );
                    new Engine( p );
                    plane.elements.push( p );
                }

            }

        });

        Generator.minY = this.minY;

        this.sticks( plane, .5, thickness );
        this.bind( plane, .5 );

        plane.elements.forEach( function( e,i,arr )
        {
            Plane3d.container.remove(e);
            TweenLite.to( e, ( i/arr.length ) *.5, { onComplete:function()
            {
                Plane3d.container.add(e);
            }})
        });

        TweenLite.to( Plane3d.container.position,.5,{ x:plane.offset.x, y:plane.offset.y } );

    },

    appendWheels : function( plane, element, scale )
    {

        var w = new Wheel( element, scale );
        element.hasWheels = true;

    },

    wings : function( plane, element, size )
    {
        var w = new Wing( element, plane, 0 );
    },

    sticks : function( plane, ratio, thickness )
    {
        var tmp = [];
        var sticks = [];
        var validType = [T.BLOCK, T.EXTRA_ENGINE,  T.ENGINE, T.DIRECTION, T.COCKPIT ];
        for( var i = 0; i< plane.elements.length - 1; i++ )
        {


            var el0 = plane.elements[ i ];
            if( el0.type == T.EMPTY )continue;

            var el1 = plane.elements[ i + 1 ];
            while( el1.type == T.EMPTY || el1.type == T.STICK  )
            {
                i++;
                if( i >= plane.elements.length - 1 )break;
                el1 = plane.elements[ i + 1 ];
                if( el1.type == T.STICK )break;
            }
            if( el0.type == T.STICK || el1.type == T.STICK )continue;

            plane.elements.push( new Stick( el0, el1, "front", "left", thickness ) );
            plane.elements.push( new Stick( el0, el1, "back", "left", thickness ) );
            plane.elements.push( new Stick( el0, el1, "front", "center", thickness ) );
            plane.elements.push( new Stick( el0, el1, "back", "center", thickness ) );

            tmp = tmp.concat( sticks );
        }

        //plane.elements = plane.elements.concat( tmp );
    },


    bind : function( plane, ratio )
    {
        var tmp = [];

        var validType = [ T.ENGINE, T.DIRECTION, T.COCKPIT ];

        for( var i = 0; i< plane.elements.length - 1; i++ )
        {
            var el0 = plane.elements[ i ];
            if( validType.indexOf( el0.type ) == -1 )continue;

            var el1 = plane.elements[ i + 1 ];while( validType.indexOf( el1.type ) == -1 )
            {
                i++;
                if( i >= plane.elements.length - 1 )break;
                el1 = plane.elements[ i + 1 ];
            }
            if( el1 == null )continue;
            if( validType.indexOf( el1.type ) == -1 )continue;
            if( el0.type == T.STICK || el1.type == T.STICK )continue;

            if( PRNG.random() > ratio )plane.elements.push( new Cable( el0, el1, "front", "right"  ) );
            if( PRNG.random() > ratio )plane.elements.push( new Cable( el0, el1, "back", "right" ) );
            if( PRNG.random() > ratio )plane.elements.push( new Cable( el0, el1, "front", "center"  ) );
            if( PRNG.random() > ratio )plane.elements.push( new Cable( el0, el1, "back", "center" ) );
            if( PRNG.random() > ratio )plane.elements.push( new Cable( el0, el1, "front", "left"  ) );
            if( PRNG.random() > ratio )plane.elements.push( new Cable( el0, el1, "back", "left" ) );

        }
        //plane.elements = plane.elements.concat( tmp );
    },

    getParamObject : function( id, type )
    {
        return { id: id, type:type, pos:new Point() };
    }

};