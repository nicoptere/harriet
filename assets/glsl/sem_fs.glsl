
uniform float alpha;
uniform sampler2D environment;
uniform sampler2D texture;
uniform sampler2D bump;
uniform float bumpAmount;

uniform int type;
uniform float time;
uniform float grain;

varying vec2 vN;
varying vec2 vUv;
varying vec3 vNorm;
varying vec3 vPos;
varying float vBump;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}



void main()
{

    vec3 env = texture2D( environment, vN ).rgb;

    vec3 final;
    vec3 tex;
    if( type == 0 )
    {
        final = env;
    }


    if( type == 1 )
    {
        if( grain != .0 )env -= vec3( rand( vUv * vN ) * grain * ( 1. - length( vN ) ) );
        final = env;
        final += vBump * 4.;
    }

    if( type == 2 )
    {
        tex = texture2D( texture, vUv ).rgb;
        final = mix( tex, env, 1. - pow( length( vN - vec2(.5) ), 3. ) );
        if( grain != .0 )tex += vec3( rand( vUv * vN ) * grain );
        final += vBump * 4.;
    }

    if( type == 3 )
    {
        tex = texture2D( texture, vUv ).rgb;

        if( grain != .0 )tex += vec3( rand( vUv * vN ) * grain );

        final = mix( tex, env, 1. - pow( length( vN - vec2(.5) ), 2.5 ) );

        final += vBump * 4.;
    }

    if( type == 4 )
    {

        tex = texture2D( texture, vUv ).rgb;
        vec3 bum = texture2D( bump, vN - vec2(.0,.5) ).rgb;

        if( grain != .0 )tex += vec3( rand( vUv * vN ) * grain );

        final = mix( tex, env, 1.-pow( length( vN - vec2(0.5,.5) ), 3. ) );

        //final += .3 * bum;
    }

    /*
    float steps = 32.;
    final.x = float( int( ( final.x * steps ) + .5 ) ) * ( 1. / steps );
    final.y = float( int( ( final.y * steps ) + .5 ) ) * ( 1. / steps );
    final.z = float( int( ( final.z * steps ) + .5 ) ) * ( 1. / steps );
    //*/

    float delta = ( time * length( vPos ) /gl_FragColor.w );// * alpha;
    gl_FragColor = vec4( final, alpha * ( 1. - time ) );


    /*
    float _BrightnessAmount = 1.0;
    float _SaturationAmount = 1.0;
    float _ContrastAmount   = 1.0;
    gl_FragColor = vec4( ContrastSaturationBrightness( final, _BrightnessAmount, _SaturationAmount, _ContrastAmount), alpha );
    //*/

}


vec3 ContrastSaturationBrightness( vec3 color, float brt, float sat, float con)
{
    vec3 brtColor = color * brt;
    float intensityf = dot( brtColor, vec3(0.2125,0.7154,0.0721) );
    vec3 satColor = mix( vec3(intensityf), brtColor, sat );
    return mix( vec3( .5 ), satColor, con);
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}