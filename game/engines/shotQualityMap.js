const SHOT_QUALITY_MAP = {

close_central: 0.45,
close_left: 0.38,
close_right: 0.38,

box_central: 0.24,
box_left: 0.18,
box_right: 0.18,

halfspace_left: 0.13,
halfspace_right: 0.13,

wide_left: 0.08,
wide_right: 0.08,

long_center: 0.05,
long_left: 0.04,
long_right: 0.04,

corner_left: 0.02,
corner_right: 0.02

}

function getShotQuality(zone){
return SHOT_QUALITY_MAP[zone] || 0.05
}

module.exports = { getShotQuality }