import appConfig from "constants/appConfig";
import * as appStrings from "constants/appStrings";
import * as appStringsCore from "_core/constants/appStrings";
import MapWrapperCesiumCore from "_core/utils/MapWrapperCesium";

export default class MapWrapperCesium extends MapWrapperCesiumCore {
    initCesium(container, options) {
        MapWrapperCesiumCore.prototype.initCesium.call(this, container, options);

        window.CESIUM_BASE_URL = appConfig.CESIUM_BASE_URL;
    }

    /**
     * create a cesium layer corresponding to the
     * given layer
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {object|boolean} cesium layer object or false if it fails
     * @memberof MapWrapperCesium
     */
    createLayer(layer) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.createVector3DTilesLayer(layer);
            default:
                return MapWrapperCesiumCore.prototype.createLayer.call(this, layer);
        }
    }

    /**
     * create a wmts cesium layer corresponding
     * to the given layer
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {object|boolean} cesium layer object or false if it fails
     * @memberof MapWrapperCesium
     */
    createVector3DTilesLayer(layer) {
        try {
            let mapLayer = new this.cesium.Cesium3DTileset({
                url: layer.getIn(["mappingOptions", "url"])
            });
            mapLayer.style = new this.cesium.Cesium3DTileStyle({
                pointSize: 2
            });
            this.setLayerRefInfo(layer, mapLayer);
            return mapLayer;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.createVector3DTilesLayer:", err);
            return false;
        }
    }

    /**
     * add a layer to the map
     *
     * @param {object} mapLayer cesium layer object
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    addLayer(mapLayer) {
        switch (mapLayer._layerHandleAs) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.addVector3DTilesLayer(mapLayer);
            default:
                return MapWrapperCesiumCore.prototype.addLayer.call(this, mapLayer);
        }
    }

    /**
     * add a layer to the map
     *
     * @param {object} mapLayer cesium layer object
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    addVector3DTilesLayer(mapLayer) {
        try {
            this.map.scene.primitives.add(mapLayer);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.add3DLayer:", err);
            return false;
        }
    }

    /**
     * activate a layer on the map. This will create a new
     * cesium layer object and add it to the map
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    activateLayer(layer) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.activate3DLayer(layer);
            default:
                return MapWrapperCesiumCore.prototype.activateLayer.call(this, layer);
        }
    }

    /**
     * activate a layer on the map. This will create a new
     * cesium layer object and add it to the map
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    activate3DLayer(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));

            // check if layer already exists on map, just move to top
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                this.moveLayerToTop(layer);
                return true;
            }

            // layer does not exist so we must create it
            mapLayer = this.createLayer(layer);

            // if the creation failed
            if (!mapLayer) {
                return false;
            }

            // layer creation succeeded, add the layer to map and make it visible
            this.addLayer(mapLayer);
            mapLayer.show = true;
            return true;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.activate3DLayer:", err);
            return false;
        }
    }

    /**
     * return the set of layers matching the provided type
     *
     * @param {string} type (GIBS_raster|wmts_raster|xyz_raster|vector_geojson|vector_topojson|vector_kml)
     * @returns {array} list of matching cesium map layers
     * @memberof MapWrapperCesium
     */
    getMapLayers(type) {
        switch (type) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.map.scene.primitives;
            default:
                return MapWrapperCesiumCore.prototype.getMapLayers.call(this, type);
        }
    }

    /**
     * move a layer up in the display stack
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    moveLayerUp(layer) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.move3DLayerUp(layer);
            default:
                return MapWrapperCesiumCore.prototype.moveLayerUp.call(this, layer);
        }
    }

    /**
     * move a layer up in the display stack
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    move3DLayerUp(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let currIndex = mapLayers._primitives.indexOf(mapLayer);
                let index = this.findTopInsertIndexForLayer(mapLayers, mapLayer);
                if (++currIndex < index) {
                    mapLayers.raise(mapLayer);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.move3DLayerUp:", err);
            return false;
        }
    }

    /**
     * move a layer down in the display stack.
     * The layer will always be above the basemap, which
     * is always at the absolute bottom of the display
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    moveLayerDown(layer) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.move3DLayerDown(layer);
            default:
                return MapWrapperCesiumCore.prototype.moveLayerDown.call(this, layer);
        }
    }

    /**
     * move a layer down in the display stack.
     * The layer will always be above the basemap, which
     * is always at the absolute bottom of the display
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    move3DLayerDown(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let index = mapLayers._primitives.indexOf(mapLayer);
                if (index > 1) {
                    mapLayers.lower(mapLayer);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.move3DLayerDown:", err);
            return false;
        }
    }

    /**
     * update a layer on the map. This creates a new layer
     * and replaces the layer with a matching id
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    updateLayer(layer) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.update3DLayer(layer);
            default:
                return MapWrapperCesiumCore.prototype.updateLayer.call(this, layer);
        }
    }

    /**
     * update a layer on the map. This creates a new layer
     * and replaces the layer with a matching id
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    update3DLayer(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let updatedMapLayer = this.createLayer(layer);
                let index = mapLayers._primitives.indexOf(mapLayer);
                mapLayers.remove(mapLayer);
                mapLayers.add(updatedMapLayer, index);
            }
            return true;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.update3DLayer:", err);
            return false;
        }
    }

    /**
     * move a layer to the top of the map display stack
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    moveLayerToTop(layer) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_VECTOR_3D_TILES:
                return this.move3DLayerToTop(layer);
            default:
                return MapWrapperCesiumCore.prototype.moveLayerToTop.call(this, layer);
        }
    }

    /**
     * move a layer to the top of the map display stack
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    move3DLayerToTop(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let currIndex = mapLayers._primitives.indexOf(mapLayer);
                let index = this.findTopInsertIndexForLayer(mapLayers, mapLayer);
                while (++currIndex < index) {
                    // use raise so that we aren't re-requesting tiles every time
                    mapLayers.raise(mapLayer);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.move3DLayerToTop:", err);
            return false;
        }
    }

    /**
     * set the opacity of a layer on the map
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @param {number} opacity value of the opacity [0.0 - 1.0]
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    setLayerOpacity(layer, opacity) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer && typeof mapLayer.alpha !== "undefined") {
                mapLayer.alpha = opacity;
                return true;
            } else if (
                mapLayer._layerHandleAs === appStrings.LAYER_VECTOR_GEOJSON ||
                mapLayer._layerHandleAs === appStrings.LAYER_VECTOR_TOPOJSON ||
                mapLayer._layerHandleAs === appStrings.LAYER_VECTOR_KML
            ) {
                mapLayer.entities._entities._array.map(entity => {
                    if (entity.polygon) {
                        if (entity.polygon.outlineColor) {
                            let c = entity.polygon.outlineColor.getValue();
                            c.alpha = opacity * 1.0;
                            entity.polygon.outlineColor.setValue(c);
                        }
                        if (entity.polygon.fill) {
                            let c = entity.polygon.fill.getValue();
                            c.alpha = opacity * 0.5;
                            entity.polygon.fill.setValue(c);
                        }
                        if (entity.polygon.material) {
                            if (entity.polygon.material.color) {
                                let c = entity.polygon.material.color.getValue();
                                c.alpha = opacity * 0.5;
                                entity.polygon.material.color.setValue(c);
                            }
                        }
                    }
                    if (entity.polyline) {
                        let c = entity.polyline.material.color.getValue();
                        c.alpha = opacity * 1.0;
                        entity.polyline.material.color.setValue(c);
                    }
                    if (entity.billboard) {
                        let c = entity.billboard.color.getValue();
                        c.alpha = opacity * 1.0;
                        entity.billboard.color.setValue(c);
                    }
                    if (entity.point) {
                        let c = entity.point.color.getValue();
                        c.alpha = opacity * 1.0;
                        entity.point.color.setValue(c);
                    }
                });
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.setLayerOpacity:", err);
            return false;
        }
    }

    addDrawHandler(geometryType, onDrawEnd, interactionType) {
        try {
            const interactionId = `_id${interactionType}${geometryType}`;
            const baseGeometry = {
                proj: appStringsCore.PROJECTIONS.latlon.code,
                type: geometryType
            };

            if (geometryType === appStringsCore.GEOMETRY_CIRCLE) {
                this.drawHandler._customInteractions[interactionId] = () => {
                    this.drawHandler.startDrawingCircle({
                        callback: (center, radius) => {
                            // Add geometry to cesium map since it's not done automatically
                            this.addGeometry(
                                {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    center: center,
                                    radius: radius,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTESIAN
                                },
                                interactionType
                            );
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCenter = this.cartesianToLatLon(center);
                                let geometry = {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    center: cartographicCenter,
                                    radius: radius,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        }
                    });
                };
                return true;
            } else if (
                geometryType === appStringsCore.GEOMETRY_LINE_STRING ||
                geometryType === appStringsCore.GEOMETRY_LINE
            ) {
                const maxPoints = geometryType === appStringsCore.GEOMETRY_LINE ? 2 : undefined;
                this.drawHandler._customInteractions[interactionId] = () => {
                    this.drawHandler.startDrawingPolyline({
                        callback: coordinates => {
                            // Add geometry to cesium map since it's not done automatically
                            this.addGeometry(
                                {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: coordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTESIAN
                                },
                                interactionType
                            );
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCoordinates = coordinates.map(pos => {
                                    return this.cartesianToLatLon(pos);
                                });
                                let geometry = {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: cartographicCoordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        },
                        maxPoints: maxPoints
                    });
                };
                return true;
            } else if (geometryType === appStringsCore.GEOMETRY_POLYGON) {
                this.drawHandler._customInteractions[interactionId] = () => {
                    this.drawHandler.startDrawingPolygon({
                        callback: coordinates => {
                            // Add geometry to cesium map since it's not done automatically
                            this.addGeometry(
                                {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: coordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTESIAN
                                },
                                interactionType
                            );
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCoordinates = coordinates.map(pos => {
                                    return this.cartesianToLatLon(pos);
                                });
                                let geometry = {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: cartographicCoordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        }
                    });
                };
                return true;
            } else if (geometryType === appStringsCore.GEOMETRY_POINT) {
                this.drawHandler._customInteractions[interactionId] = () => {
                    this.drawHandler.startDrawingMarker({
                        callback: coordinates => {
                            // Add geometry to cesium map since it's not done automatically
                            this.addGeometry(
                                {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: coordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTESIAN
                                },
                                interactionType
                            );
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCoordinates = this.cartesianToLatLon(coordinates);
                                let geometry = {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: cartographicCoordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        }
                    });
                };
                return true;
            } else if (geometryType === appStringsCore.GEOMETRY_BOX) {
                this.drawHandler._customInteractions[interactionId] = () => {
                    this.drawHandler.startDrawingExtent({
                        callback: extent => {
                            const coordinates = this.drawHandler.getExtentCorners(extent);
                            // Add geometry to cesium map since it's not done automatically
                            this.addGeometry(
                                {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: coordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTESIAN
                                },
                                interactionType
                            );
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCoordinates = coordinates.map(pos => {
                                    return this.cartesianToLatLon(pos);
                                });
                                let geometry = {
                                    ...baseGeometry,
                                    id: Math.random(),
                                    coordinates: cartographicCoordinates,
                                    coordinateType: appStringsCore.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        }
                    });
                };
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.addDrawHandler:", err);
            return false;
        }
    }

    addGeometry(geometry, interactionType, geodesic = false) {
        const getGeomCartesianCoords = (geometry, multiplePoints = true) => {
            let cartesianCoords = null;
            // Check coordinate type
            if (geometry.coordinateType === appStringsCore.COORDINATE_TYPE_CARTOGRAPHIC) {
                // Transform coordinates from cartographic to cartesian
                if (multiplePoints) {
                    cartesianCoords = geometry.coordinates.map(x => {
                        return this.latLonToCartesian(x.lat, x.lon);
                    });
                } else {
                    const rawCoords = geometry.coordinates;
                    cartesianCoords = this.latLonToCartesian(rawCoords.lat, rawCoords.lon);
                }
            } else if (geometry.coordinateType === appStringsCore.COORDINATE_TYPE_CARTESIAN) {
                cartesianCoords = geometry.coordinates;
            } else {
                console.warn(
                    `Unhandled coordinate type when trying to draw cesium ${geometry.type}:`,
                    geometry.coordinateType
                );
                return false;
            }
            return cartesianCoords;
        };
        const getShapeMaterial = () => {
            let material = this.cesium.Material.fromType(this.cesium.Material.RimLightingType);
            material.uniforms.color = new this.cesium.Color.fromCssColorString(
                appConfig.GEOMETRY_FILL_COLOR
            );
            material.uniforms.rimColor = new this.cesium.Color.fromCssColorString(
                appConfig.GEOMETRY_FILL_COLOR
            );
            return material;
        };

        try {
            if (geometry.type === appStringsCore.GEOMETRY_CIRCLE) {
                let cesiumCenter = geometry.center;
                // Check coordinate type
                if (geometry.coordinateType === appStringsCore.COORDINATE_TYPE_CARTOGRAPHIC) {
                    cesiumCenter = this.latLonToCartesian(geometry.center.lat, geometry.center.lon);
                }
                const material = getShapeMaterial();
                let primitiveToAdd = new this.drawHelper.CirclePrimitive({
                    center: cesiumCenter,
                    radius: geometry.radius,
                    material: material,
                    showDrawingOutline: true
                });
                primitiveToAdd.id = geometry.id;
                primitiveToAdd._interactionType = interactionType;
                primitiveToAdd.setStrokeStyle(
                    new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_STROKE_COLOR),
                    appConfig.GEOMETRY_STROKE_WEIGHT
                );
                this.map.scene.primitives.add(primitiveToAdd);
                return true;
            } else if (
                geometry.type === appStringsCore.GEOMETRY_LINE_STRING ||
                geometry.type === appStringsCore.GEOMETRY_LINE
            ) {
                let cartesianCoords = getGeomCartesianCoords(geometry, true);
                let material = this.cesium.Material.fromType(this.cesium.Material.ColorType);
                material.uniforms.color = new this.cesium.Color.fromCssColorString(
                    appConfig.GEOMETRY_STROKE_COLOR
                );
                let primitiveToAdd = new this.drawHelper.PolylinePrimitive({
                    positions: cartesianCoords,
                    // width: appConfig.GEOMETRY_STROKE_WEIGHT,
                    width: 1.0, // match the other shapes
                    material: material,
                    showDrawingOutline: true,
                    geodesic: true
                });
                primitiveToAdd._interactionType = interactionType;
                primitiveToAdd.id = geometry.id;
                this.map.scene.primitives.add(primitiveToAdd);
                return true;
            } else if (
                geometry.type === appStringsCore.GEOMETRY_POLYGON ||
                geometry.type === appStringsCore.GEOMETRY_BOX
            ) {
                const cartesianCoords = getGeomCartesianCoords(geometry, true);
                const material = getShapeMaterial();
                let primitiveToAdd = new this.drawHelper.PolygonPrimitive({
                    positions: cartesianCoords,
                    material: material,
                    showDrawingOutline: true
                });
                primitiveToAdd.id = geometry.id;
                primitiveToAdd._interactionType = interactionType;
                primitiveToAdd.setStrokeStyle(
                    new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_STROKE_COLOR),
                    appConfig.GEOMETRY_STROKE_WEIGHT
                );
                this.map.scene.primitives.add(primitiveToAdd);
                return true;
            } else if (geometry.type === appStringsCore.GEOMETRY_POINT) {
                let cartesianCoords = getGeomCartesianCoords(geometry, false);
                const pointPrimitive = new this.cesium.PointPrimitive({
                    position: cartesianCoords,
                    color: new this.cesium.Color.fromCssColorString(
                        appConfig.GEOMETRY_STROKE_COLOR
                    ),
                    outlineColor: new this.cesium.Color(0.0, 0.0, 0.0, 1.0),
                    outlineWeight: appConfig.GEOMETRY_STROKE_WEIGHT,
                    pixelSize: 8.0
                });
                pointPrimitive.id = geometry.id;
                // add to our persistent PointPrimitiveCollection
                this.pointCollection.add(pointPrimitive);
                return true;
            }

            console.warn("add geometry not complete in cesium", geometry, " is unsupported");
            return false;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.addGeometry:", err);
            return false;
        }
    }

    resetView() {
        this.setExtent(appConfig.DEFAULT_BBOX_EXTENT);
    }

    getDataAtPoint(coords, pixel, palettes) {
        const features = this.map.scene.drillPick({ x: pixel[0], y: pixel[1] }, 5);
        const data = features.reduce((acc, feature) => {
            let f = feature.primitive;
            if (f._interactionType === appStringsCore.INTERACTION_DRAW) {
                acc.push({
                    layerId: "_vector_drawings",
                    feature: f,
                    featureId: feature.id
                });
            }
            return acc;
        }, []);
        return data.slice(0, 1);
    }

    removeShape(shapeId) {
        try {
            let rFeature = false;
            let pList = this.map.scene.primitives;
            for (let i = 0; i < pList.length; ++i) {
                let f = pList.get(i);
                if (f.id === shapeId) {
                    rFeature = f;
                    break;
                }
            }

            if (rFeature) {
                pList.remove(rFeature);
            }
            return true;
        } catch (err) {
            console.warn(`WARN: could not remove shape with id ${shapeId}`, err);
            return false;
        }
    }

    addEventListener(eventStr, callback) {
        try {
            switch (eventStr) {
                case appStrings.EVENT_MOVE_START:
                    this.map.camera.moveStart.addEventListener(callback);
                    return true;

                default:
                    return MapWrapperCesiumCore.prototype.addEventListener.call(
                        this,
                        eventStr,
                        callback
                    );
            }
        } catch (err) {
            console.warn("Error in MapWrapperCesium.addEventListener:", err);
            return false;
        }
    }
}
