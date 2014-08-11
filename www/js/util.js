/* jshint undef: true, asi: true, browser: true, devel: true */
/* global d3, _, $, cached_selectors, moment */

var util = {}
util.random = random
util.setLocalStorage = setLocalStorage
util.setSessionStorage = setSessionStorage
util.getSessionStorage = getSessionStorage
util.test_for_keys = test_for_keys
util.sanitize = sanitize
util.u_sanitize = u_sanitize
util.hsl = hsl
util.rgb = rgb
util.b = b
util.translate = translate
util.scale = scale

function random(begin,end){

  if(end === undefined){
    return Math.random() * begin
  } else {
    return (Math.random() * (end-begin)) + (begin)
  }

}

function setLocalStorage(key, value){
    window.localStorage[key] = JSON.stringify(value)
}

function getLocalStorage(key){

    if(window.localStorage[key] === undefined){
        console.log('Key not found in local storage.')
        return undefined
    } else {
        return JSON.parse(window.localStorage[key])
    }

}

function setSessionStorage(key, value){
    window.sessionStorage[key] = JSON.stringify(value)
}

function getSessionStorage(key){

    if(window.sessionStorage[key] === undefined){
        //console.log("Key not found in session storage.")
        return undefined
    } else {
        return JSON.parse(window.sessionStorage[key])
    }

}

function test_for_keys(object, array_of_keys){

    var found = true

    array_of_keys.forEach(function(key){

        if(object[key] === undefined){
            found = false
        }
    })

    return found;

}

var DV = 0
var DN = 1
var DE = 2

var debug_levels = [ 'verbose' , 'notice', 'error' ]

var CURRENT_DEBUG_LEVEL = DE

function l(lvl, msg, obj){

    if(lvl >= CURRENT_DEBUG_LEVEL){

        console.log(debug_levels[lvl] + ' :: ' + msg)
        if(obj !== undefined){
            if(CURRENT_DEBUG_LEVEL === DV){
                console.log(JSON.stringify(obj,null,2))
            } else {
                console.log(obj)
            }
        }
    }
}

var service_name_lut_reverse = {
    'VPC': 'VPC',
    'IAM': 'IAM',
    'GLO': 'Global',
    'EC2': 'EC2',
    'ELB': 'ELB',
    'R53': 'R53',
    'CLT': 'CloudTrail',
    'SSS': 'S3',
    'RDS': 'RDS',
    'DDB': 'DynamoDB',
    'CLF': 'CloudFormation',
    'RED': 'Redshift',
    'ELC': 'Elasticache',
    'WKS': 'Workspaces'
}

function sanitize(o){

    //console.log(o)

    var p = o

    p = p.replace(new RegExp('#', 'g'), '')
    p = p.replace(new RegExp('\\.', 'g'), '')
    p = p.replace(new RegExp(' ', 'g'), '')
    p = p.replace(new RegExp('-', 'g'), '')

    return p

}

function u_sanitize(o){
    if(o === undefined){
        return 0
    } else {
        return o
    }
}

function hsl(h,s,l){
    return 'hsl(' + h + ', ' + s + '%, ' + l +'%)'
}

function rgb(r,g,b){
    return 'rgb(' + r + ', ' + g + ', ' + b +')'
}

function b(v){
    return 'rgb(' + v + ', ' + v + ', ' + v +')'
}

function translate(x, y) {
    return 'translate('+x+', '+y+') '
}

function scale(x, y) {
    return 'scale('+x+', '+y+')'
}

function to_coords(t){
    var substrings = (t.substring(t.indexOf('(') + 1, t.indexOf(')')).split(',') )
    return [ parseFloat(substrings[0]), parseFloat(substrings[1]) ]
}

function create_margins(top, bottom, left, right){
    return {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        x: left + right,
        y: top + bottom
    }
}

// colors
var saturation_bottom = 5
var saturation_verylow = 40
var saturation_low = 55
var saturation_med = 70
var saturation_high = 85

var available_colors = [
    { name: 'blue',   h: 195, s: 100,     l: 37 },
    { name: 'red',    h: 0,   s: saturation_med,     l: 50 },
    { name: 'orange', h: 30,  s: saturation_high,    l: 50 },
    { name: 'yellow', h: 59,  s: saturation_low,     l: 50 },
    { name: 'green',  h: 119, s: saturation_verylow, l: 40 },
    { name: 'grey',   h: 206, s: saturation_bottom,  l: 70 },
]

var colors_lut = {}
var colors_array = []

available_colors.forEach(function(color){

    colors_lut[color.name] = hsl(color.h, color.s, color.l)

    if(color.name === 'blue'){
        colors_lut[color.name] = rgb(0,140,186)
    }

    colors_array.push(colors_lut[color.name])

    // colors_array.push('url(#linear_gradient_' + color.name +')')
    // colors_array.push('url(#radial_gradient_' + color.name +')')

})

colors_lut.high = colors_lut.red
colors_lut.medium = colors_lut.orange
colors_lut.low = colors_lut.yellow
