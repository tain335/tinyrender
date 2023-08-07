import React, { useEffect, useRef } from 'react';
import './App.css';
import { Sphere } from './entities/Sphere';
import { AmbientLight } from './lights/AmbientLight';
import { DirectionLight } from './lights/DirectionLight';
import { PointLight } from './lights/PointLight';
import { TracyRayRender } from './render/TracyRayRender';
import { RGB } from './utils/Color';
import { Point } from './utils/Point';
import { Vector } from './utils/Vector';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const renderer = new TracyRayRender(
      (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D,
    );
    renderer
      .setCanvasSize(600, 600)
      .setLights([
        new AmbientLight(0.2),
        new PointLight(new Point(2, 1, 0), 0.6),
        new DirectionLight(new Vector(1, 4, 4), 0.2),
      ])
      .setViewport(1, 1)
      .setEntities([
        new Sphere(new Point(0, -1, 3), 1, new RGB(255, 0, 0), 500, 0.2),
        new Sphere(new Point(-2, 0, 4), 1, new RGB(0, 255, 0), 10, 0.4),
        new Sphere(new Point(2, 0, 4), 1, new RGB(0, 0, 255), 500, 0.3),
        new Sphere(new Point(0, -5001, 0), 5000, new RGB(255, 255, 0), 1000, 0.5),
      ]);
    // renderer.setCameraPosition(new Point(-0.5, -0.5, 0));
    renderer.render();
    if (canvasRef.current) {
      const react = canvasRef.current.getBoundingClientRect();

      canvasRef.current?.addEventListener('mousemove', (event) => {
        const left = event.pageX - react.left;
        const top = event.pageY - react.top;

        renderer.setCameraPosition(
          new Point((left - react.width / 2) / (react.width / 2), (react.height / 2 - top) / (react.height / 2), 0),
        );
        renderer.render();
      });
    }
  }, []);
  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} id="canvas" style={{ width: 600, height: 600 }} />
    </div>
  );
}

export default App;
