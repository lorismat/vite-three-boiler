// define-block
import {
	Object3D,
	AmbientLight,
	PointLight,
  PointLightHelper
} from 'three';

let mesh;

function init() {

	mesh = new Object3D();
	mesh.position.set( 0, 0, 0 );

	const ambient = new AmbientLight( 0x333333, 1.4 );
	mesh.add( ambient );

	const pointLight = new PointLight( 0xffffff, 0.3, 100 );
  pointLight.position.set( 2, 10, -2 );
  pointLight.castShadow = true;
  mesh.add( pointLight );

  const sphereSize = 1;
  const pointLightHelper = new PointLightHelper( pointLight, sphereSize );
  mesh.add( pointLightHelper );

  pointLight.shadow.mapSize.width = 1024
  pointLight.shadow.mapSize.height = 1024


	mesh.add( pointLight );

}

export { init, mesh };