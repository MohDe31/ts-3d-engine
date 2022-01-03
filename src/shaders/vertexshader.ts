export const VERTEX_SHADER: string = `

precision mediump float;

const int MAX_ITERATIONS = 6;

attribute vec3 a_position;
attribute vec3 a_normal;

attribute vec4 a_color;

uniform vec2 u_size;
uniform vec3 u_camPosition;
uniform vec3 u_camRotation;

uniform vec3 u_lights[6];
uniform int u_lightsCount;
uniform float u_f;

varying vec4 v_color;

vec3 rotate(vec3 point, vec3 rotation)
{
    vec3 cos_ = cos(rotation);
    vec3 sin_ = sin(rotation);

    vec3 result = vec3(
        point.x * (cos_.z*cos_.y-sin_.x*sin_.y*sin_.z) - point.y * sin_.z * cos_.x + point.z * (cos_.z*sin_.y+sin_.x*sin_.z*cos_.y),
        point.x * (sin_.z*cos_.y+cos_.z*sin_.x*sin_.y) + point.y * cos_.z * cos_.x + point.z * (sin_.z*sin_.y-cos_.z*sin_.x*cos_.y),
        point.x * cos_.x * -sin_.y + point.y * sin_.x + point.z * cos_.x * cos_.y
    );

    return result;
}

void main(void){
    vec3 camTranslatedPoint = rotate(a_position - u_camPosition, -u_camRotation);
    

    if(camTranslatedPoint.z < 0.0)
    {
        return;
    }

    vec2 uv = vec2(camTranslatedPoint.x / camTranslatedPoint.z, camTranslatedPoint.y / camTranslatedPoint.z);

    float intensity = 0.0;

    for(int i = 0; i < MAX_ITERATIONS; i++) {
        if(i >= u_lightsCount){break;}
        float dp = dot(a_normal, u_lights[i]);
        if(dp >= 0.0){
            dp = 0.0;
        }else{
            dp = -dp;
        };

        intensity += dp;
        if(intensity >= 1.0){
            intensity = 1.0;
            break;
        }
    };

    gl_Position = vec4(((u_f * uv + (u_size / 2.0)) / u_size) * 2.0 - 1.0,  1.0, 1.0);
    
    v_color = vec4(a_color.rgb * intensity, a_color.a);
}

`;
