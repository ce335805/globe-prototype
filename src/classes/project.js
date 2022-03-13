import archClass from "@/classes/arch";

export default class projectClass {
    hamburgCoords = [0.915, 0.1740];
    coordinates = [0., 0.];
    isMoon = false;
    arch = null;
    title = '';
    description = '';
    imgUrl = '';
    url = '';
    distance = 0;

    constructor(coordinates, isMoon, title, description, url, imgUrl) {
        this.isMoon = isMoon;
        this.coordinates = coordinates;
        this.arch = new archClass(this.hamburgCoords, this.coordinates, isMoon);
        this.distance = this.arch.onLandDistance;
        this.title = title;
        this.description = description;
        this.url = url;
        this.imgUrl = imgUrl;
    }

    getArchMesh(){
        return this.arch.curveMesh;
    }
    getTubeMesh(){
        return this.arch.tubeMesh;
    }
}