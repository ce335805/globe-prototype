import * as Three from 'three'
export default  class Ellipse extends Three.Curve {

    constructor( xRadius, yRadius ) {
        super();
        // add radius as a property
        this.xRadius = xRadius;
        this.yRadius = yRadius;
    }

    getPoint( t, optionalTarget = new Three.Vector3() ) {

        // eslint-disable-next-line no-unused-vars
        const point = optionalTarget;
        var radians = 2 * Math.PI * t;

        return new Three.Vector3( this.xRadius * Math.cos( radians ),
            this.yRadius * Math.sin( radians ),
            0 );
    }
}
