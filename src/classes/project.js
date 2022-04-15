import archClass from "./arch";

export default class projectClass {
    //hamburgCoords = [0.915, 0.1740];
    //coordinates = [0., 0.];
    //isMoon = false;
    //arch = null;
    //title = '';
    //description = '';
    //imgUrl = '';
    //url = '';
    //distance = 0;

    constructor(coordinates, isMoon, title, description, url, imgName) {

        this.hamburgCoords = [0.915, 0.1740];

        this.isMoon = isMoon;
        this.coordinates = coordinates;
        this.arch = new archClass(this.hamburgCoords, this.coordinates, isMoon);
        this.distance = this.arch.onLandDistance;
        this.title = title;
        this.description = description;
        this.url = url;
        this.imgName = imgName;
    }

    getArchMesh(){
        return this.arch.curveMesh;
    }
    getTubeMesh(){
        return this.arch.tubeMesh;
    }
}
