import React from 'react'
import Svg, { G, Path } from 'react-native-svg'
// import { connect } from 'react-redux'
import { Icon } from '../../@types'

/** A pencil icon. */
const PencilIcon = ({ size = 20, fill }: Icon) => (
  <Svg fill={fill} x='0px' y='0px' width={size} height={size} viewBox='0 0 98 98'>
    <G translate={[0, -952.36218]}>
      <Path d='m 84.656385,968.51845 a 2.0002002,2.0002002 0 0 0 -1.4062,0.5937 l -49.5,49.50005 a 2.0002002,2.0002002 0 0 0 -0.5312,1.0313 l -2.8438,14.125 a 2.0002002,2.0002002 0 0 0 2.3438,2.375 l 14.1562,-2.8438 a 2.0002002,2.0002002 0 0 0 1.0312,-0.5312 l 49.5,-49.50005 a 2.0002002,2.0002002 0 0 0 0,-2.8438 l -11.3124,-11.3125 a 2.0002002,2.0002002 0 0 0 -1.0313,-0.5313 2.0002002,2.0002002 0 0 0 -0.4063,-0.062 z m 0.031,4.8437 8.4687,8.4687 -47.6562,47.62505 -10.5938,2.1563 2.0938,-10.5625 47.6875,-47.68755 z M 5.0001847,1030.2059 c -1.6568,0 -3,1.3432 -3,3 0,1.6568 1.3432,3 3,3 l 18.0000003,0 c 1.6568,0 3,-1.3432 3,-3 0,-1.6568 -1.3432,-3 -3,-3 l -18.0000003,0 z' />
    </G>
  </Svg>
)

export default PencilIcon
